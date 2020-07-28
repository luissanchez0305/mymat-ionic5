import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContactPageRoutingModule } from './contact-routing.module';
import { TranslateModule } from '@ngx-translate/core';

import { ContactPage } from './contact';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContactPageRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [ContactPage]
})
export class ContactPageModule {}
