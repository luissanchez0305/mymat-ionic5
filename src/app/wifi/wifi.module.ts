import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WifiPageRoutingModule } from './wifi-routing.module';
import { TranslateModule } from '@ngx-translate/core';

import { WifiPage } from './wifi';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WifiPageRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [WifiPage]
})
export class WifiPageModule {}
