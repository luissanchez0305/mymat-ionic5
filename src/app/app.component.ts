import { Component, ViewChild } from '@angular/core';

import { Platform, MenuController, ModalController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { Constants } from './services/constants';
import { Events } from './services/events';

import { HomePage } from './home/home';
import { HelpPage } from './help/help';
import { ContactPage } from './contact/contact';
import { SliderPage } from './slider/slider';
import { FavoritesPage } from './favorites/favorites';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
 
  rootPage: any = HomePage;
  lang_en : boolean;
  lang_es : boolean;
  lang_pt : boolean;
  lang_fr : boolean;
  lang_gr : boolean;
  lang_it : boolean;

  pages: Array<{title: string, component: any, icon: any, isPush: boolean, path: string}>;

  

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private translate: TranslateService,
    private storage: Storage,
    public events: Events, 
    private router: Router,
    public menuCtrl: MenuController,
    public modalCtrl: ModalController
  ) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'home-title', component: HomePage, icon: 'menuitemhome', isPush: false, path: '/home'},
      { title: 'help-title', component: HelpPage, icon: 'menuitemhelp', isPush: false, path: '/help' },
      { title: 'contact-title', component: ContactPage, icon: 'menuitemcontact', isPush: false, path: '/contact'},
      { title: 'fav-title', component: FavoritesPage, icon: 'menufavorites', isPush: true, path: '/favorites' },
      { title: 'slider-title', component: SliderPage, icon: 'menuiteminfo', isPush: true, path: '/slider'}
    ];
    platform.ready().then(() => {
      this.storage.get(Constants.storageKeyLang).then((value)=>{
        if(!value){
          value = navigator.language.split('-')[0];
          if(!value)
            value = 'en';
          translate.setDefaultLang(value);
        }
        translate.use(value);
        this.switchLang(value);
      })
      .catch(err => {
          var value = 'en';
          translate.setDefaultLang(value);
          translate.use(value);
          this.switchLang(value);
      });;
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.translate.setDefaultLang('en');
    });
  }
  switchLang(lang){
    this.events.publish('switchLangEvent',lang);
    this.events.publish('switchLangEventContact', lang);
    switch(lang){
      case 'es':
        this.lang_en = true;
        this.lang_es = false;
        this.lang_pt = true;
        this.lang_fr = true;
        this.lang_gr = true;
        this.lang_it = true;
        break;
      case 'en':
        this.lang_en = false;
        this.lang_es = true;
        this.lang_pt = true;
        this.lang_fr = true;
        this.lang_gr = true;
        this.lang_it = true;
        break;
      case 'pt':
        this.lang_en = true;
        this.lang_es = true;
        this.lang_pt = false;
        this.lang_fr = true;
        this.lang_gr = true;
        this.lang_it = true;
        break;
      case 'it':
        this.lang_en = true;
        this.lang_es = true;
        this.lang_pt = true;
        this.lang_fr = true;
        this.lang_gr = true;
        this.lang_it = false;
        break;
      case 'gr':
        this.lang_en = true;
        this.lang_es = true;
        this.lang_pt = true;
        this.lang_fr = true;
        this.lang_gr = false;
        this.lang_it = true;
        break;
      case 'fr':
        this.lang_en = true;
        this.lang_es = true;
        this.lang_pt = true;
        this.lang_fr = false;
        this.lang_gr = true;
        this.lang_it = true;
        break;
    }
    this.translate.use(lang);
    this.storage.set(Constants.storageKeyLang, lang);
    //this.menuCtrl.close();
  }
  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.router.navigate([page.path]);
    this.menuCtrl.close();      
  }
}
