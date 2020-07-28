import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProgramPageRoutingModule } from './program-routing.module';
import { TranslateModule } from '@ngx-translate/core';

import { ProgramPage } from './program';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProgramPageRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [ProgramPage]
})
export class ProgramPageModule {}
