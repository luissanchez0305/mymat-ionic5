import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { Constants } from '../services/constants';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { Events } from '../services/events';
import { APIServiceProvider } from '../services/api-service/api-service';

/**
 * Generated class for the ProgramPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'app-program',
  templateUrl: 'program.html',
  styleUrls: ['./program.scss'],
})
export class ProgramPage implements OnInit{
  public programName : string;
  public programRunningTime : string;
  public programDescription : string;
  public programApiName : string;
  public programNumber : number;
  public programRealName : string;
  public programParams : any;

  ngOnInit() {
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage,
    public translateService: TranslateService, public apiService : APIServiceProvider, public events: Events) {
  }
  ionViewDidEnter(){
      this.storage.get(Constants.storageKeyLang).then((lang)=>{
        this.translateService.getTranslation(lang).subscribe((prog) =>{
          this.programParams = this.apiService.getCallBackProgram();
          this.programRealName = this.programParams.name;
          var programTranslateName = this.programParams.name;
          if(this.isNameOnArray(Constants.shortTitles, programTranslateName))
            programTranslateName = programTranslateName.replace('-upper', '-short');
          this.programName = typeof prog[programTranslateName] === 'undefined' ? programTranslateName : prog[programTranslateName];
          this.programRunningTime = typeof prog[this.programParams.runTime] === 'undefined' ? this.programParams.runTime : prog[this.programParams.runTime];
          this.programDescription = typeof prog[this.programParams.description] === 'undefined' ? this.programParams.description : prog[this.programParams.description];
          this.programApiName = this.programParams.apiName;
          this.programNumber = this.programParams.programNumber
        });
      });
  }

  add1Program(programName, programRunningTime, programApiName){
    this.events.publish("add1ProgramEvent", { programNumber: this.programNumber, programRealName: this.programRealName, 
      programRunningTime: this.programRunningTime, programApiName: this.programApiName });
  }

  isNameOnArray(names, name){
    for(var i = 0; i < names.length; i++){
      if(names[i] == name){
        return true;
      }
    }
    return false;
  }
}
