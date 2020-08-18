import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Constants } from '../services/constants';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { Events } from '../services/events';
import { APIServiceProvider } from '../services/api-service/api-service';
import { ActivatedRoute, Router } from '@angular/router';

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
  public programObj : any;

  ngOnInit() {
  }

  constructor(public navCtrl: NavController, public storage: Storage,
    public translateService: TranslateService, public apiService : APIServiceProvider, public events: Events,
    private route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe(params => {
      if (params && params.program) {
        this.programObj = JSON.parse(params.program);
      }
    });

  }  
  ionViewDidEnter(){
      this.storage.get(Constants.storageKeyLang).then((lang)=>{
        this.translateService.getTranslation(lang).subscribe((prog) =>{
          this.programRealName = this.programObj.name;
          var programTranslateName = this.programObj.name;
          if(this.isNameOnArray(Constants.shortTitles, programTranslateName))
            programTranslateName = programTranslateName.replace('-upper', '-short');
          this.programName = typeof prog[programTranslateName] === 'undefined' ? programTranslateName : prog[programTranslateName];
          this.programRunningTime = typeof prog[this.programObj.runTime] === 'undefined' ? this.programObj.runTime : prog[this.programObj.runTime];
          this.programDescription = typeof prog[this.programObj.description] === 'undefined' ? this.programObj.description : prog[this.programObj.description];
          this.programApiName = this.programObj.apiName;
          this.programNumber = this.programObj.programNumber
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
