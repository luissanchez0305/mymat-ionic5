import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FavoritesPageRoutingModule } from './favorites-routing.module';
import { TranslateModule } from '@ngx-translate/core';

import { FavoritesPage } from './favorites';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormsModule, ReactiveFormsModule,
    FavoritesPageRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [FavoritesPage]
})
export class FavoritesPageModule {}
