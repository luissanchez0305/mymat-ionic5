import { Component, ViewChild, OnInit } from '@angular/core';
import { NavController, NavParams, IonSlides, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { Constants } from '../services/constants';
import { Router } from '@angular/router';

/**
 * Generated class for the SliderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'app-slider',
  templateUrl: 'slider.html',
  styleUrls: ['./slider.scss'],
  providers: [NavParams]
})
export class SliderPage implements OnInit {
  public showHeader : boolean;
  @ViewChild(IonSlides, { static: true}) slides: IonSlides;
  public images : Array<string>;
  public culture: string; 
  
  ngOnInit() {
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public plt: Platform, public storage: Storage, public translateService: TranslateService, public router: Router) {
    this.showHeader = false;
  }

  ionViewDidEnter() {
    this.storage.get(Constants.storageKeyLang).then((lang)=>{
      this.translateService.getTranslation(lang).subscribe((value) => {
        this.culture = lang;
       
        
        this.images = new Array<string>();
        for(var i = 1; i <= 5; i++){
          this.images.push('./assets/imgs/instructions/' + this.culture + '/'+ i +'.png');
        }
      });
    });
  }

  skipInstructions(){

    this.router.navigate(['/home']);
   // this.navCtrl.navigateRoot('/home');
  }

  next() {
    this.slides.slideNext();
  }

  prev() {
    this.slides.slidePrev();
  }
}
