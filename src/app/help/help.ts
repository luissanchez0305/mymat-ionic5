import { Component, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';

/**
 * Generated class for the HelpPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'app-help',
  templateUrl: 'help.html',
  styleUrls: ['./help.scss'],
  providers: [NavParams]
})
export class HelpPage implements OnInit {

  constructor(public navParams: NavParams) {
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    console.log('ionViewDidLoad HelpPage');
  }

}
