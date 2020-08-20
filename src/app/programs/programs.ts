import { Component, ViewChild, OnInit } from '@angular/core';
import { NavParams, IonContent } from '@ionic/angular';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { Data } from '../services/offline_data';
import { RoutinesProvider } from '../services/routines/routines';
import { Constants } from '../services/constants';
import { ProgramPage } from '../program/program';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { SpinnerDialog } from '@ionic-native/spinner-dialog/ngx';
import { Events } from '../services/events';
import { APIServiceProvider } from '../services/api-service/api-service';

/**
 * Generated class for the ProgramsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'app-programs',
  templateUrl: 'programs.html',
  styleUrls: ['./programs.scss'],
  providers: [NavParams]
  
})
export class ProgramsPage implements OnInit {
  @ViewChild(IonContent, { static: true}) content: IonContent;
  public predefinedPrograms : any;
  public programs : any;
  public program : number;
  public programName1 : string;
  public programName2 : string;
  public programName3 : string;
  public programName4 : string;
  public basicButton : boolean;
  public businessTravelButton : boolean;
  public familiyButton : boolean;
  public athleteButton : boolean;
  public spaButton : boolean;
  public stressButton : boolean;
  public seniorButton : boolean;
  public chakraButton : boolean;
  public elementsButton : boolean;
  public petssButton : boolean;
  public petsxButton : boolean;
  public isDeviceOnline : boolean;
  
  ngOnInit() {
  }

  constructor(private storage: Storage, public navParams: NavParams, private translateService: TranslateService, public routines: RoutinesProvider, 
    public events:Events, public apiService : APIServiceProvider, private activatedRoute: ActivatedRoute, private spinnerDialog: SpinnerDialog, 
    public router: Router) {
      this.isDeviceOnline = true;
      this.program = Number(this.activatedRoute.snapshot.paramMap.get('bubble'));

      this.events.subscribe('add1ProgramEvent', (data: any) => {
        this.program = data.programNumber;
        this.add1Program(data.programName, data.programRunningTime, data.programApiName);
        this.router.navigateByUrl('/');
      });
  }
  ionViewDidLeave(){
    //this.storage.set(Constants.storageKeyScrollTop, this.content. .getContentDimensions().scrollTop);
  }

  compare( a, b ) {
  if ( a.realName < b.realName ){
    return -1;
  }
  if ( a.realName > b.realName ){
    return 1;
  }
  return 0;
}

  ionViewDidEnter(){
      this.spinnerDialog.show();
      let self = this;
      this.storage.get(Constants.storageKeyCurrentProgram).then((program)=>{
        this.getPrograms(program != null ? program : 'basic');
      })
      let programs_raw = [];
        this.storage.get(Constants.storageKeyLang).then((lang)=>{
          this.translateService.getTranslation(lang).subscribe((value) =>{
            for (var i = 0; i < Data.Programs.length; i++) {
              let program = Data.Programs[i];   
              let realName = value[program.name];

              program.realName = realName ? realName : program.name;
              programs_raw[i] = program;
            }

            let programs_sort = programs_raw.sort(self.compare);
            let general = [];
            let general_index = 0;
            let pets = [];
            let pets_index = 0;
            let meridians = [];
            let meridians_index = 0;
            let chakras = [];
            let chakras_index = 0;
            let elements = [];
            let elements_index = 0;
            for (var j = 0; j < programs_sort.length; j++) {
              let program = programs_sort[j];        
              switch (program.sortCategory) {
                case "none":
                  general[general_index] = program;
                  general_index += 1;
                  break;
                case "element":
                  elements[elements_index] = program;
                  elements_index += 1;
                  break;
                case "meridian":
                  meridians[meridians_index] = program;
                  meridians_index += 1;
                  break;
                case "chakra":
                  chakras[chakras_index] = program;
                  chakras_index += 1;
                  break;
                case "pets":
                  pets[pets_index] = program;
                  pets_index += 1;
                  break;
              }
            }

            general = general.sort(self.compare);
            for (var k = 0; k < general.length; k++) {
              let program = general[k];        
              programs_sort[k] = program;
            }

            for (var l = general.length; l < general.length + elements.length; l++) {
              let program = elements[l - general.length];   
              programs_sort[l] = program;
            }

            for (var m = general.length + elements.length; m < general.length + elements.length + meridians.length; m++) {
              let program = meridians[m - (general.length + elements.length)];   
              programs_sort[m] = program;
            }

            for (var n = general.length + elements.length + meridians.length; n < general.length + elements.length + meridians.length + chakras.length; n++) {
              let program = chakras[n - (general.length + elements.length + meridians.length)];   
              programs_sort[n] = program;
            }

            for (var o = general.length + elements.length + meridians.length + chakras.length; o < general.length + elements.length + meridians.length + chakras.length + pets.length; o++) {
              let program = pets[o - (general.length + elements.length + meridians.length + chakras.length)];   
              programs_sort[o] = program;
            }

            this.programs = programs_sort;
            this.spinnerDialog.hide();
          });
        });


      this.routines.getKey(Constants.storageKeyBubble1).then(val => {
        if(this.program != 1 && val != null && val.length > 0){
          this.programName1 = val.split('|')[1];
        }
        else{
          this.programName1 = '';
        }
      });
      this.routines.getKey(Constants.storageKeyBubble2).then(val => {
        if(this.program != 2 && val != null && val.length > 0){
          this.programName2 = val.split('|')[1];
        }
        else{
          this.programName2 = '';
        }
      });
      this.routines.getKey(Constants.storageKeyBubble3).then(val => {
        if(this.program != 3 && val != null && val.length > 0){
          this.programName3 = val.split('|')[1];
        }
        else{
          this.programName3 = '';
        }
      });
      this.routines.getKey(Constants.storageKeyBubble4).then(val => {
        if(this.program != 4 && val != null && val.length > 0){
          this.programName4 = val.split('|')[1];
        }
        else{
          this.programName4 = '';
        }
      });
      /*setTimeout(() => {
        this.storage.get(Constants.storageKeyScrollTop).then((scroll)=>{
          this.content.scrollToPoint(0, scroll, 100);
        });
      }, 500);*/
  }

  selectPreSetProgram(category){
      this.getPrograms(category);
  }

  getPrograms(category){
    this.storage.set(Constants.storageKeyCurrentProgram, category);
    this.basicButton = false;
    this.businessTravelButton = false;
    this.familiyButton = false;
    this.athleteButton = false;
    this.spaButton = false;
    this.stressButton = false;
    this.seniorButton = false;
    this.chakraButton = false;
    this.elementsButton = false;
    this.petssButton = false;
    this.petsxButton = false;
    switch(category){
      case 'basic':
        this.basicButton = true;
        break;
      case 'business and travel':
        this.businessTravelButton = true;
        break;
      case 'family':
        this.familiyButton = true;
        break;
      case 'athlete':
        this.athleteButton = true;
        break;
      case 'spa':
        this.spaButton = true;
        break;
      case 'stress relief':
        this.stressButton = true;
        break;
      case 'senior':
        this.seniorButton = true;
        break;
      case 'chakra balancing':
        this.chakraButton = true;
        break;
      case 'elements':
        this.elementsButton = true;
        break;
      case 'petss':
        this.petssButton = true;
        break;
      case 'petsx':
        this.petsxButton = true;
        break;
    }
    var groups = [];
    var groupIndex = 0;
    for(var i = 0; i < Data.Groups.length; i++){
      var group = Data.Groups[i];
      if(group.category == category){
        groups[groupIndex] = group;
        for(var j = 0; j < group.programs.length; j++){
          var program = group.programs[j];
          group.programs[j] = this.routines.getProgram(program.apiName);
        }
        groupIndex++;
      }
    }
    this.predefinedPrograms = groups;
  }

  addPrograms(routineName, program1, program2, program3, program4){
    
    var bubbleNames = this.routines.addPrograms(routineName, program1, program2, program3, program4);
    this.events.publish("sharesBubbles", { bubbleNames : bubbleNames });
    this.router.navigateByUrl('/');
  }

  add1Program(programName, programRunningTime, programApiName){
    this.routines.addProgramToRoutine(this.program, '', programName, programRunningTime, programApiName);

    this.programName1 = this.program == 1 ? programName : (this.programName1.length > 0 ? this.programName1 : '');
    this.programName2 = this.program == 2 ? programName : (this.programName2.length > 0 ? this.programName2 : '');
    this.programName3 = this.program == 3 ? programName : (this.programName3.length > 0 ? this.programName3 : '');
    this.programName4 = this.program == 4 ? programName : (this.programName4.length > 0 ? this.programName4 : '');

    this.routines.setPrograms(this.programName1, this.programName2, this.programName3, this.programName4);

    var bubbleNames = [
      this.programName1,
      this.programName2,
      this.programName3,
      this.programName4
    ];
    this.events.publish("sharesBubbles", { bubbleNames: bubbleNames });
    this.router.navigateByUrl('/');
  }

  moreProgramInfo(name, runTime, description, apiName){
    let _program = { programNumber: this.program, name: name, runTime: runTime, description: description, apiName: apiName };
    let navigationExtras: NavigationExtras = {
      queryParams: {
        program: JSON.stringify(_program)
      }
    };
    this.router.navigate(['/program'], navigationExtras);
  }
}
