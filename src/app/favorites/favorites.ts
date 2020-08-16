import { Component, NgZone, OnInit } from '@angular/core';
import { NavParams, LoadingController, AlertController, ModalController } from '@ionic/angular';
import { RoutinesProvider } from '../services/routines/routines';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { APIServiceProvider } from '../services/api-service/api-service';
import { TranslateService } from '@ngx-translate/core';
import { Network } from '@ionic-native/network/ngx';
import { Constants } from '../services/constants';
import { Storage } from '@ionic/storage';
import { Events } from '../services/events';

/**
 * Generated class for the FavoritesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'app-favorites',
  templateUrl: 'favorites.html',
  styleUrls: ['./favorites.scss'],
  providers: [NavParams],
})
export class FavoritesPage implements OnInit {
  public program1 : any;
  public program2 : any;
  public program3 : any;
  public program4 : any;
  private responseData : any;
  public response_text : string;
  public saveRoutineForm : FormGroup;
  public showSaveForm : boolean = true;
  public favoritesList : any;
  public showLoadingListing : boolean = false;
  public isDeviceOnline : boolean;
  public offline_device : string;

  ngOnInit() {
  }
  
  constructor(public navParams: NavParams, public viewCtrl: ModalController, public routines: RoutinesProvider,
    private formBuilder: FormBuilder, private translateService: TranslateService, private storage: Storage,
    public apiService : APIServiceProvider, private network: Network, public loadingCtrl: LoadingController,
    public alertCtrl : AlertController, private zone: NgZone, public events: Events) {
    this.isDeviceOnline = true;
    var programs = this.routines.getPrograms();
    if(programs[0] && programs[1] && programs[2] && programs[3]){
      this.program1 = programs[0];
      this.program2 = programs[1];
      this.program3 = programs[2];
      this.program4 = programs[3];
    }
    this.saveRoutineForm = this.formBuilder.group({
      name: ['', Validators.required]
    });
    if(navParams.get('showSave'))
      this.showSaveForm = true;
    else
      this.showSaveForm = false;

    // watch network for a disconnect
    this.network.onDisconnect().subscribe(() => {
      this.zone.run(() => {
        this.isDeviceOnline = false;
      });
    });

    // watch network for a connection
    this.network.onConnect().subscribe(() => {
      this.zone.run(() => {
        this.isDeviceOnline = true;

        this.storage.get(Constants.deviceInfoKey).then((device)=>{
          this.loadFavoriteList(device.email);
        });
      });
    });
  }

  showProgram(id, name, program1, program2, program3, program4){

    this.storage.get(Constants.storageKeyLang).then((lang)=>{
      this.translateService.getTranslation(lang).subscribe(async (value) => {
        let program_1 = (program1 == 'E-SMOG' ? program1 : value[program1]);
        let program_2 = (program2 == 'E-SMOG' ? program2 : value[program2]);
        let program_3 = (program3 == 'E-SMOG' ? program3 : value[program3]);
        let program_4 = (program4 == 'E-SMOG' ? program4 : value[program4]);
        let alert = await this.alertCtrl.create({
          header: 'Rutina - ' + name,
          message: program_1 + '\n' + program_2 + '\n' + program_3 + '\n' + program_4,
          buttons: [
                    {
                      text: value['choose'],
                      handler: data => {
                        this.events.publish('addProgramsEvent', {
                          program1: { name : program1 }, 
                          program2: { name : program2 }, 
                          program3: { name : program3 }, 
                          program4: { name : program4 }
                        });
                      }
                    }
                  ]
        });
        await alert.present();
        // Mostrar texto en label debajo del boton
      });
    });

  }

  ionViewDidEnter() {
    this.storage.get(Constants.deviceInfoKey).then((device)=>{
      if(typeof device !== 'undefined' && device != null)
        this.loadFavoriteList(device.email);
    });
  }

  loadFavoriteList(email){
    var formData = new FormData();

    //formData.append('uuid', uuid);
    formData.append('type', 'get');
    formData.append('email', email);
    if(this.isDeviceOnline){
      this.showLoadingListing = true;
      this.apiService.runPost('favorites.php',formData).then((result) => {
        this.showLoadingListing = false;
        this.responseData = result;
        this.favoritesList = this.responseData.favorites;

      },(err) => {
        this.showLoadingListing = false;
        console.log(err);
      });
    }
  }

  dismiss(event : Event) {
    if(event){
      event.preventDefault();
      event.stopPropagation();
    }
    this.viewCtrl.dismiss();
  }

  delete(event: Event, id){
    if(event){
      event.preventDefault();
      event.stopPropagation();
    }

    var formData = new FormData();

    //formData.append('uuid', uuid);
    formData.append('type', 'del');
    formData.append('id', id);

    this.apiService.runPost('favorites.php',formData).then((result) => {
      this.storage.get(Constants.deviceInfoKey).then((device)=>{
        this.loadFavoriteList(device.email);
      });
    });
  }

  attemptSaveFavorite(){
    this.response_text = '';

    this.storage.get(Constants.deviceInfoKey).then((device)=>{

      var formData = new FormData();

      formData.append('type', 'new');
      formData.append('email', device.email);
      formData.append('name', this.saveRoutineForm.value.name);
      formData.append('program1', this.program1);
      formData.append('program2', this.program2);
      formData.append('program3', this.program3);
      formData.append('program4', this.program4);


      this.apiService.runPost('favorites.php',formData).then((result) => {
        this.responseData = result;
        if(this.responseData.status == 'ok'){
            this.showSaveForm = false;
            this.favoritesList = this.responseData.favorites;
        }
      });

    });
  }
}
