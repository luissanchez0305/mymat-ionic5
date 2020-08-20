import { Component, NgZone, OnInit } from '@angular/core';
import { NavController, NavParams, ModalController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Device } from '@ionic-native/device/ngx';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { APIServiceProvider } from '../services/api-service/api-service';
import { Constants } from '../services/constants';
import { SliderPage } from '../slider/slider';
import { Network } from '@ionic-native/network/ngx';
import { FavoritesPage } from '../favorites/favorites';

/**
 * Generated class for the SubscribePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'app-subscribe',
  templateUrl: 'subscribe.html',
  styleUrls: ['./subscribe.scss'],
})
export class SubscribePage implements OnInit {
  public maxDateOfPicker : string;
  public subscribeForm : FormGroup;
  public showSubmitButton : boolean;
  private maxDate : string;
  public response_text : string;
  private responseData : any;
  private callBackPage : string;
  public isDeviceOnline : boolean;
  public errorNameClass : string;
  public errorEmailClass : string;
  public errorGenderClass : string;
  public errorDateClass : string;
  public name_value : string;
  public email_value : string;

  ngOnInit() {
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, private zone: NgZone,
    private formBuilder: FormBuilder, private storage: Storage, public apiService : APIServiceProvider,
    private translateService: TranslateService, private device: Device, private modalCtrl: ModalController,
    private network: Network) {
      // obtiene el parametro de que page va a correr al terminar el registro
      this.callBackPage = navParams.get('');
      this.showSubmitButton = true;
      let aDate = new Date();
      this.maxDateOfPicker = this.maxDate = aDate.toISOString();

      this.subscribeForm = this.formBuilder.group({
        email: ['', Validators.required],
        name: ['', Validators.required],
        gender: ['', Validators.required],
        birthDate: ['', Validators.required]
      });
      this.isDeviceOnline = true;
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
        });
      });
  }

  ionViewDidEnter() {
    console.log('ionViewDidLoad SubscribePage');
  }

  attemptSubscribe(){
    this.response_text = '';
    var formData = new FormData();

    formData.append('email', this.subscribeForm.value.email);
    formData.append('name', this.subscribeForm.value.name);
    formData.append('birthDate', this.subscribeForm.value.birthDate);
    formData.append('gender', this.subscribeForm.value.gender);
    formData.append('isUpdate', 'false');
    if(window.hasOwnProperty('cordova')){
      formData.append('uuid', this.device.uuid);
    }
    else {
      formData.append('uuid', Constants.test_uuid);
    }

    this.apiService.runPost('subscribe.php',formData).then((result) => {
      this.responseData = result;
      if(this.responseData.status == 'ok') {
        this.storage.set(Constants.deviceInfoKey, {'uuid': this.responseData.uuid, 'email': this.subscribeForm.value.email });
        this.showSubmitButton = false;
        this.storage.get(Constants.storageKeyLang).then((lang)=>{
          this.translateService.getTranslation(lang).subscribe((value) => {
            this.response_text = value['profile-success-message'];

            setTimeout(async () => {
              if(this.callBackPage == 'none'){
                // despliega la vista de de instrucciones
                this.navCtrl.navigateForward('slider');
              }
              else if(this.callBackPage == 'favorites'){
                this.navCtrl.pop();
                let profileModal = await this.modalCtrl.create({ component: FavoritesPage });
                profileModal.present();
              }
            }, 5000);

          });
        });
      }
      else {
        this.storage.get(Constants.storageKeyLang).then((lang)=>{
          this.translateService.getTranslation(lang).subscribe((value) => {
            var error = value['profile-error-message'] + ': ';
            if(this.responseData.emailError != 'ok'){
              error += this.responseData.emailError;
              this.errorEmailClass  = 'error';
            }
            if(this.responseData.nameError != 'ok'){
              error += this.responseData.nameError;
              this.errorNameClass  = 'error';
            }
            if(this.responseData.genderError != 'ok'){
              error += this.responseData.genderError;
              this.errorGenderClass  = 'error';
            }
            if(this.responseData.dateOfBirthError != 'ok'){
              error += this.responseData.dateOfBirthError;
              this.errorDateClass  = 'error';
            }

            this.response_text = error;
          });
        });
      }
      // TODO: poner success y desplegar pagina principal
    }, (result) => {
      this.storage.get(Constants.storageKeyLang).then((lang)=>{
        this.translateService.getTranslation(lang).subscribe((value) => {
          this.response_text = value['profile-error-message'];
        });
      });
    });
  }
}
