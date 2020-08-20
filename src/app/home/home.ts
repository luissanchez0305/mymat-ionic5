import { Component, NgZone, ViewChild } from '@angular/core';
import { NavController, ModalController, IonContent } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { Network } from '@ionic-native/network/ngx';
import { Device } from '@ionic-native/device/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { Events } from '../services/events';

import { RoutinesProvider } from '../services/routines/routines';
import { APIServiceProvider } from '../services/api-service/api-service';
import { ProgramsPage } from '../programs/programs';
import { WifiPage } from '../wifi/wifi';
import { FavoritesPage } from '../favorites/favorites';
import { Constants } from '../services/constants';
import { SubscribePage } from '../subscribe/subscribe';
import { DataService } from '../data.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.html',
  styleUrls: ['home.scss'],
})

export class HomePage {
  @ViewChild(IonContent, { static: true}) content: IonContent;
  public bubblesNames1 : string;
  public bubblesNames2 : string;
  public bubblesNames3 : string;
  public bubblesNames4 : string;
  public EnableRunRoutine : boolean;
  public bubblesCurrentState1 : boolean;
  public bubblesCurrentState2 : boolean;
  public bubblesCurrentState3 : boolean;
  public bubblesCurrentState4 : boolean;
  public isDeviceOnline : boolean;
  public offline_device : string;
  public showAddFavoriteButton : boolean = false;
  public showLatestSection: boolean;
  public latestRoutines : any;

  constructor(
    public navCtrl: NavController, 
    private storage: Storage, 
    public routines: RoutinesProvider,
    private translateService: TranslateService, 
    private network: Network, 
    private zone: NgZone,
    private device: Device, 
    public apiService : APIServiceProvider, 
    public modalCtrl: ModalController, 
    public events: Events, 
  
    //PARA DATA DE CORRER RUTINA
    public dataSrv:DataService,

    private localNotifications : LocalNotifications, 
    private router: Router) {
    //this.checkAllBubbles();
    this.events.subscribe('sharesBubbles', (data: any) => {
      console.log(data.bubbleNames);
      for(var i = 1; i <= data.bubbleNames.length; i++){
        this.updateBubbles(i, data.bubbleNames[i - 1]);
      }
      this.AllBubblesChecked(this.routines.getPrograms());
    });

    this.events.subscribe('addProgramsEvent', (data: any) => {
    //  this.navCtrl.pop();
     
      console.log(data.program1);
      let bubbles = this.routines.addPrograms('', data.program1, data.program2, data.program3, data.program4);
      this.events.publish("sharesBubbles", {bubbles: bubbles});
    });

    this.events.subscribe('switchLangEvent',(data: any) => {
        //call methods to refresh content
        this.storage.set(Constants.storageKeyLang, data.lang)
        this.checkAllBubbles();
    });
    this.AllBubblesChecked(this.routines.getPrograms());
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

    //this.navCtrl.push(SubscribePage, { callBackPage : 'none' });
    this.storage.get(Constants.deviceInfoKey).then((info)=>{
      if(typeof info === 'undefined' || info == null){
        /*if(window.hasOwnProperty('cordova')){*/
          var formData = new FormData();
          var _uuid = Constants.test_uuid;
          if(window.hasOwnProperty('cordova')){
            _uuid = this.device.uuid;
          }
          formData.append('uuid', _uuid);

          this.apiService.runPost('check_device.php',formData).then((result) => {
            //console.log('check_device success');
            this.isDeviceOnline = true;
            var obj : any = result;
            if (obj.found == "0") {
              // despliega la vista de insercion de datos
              this.router.navigate(['subscribe']);
            //  this.navCtrl.navigateForward('subscribe');
            }
            else{
              this.storage.set(Constants.deviceInfoKey, { "email" : obj.email, "uuid" : _uuid });
            }
          }, (result) => {
            //console.log('check_device error ' + result);
            //this.isDeviceOnline = false;
            /*this.storage.get(Constants.storageKeyLang).then((lang)=>{
              this.translateService.getTranslation(lang).subscribe((value) => {
                this.offline_device = value['offline-device-text-2'];
              });
            });*/
          });
        /*}*/
      }
    });
  }

  addPrograms(routineName, program0, program1, program2, program3){
    this.events.publish('addProgramsEvent', { program1: program0, program2: program1, program3: program2, program4: program3 });
    this.content.scrollToPoint(0, 0, 100);
  }

  ionViewDidEnter() {
    this.storage.get(Constants.latestRoutinesKey).then((latests)=>{
      if(latests){
        this.showLatestSection = true;
        this.latestRoutines = latests;
      }
      else{
        this.showLatestSection = false;
      }
    });
     
    var t = new Date();
    this.localNotifications.schedule({
      id: 1,
      title: 'MyMat Light',
      text: 'TESTING MODE',
      sound: 'file://assets/sounds/gong_c5.mp3',
      trigger: { at: new Date(t.getTime() + 5000) }
    });
  }

  openAddFavorite(){
    this.storage.get(Constants.deviceInfoKey).then(async (info)=>{
      if(typeof info === 'undefined' || info == null){
        // despliega la vista de insercion de datos
        await this.router.navigate(['subscribe/favorites']);
        
        //this.navCtrl.navigateForward('subscribe/favorites');
        
      } else {
        await this.apiService.setFavoriteShowSave(true);
        let profileModal = await this.modalCtrl.create({ component: FavoritesPage });
        await profileModal.present();
      }
    });
  }

  removeProgramFromRoutine(prg){
    console.log('hold: ' + prg);
  }

  selectBubble(prg, add){
    this.router.navigate(['programs/', {bubble: prg}]);
  }

  runRoutine(){
    var programs = this.routines.getPrograms();

   

   // console.log(programs);

    if(this.AllBubblesChecked(programs)){
 

      this.dataSrv.data = this.routines.getPrograms();


      this.router.navigate(['wifi/',{ DataService }]);
/*

      this.router.navigate(['wifi/' + 
        this.routines.getProgram(programs[0]) + '/' + 
        this.routines.getProgram(programs[1]) + '/' + 
        this.routines.getProgram(programs[2]) + '/' +
        this.routines.getProgram(programs[3])    
        
        ]);

*/



  /*    this.navCtrl.navigateRoot(
        'wifi/' + 
          this.routines.getProgram(programs[0]) + '/' + 
          this.routines.getProgram(programs[1]) + '/' + 
          this.routines.getProgram(programs[2]) + '/' +
          this.routines.getProgram(programs[3])
       );*/
    }
  }

  private AllBubblesChecked(programs){
    console.log("Estamos en el metodo AllBubblesChecked");
    console.log(programs);

    if(typeof programs[0] !== 'undefined' && programs[0] != null && programs[0].length > 0 &&
    typeof programs[1] !== 'undefined' && programs[1] != null && programs[1].length > 0 &&
    typeof programs[2] !== 'undefined' && programs[2] != null && programs[2].length > 0 &&
    typeof programs[3] !== 'undefined' && programs[3] != null && programs[3].length > 0){
        this.EnableRunRoutine = true;
        this.showAddFavoriteButton = true;
      }
      else{
        this.EnableRunRoutine = false;
        this.showAddFavoriteButton = false;
      }
      return this.EnableRunRoutine;
  }

  cleanRoutine(){
    this.routines.cleanPrograms();
    this.AllBubblesChecked(this.routines.getPrograms());
    this.storage.set(Constants.storageKeyBubble1,'');
    this.storage.set(Constants.storageKeyBubble2,'');
    this.storage.set(Constants.storageKeyBubble3,'');
    this.storage.set(Constants.storageKeyBubble4,'');
    this.updateBubbles(1,'');
    this.updateBubbles(2,'');
    this.updateBubbles(3,'');
    this.updateBubbles(4,'');
    this.showAddFavoriteButton = false;
  }

  private updateBubbles(bubble,name){
    switch(bubble){
      case 1:
        if(typeof name !== 'undefined' && name.length > 0){
          this.bubblesCurrentState1 = true;
          this.storage.get(Constants.storageKeyLang).then((lang)=>{
            this.translateService.getTranslation(lang).subscribe((value) =>{
              this.bubblesNames1 = typeof value[name] === 'undefined' ? name : value[name];
            });
          });
        }
        else{
          this.bubblesCurrentState1 = false;
          this.bubblesNames1 = '';
        }
        break;
      case 2:
        if(typeof name !== 'undefined' && name.length > 0){
          this.bubblesCurrentState2 = true;
          this.storage.get(Constants.storageKeyLang).then((lang)=>{
            this.translateService.getTranslation(lang).subscribe((value) =>{
              this.bubblesNames2 = typeof value[name] === 'undefined' ? name : value[name];
            });
          });
        }
        else{
          this.bubblesCurrentState2 = false;
          this.bubblesNames2 = '';
        }
        break;
      case 3:
        if(typeof name !== 'undefined' && name.length > 0){
          this.bubblesCurrentState3 = true;
          this.storage.get(Constants.storageKeyLang).then((lang)=>{
            this.translateService.getTranslation(lang).subscribe((value) =>{
              this.bubblesNames3 = typeof value[name] === 'undefined' ? name : value[name];
            });
          });
        }
        else{
          this.bubblesCurrentState3 = false;
          this.bubblesNames3 = '';
        }
        break;
      case 4:
        if(typeof name !== 'undefined' && name.length > 0){
          this.bubblesCurrentState4 = true;
          this.storage.get(Constants.storageKeyLang).then((lang)=>{
            this.translateService.getTranslation(lang).subscribe((value) =>{
              this.bubblesNames4 = typeof value[name] === 'undefined' ? name : value[name];
            });
          });
        }
        else{
          this.bubblesCurrentState4 = false;
          this.bubblesNames4 = '';
        }
        break;
    }
  }

  private checkAllBubbles(){
    this.storage.get(Constants.storageKeyBubble1).then((val)=>{
      if(val !== null){
        var name = val.split('|')[1];
        this.updateBubbles(1,name);
        this.routines.setProgram(1,name)
      }
    }).catch((err) => {
      var emailData = { area : 'checkAllBubbles 1', message : err };
      this.apiService.sendError(emailData).then((result) => {
        console.log(err);
      });
    });

    this.storage.get(Constants.storageKeyBubble2).then((val)=>{
      if(val !== null){
        var name = val.split('|')[1];
        this.updateBubbles(2,name);
        this.routines.setProgram(2,name)
      }
    }).catch((err) => {
      var emailData = { area : 'checkAllBubbles 2', message : err };
      this.apiService.sendError(emailData).then((result) => {
        console.log(err);
      });
    });

    this.storage.get(Constants.storageKeyBubble3).then((val)=>{
      if(val !== null){
        var name = val.split('|')[1];
        this.updateBubbles(3,name);
        this.routines.setProgram(3,name)
      }
    }).catch((err) => {
      var emailData = { area : 'checkAllBubbles 3', message : err };
      this.apiService.sendError(emailData).then((result) => {
        console.log(err);
      });
    });

    this.storage.get(Constants.storageKeyBubble4).then((val)=>{
      if(val !== null){
        var name = val.split('|')[1];
        this.updateBubbles(4,name);
        this.routines.setProgram(4,name)
      }
      this.AllBubblesChecked(this.routines.getPrograms())
    }).catch((err) => {
      var emailData = { area : 'checkAllBubbles 4', message : err };
      this.apiService.sendError(emailData).then((result) => {
        console.log(err);
      });
    });
  }
}
