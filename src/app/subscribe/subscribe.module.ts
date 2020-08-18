import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubscribePageRoutingModule } from './subscribe-routing.module';
import { TranslateModule } from '@ngx-translate/core';

import { SubscribePage } from './subscribe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SubscribePageRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [SubscribePage]
})
export class SubscribePageModule {}
