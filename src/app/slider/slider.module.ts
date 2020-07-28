import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SliderPageRoutingModule } from './slider-routing.module';
import { TranslateModule } from '@ngx-translate/core';

import { SliderPage } from './slider';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SliderPageRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [SliderPage]
})
export class SliderPageModule {}
