import { Component, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { APIServiceProvider } from '../services/api-service/api-service';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { Constants } from '../services/constants';
import { Events } from '../services/events';

/**
 * Generated class for the ContactPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'app-contact',
  templateUrl: 'contact.html',
  styleUrls: ['./contact.scss'],
  providers: [NavParams],
  
})
export class ContactPage implements OnInit {
  private contactForm : FormGroup;
  public contactDisabled : boolean;
  public  name_value : string;
  public  email_value : string;
  public  message_value : string;
  public button_send : string;
  public response_text : string;

  ngOnInit() {
  }
  
  constructor( public navParams: NavParams, private formBuilder: FormBuilder, public apiService : APIServiceProvider,
    private translateService: TranslateService, private storage: Storage, public events : Events) {
    this.contactForm = this.formBuilder.group({
      email: ['', Validators.required],
      name: ['', Validators.required],
      message: ['', Validators.required]
    });

    this.events.subscribe('switchLangEventContact',(data: any) => {
        //call methods to refresh content
        this.changeButtonText(data.lang);
    });
  }

  ionViewDidEnter() {
    this.cleanForm();
    this.response_text = '';
    this.storage.get(Constants.storageKeyLang).then((lang)=>{
      this.changeButtonText(lang);
    });
  }
  
  changeButtonText(lang){
      this.translateService.getTranslation(lang).subscribe((value) => {
        this.button_send = value['send-text'];
        // Mostrar texto en label debajo del boton
      });
  }

  cleanForm(){
    this.contactDisabled = true;
    this.name_value = '';
    this.email_value = '';
    this.message_value = '';
  }

  attemptSendMail(){
    var emailData = { email : this.contactForm.value.email, name : this.contactForm.value.name, message : this.contactForm.value.message };
    this.apiService.runPost('contact_us.php',emailData).then((result) => {
        var obj : any = result;
        if (obj.status == "ok") {
            this.storage.get(Constants.storageKeyLang).then((lang)=>{
              this.translateService.getTranslation(lang).subscribe((value) => {
                this.response_text = value['email-success-message'];
              });
            });

            this.storage.get(Constants.storageKeyLang).then((lang)=>{
              this.translateService.getTranslation(lang).subscribe((value) => {
                this.button_send = value['sent-text'];
                this.cleanForm();
              });
            });

        } else {
            this.storage.get(Constants.storageKeyLang).then((lang)=>{
              this.translateService.getTranslation(lang).subscribe((value) => {
                this.response_text = value['email-error-message'];
              });
            });
        }
    }, (result) => {
      this.storage.get(Constants.storageKeyLang).then((lang)=>{
        this.translateService.getTranslation(lang).subscribe((value) => {
          this.response_text = value['email-error-message'];
        });
      });
    });
  }
}
