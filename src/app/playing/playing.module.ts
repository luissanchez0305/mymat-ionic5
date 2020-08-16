import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlayingPageRoutingModule } from './playing-routing.module';
import { TranslateModule } from '@ngx-translate/core';

import { PlayingPage } from './playing';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlayingPageRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [PlayingPage]
})
export class PlayingPageModule {}
