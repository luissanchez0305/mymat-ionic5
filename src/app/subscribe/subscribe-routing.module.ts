import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SubscribePage } from './subscribe';

const routes: Routes = [
  {
    path: '',
    component: SubscribePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubscribePageRoutingModule {}
