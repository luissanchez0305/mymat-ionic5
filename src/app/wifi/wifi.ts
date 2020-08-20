import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, Platform  } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { APIServiceProvider } from '../services/api-service/api-service';
import { PlayingPage } from '../playing/playing';
import { Constants } from '../services/constants';
import { NetworkInterface } from '@ionic-native/network-interface/ngx';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

/**
 * Generated class for the WifiPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'app-wifi',
  templateUrl: 'wifi.html',
  styleUrls: ['./wifi.scss'],
})
export class WifiPage implements OnInit {
  public testBeginRoutineInterval : any;
  public testIPInterval : any;
  public testStatusInterval : any;
  public intervalCount : number = 0;
  public mymatStatus : boolean;
  public mymatWifi : boolean;
  public mymatNoStatus : boolean;
  public batteryCharge : string;
  public batteryImg : string;
  public coilText : string;
  public coilText1 : string;
  public coilText2 : string;
  public coilText3 : string;
  public coilText4 : string;
  public showStatusTable : boolean;
  public showLoading : boolean;
  public isRunRoutineEnabled : boolean;
  private program1: any;
  private program2: any;
  private program3: any;
  private program4: any;
  

  public iframeUrl: any;
  public showIframeStatus : boolean;

    
  data:any;





  ngOnInit() {

    
  }

  constructor(public navCtrl: NavController,
     public navParams: NavParams, 
     private router: Router,
     private route: ActivatedRoute,
     private storage: Storage, 
     public apiService : APIServiceProvider,
    private translateService: TranslateService, 
    public networkInterface : NetworkInterface, 
    public platform: Platform) {

        



      this.storage.get(Constants.storageKeyLang).then((lang)=>{
        this.translateService.getTranslation(lang).subscribe((value) =>{
          this.coilText = typeof value['coil'] === 'undefined' ? 'Antena' : value['coil'];
        });
      });

      this.data = this.route.snapshot.data['data'];
      console.log(this.data);

      /*
      this.program1 = this.navParams.get('prog1');
      this.program2 = this.navParams.get('prog2');
      this.program3 = this.navParams.get('prog3');
      this.program4 = this.navParams.get('prog4');

      */
  }

 


  ionViewDidLeave(){
    this.stop();
  }

  ionViewDidEnter() {
    this.mymatStatus = false;
    this.showIframeStatus = false;
    this.showLoading = true;
    this.isRunRoutineEnabled = true;
    if(this.platform.is('cordova')){
      this.networkInterface.getWiFiIPAddress().then((response)=>{
        if(this.verifyInternalIpAddress(response)){
          this.verifyStatusValues();
        }
        else
          this.failIPVerification();
      },(response)=>{
        this.failIPVerification();
      });
    }
    else{
      this.verifyStatusValues();
    }
    this.mymatWifi = true;
    this.intervalCount = 0;
  }

  verifyInternalIpAddress(ip){
    for(let i = 1; i < 256; i++){
      console.log(Constants.localIPAddress + i);
      console.log(ip);
      if(Constants.localIPAddress + i == ip){
        return true;
      }
    }
    return false;
  }

  verifyStatusValues(restart = true){
    //this.mymatStatus = true;
    //this.showStatusTable = true;
    if(restart){
      this.batteryImg = 'assets/img/b100.pn';
      this.coilText1 = 'N/A';
      this.coilText2 = 'N/A';
      this.coilText3 = 'N/A';
      this.coilText4 = 'N/A';
    }

    //this.mymatWifi = false;
    //this.showLoading = false;
    clearInterval(this.testIPInterval);

    // check if mymat is connected
    var myMatTest = this.apiService.test();
    myMatTest.then((response) => {
      // if is connected quitar imagen, textos y loading y poner status del mat
      if(this.verifyValues(response)){
        this.showStatus();
      }
      else{
        this.failIPVerification();
      }
    }, (response) => {
      this.failIPVerification();
    });
  }

  showNoStatus(){
      this.mymatNoStatus = true;
  }

  showStatus(){
      this.mymatWifi = false;
      this.mymatStatus = true;
      this.showStatusTable = true;
      this.showLoading = false;
      this.isRunRoutineEnabled = true;
      clearInterval(this.testStatusInterval);
      clearInterval(this.testIPInterval);

      this.testIPInterval = setInterval(() => {
        this.networkInterface.getWiFiIPAddress().then((response)=>{
            if(this.verifyInternalIpAddress(response)){
              this.verifyStatusValues(false);
            }
            else{
              this.mymatWifi = true;
              this.mymatStatus = false;
              this.showStatusTable = false;
              this.showLoading = true;
              this.isRunRoutineEnabled = false;
              this.failIPVerification();
            }
          },(response)=>{
            this.mymatWifi = true;
            this.mymatStatus = false;
            this.showStatusTable = false;
            this.showLoading = true;
            this.isRunRoutineEnabled = false;
            this.failIPVerification();
          });
      }, 3000);
  }

  verifyValues(response){
    if(response.indexOf("<p><h4>Power: ") > -1){
      var power = response.split("<p><h4>Power: ");
      power = power[1].split("</h4></p>");
      var coil1 = response.split("<tr><td>1.</td><td>");
      coil1 = coil1[2].split("</td></tr>");
      var coil2 = response.split("<tr><td>2.</td><td>");
      coil2 = coil2[2].split("</td></tr>");
      var coil3 = response.split("<tr><td>3.</td><td>");
      coil3 = coil3[2].split("</td></tr>");
      var coil4 = response.split("<tr><td>4.</td><td>");
      coil4 = coil4[2].split("</td></tr>");
      this.batteryCharge = power[0];
      var powerVal = power[0].substr(0,power[0].length-1);
      if(powerVal > 75)
          this.batteryImg = 'assets/img/b100.png';
      else if(powerVal > 50)
          this.batteryImg = 'assets/img/b75.png';
      else if(powerVal > 25)
          this.batteryImg = 'assets/img/b50.png';
      else if(powerVal > 10)
          this.batteryImg = 'assets/img/b25.png';
      else
          this.batteryImg = 'assets/img/b10.png';

      this.coilText1 = coil1[0];
      this.coilText2 = coil2[0];
      this.coilText3 = coil3[0];
      this.coilText4 = coil4[0];
      return true;
    }
    else{
        return false;
    }
  }

  failIPVerification(){
      this.testIPInterval = setInterval(() => {
        this.networkInterface.getWiFiIPAddress().then((response)=>{
            if(this.verifyInternalIpAddress(response)){
              this.verifyStatusValues(false);
            }
          });
      }, 3000);
  }

  /*failStatusVerification(){
    this.testStatusInterval = setInterval(() => {
      // timeout of mymat detection 180 segundos
      var failMyMatTest = this.apiService.test();
      failMyMatTest.then((response) => {
        if(this.verifyValues(response)){
          this.showStatus();
        }
      }, (response) => {
        if(this.intervalCount >= 5){
          this.showNoStatus();
        }
      });

      this.intervalCount += 1;
    }, 3000);

    /*var programs = '';

    for(var i = 1; i <= 4; i++){
      switch(i){
        case 1:
          this.storage.get(Constants.storageKeyBubble1).then((val) => {
            programs += "?P1=" + val.split("|")[3] + '&';
          });
          break;
        case 2:
          this.storage.get(Constants.storageKeyBubble2).then((val) => {
     858]
        programs += "P2=" + val.split("|")[3] + '&';
          });
          break;
        case 3:
          this.storage.get(Constants.storageKeyBubble3).then((val) => {
            programs += "P3=" + val.split("|")[3] + '&';
          });
          break;
        case 4:
          this.storage.get(Constants.storageKeyBubble4).then((val) => {
            programs += "P4=" + val.split("|")[3];

            this.showIframeStatus = true;
            this.mymatWifi = false;
            this.mymatStatus = true;
            this.showStatusTable = false;
            this.iframeUrl = this.sanitize.bypassSecurityTrustResourceUrl(Constants.myMatApiIndexUrl + programs);
          });
          break;
      }
    }* /
  }*/

  startRoutine(){
    /* ANTES DE COCRRER RUTINA VERIFICAR SI SE ESTA CONECTADO AL WIFI DEL MYMAT */
    this.showLoading = true;
    this.isRunRoutineEnabled = false;
    this.apiService.test().then((response)=>{
        this.showLoading = false;
        this.isRunRoutineEnabled = true;
        if(this.verifyValues(response)){
          /* CORRER RUTINA */
          clearInterval(this.testStatusInterval);
          clearInterval(this.testIPInterval);
          var program1Obj = '|' + this.program1.name + '|' + this.program1.runningtime + '|' + this.program1.apiName;
          var program2Obj = '|' + this.program2.name + '|' + this.program2.runningtime + '|' + this.program2.apiName;
          var program3Obj = '|' + this.program3.name + '|' + this.program3.runningtime + '|' + this.program3.apiName;
          var program4Obj = '|' + this.program4.name + '|' + this.program4.runningtime + '|' + this.program4.apiName;

          var programs = [
              program1Obj,
              program2Obj,
              program3Obj,
              program4Obj
          ];

          this.apiService.start(programs).then((response) => {
            console.log(response + '');
          }).catch((response) =>{
            /*setTimeout(() => {
              var emailData = { error : response.data };
              this.apiService.sendError(emailData).then((result) => {
                console.log(response.data);
              });
            }, 120000);*/
          });

          // Poner rutina en las ultimas corridas
          this.storage.get(Constants.latestRoutinesKey).then((routines)=>{
            let latestArray = [];

            var t = new Date();

            var day = t.getDate();
            var monthIndex = t.getMonth();
            var year = t.getFullYear();
            var hours = t.getHours();
            var minutes = t.getMinutes();

            let programsArray = [];
            for(let i = 0; i < programs.length; i++){
              programsArray.push({ "apiName" : programs[i].split('|')[3], "name" : programs[i].split('|')[1] });
            }

            latestArray.push({ "day" : day, "month" : Constants.monthNames[monthIndex], "year" : year, "hours" : this.fixZeroOnNumber(hours), "minutes" : this.fixZeroOnNumber(minutes), "programs" : programsArray });
            if(routines != null && routines[0] != null){
              latestArray.push(routines[0]);
            }
            if(routines != null && routines[1] != null){
              latestArray.push(routines[1]);
            }
            this.storage.set(Constants.latestRoutinesKey, latestArray);
          });

          /* CORRER RUTINA */
          this.router.navigate(['playing']);
        //  this.navCtrl.navigateRoot('playing');
        }
        else{
          this.showLoading = false;
          this.isRunRoutineEnabled = true;
          this.mymatWifi = true;
          this.mymatStatus = false;
          this.showStatusTable = false;
          this.showLoading = true;
          this.failIPVerification();
        }
      },(response)=>{
        this.showLoading = false;
        this.isRunRoutineEnabled = true;
        this.mymatWifi = true;
        this.mymatStatus = false;
        this.showStatusTable = false;
        this.showLoading = true;
        this.failIPVerification();
      });
  }

  private fixZeroOnNumber(val){
    if(val < 10){
      return '0' + val;
    }

    return val;
  }
  
  

  stop(){
    clearInterval(this.testStatusInterval);
    clearInterval(this.testIPInterval);
  }
}