import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home';
import { WifiPage } from '../wifi/wifi';
import { ProgramsPage } from '../programs/programs';
import { SubscribePage } from '../subscribe/subscribe';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
  	path: 'wifi/:prog1/:prog2/:prog3/:prog4',
  	component: WifiPage
  },
  {
    path: '/programs/:bubble',
    component: ProgramsPage
  },
  {
    path: 'subscribe/:callback',
    component: SubscribePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
