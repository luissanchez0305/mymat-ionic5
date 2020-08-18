import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HomePageRoutingModule } from './home-routing.module';
import { TranslateModule } from '@ngx-translate/core';

import { HomePage } from './home';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormsModule, ReactiveFormsModule,
    HomePageRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
