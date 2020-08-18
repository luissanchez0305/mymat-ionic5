import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProgramsPageRoutingModule } from './programs-routing.module';
import { TranslateModule } from '@ngx-translate/core';

import { ProgramsPage } from './programs';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProgramsPageRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [ProgramsPage]
})
export class ProgramsPageModule {}
