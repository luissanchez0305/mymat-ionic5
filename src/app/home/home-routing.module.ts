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
  	path: 'wifi/:programs',
  	component: WifiPage,
  },
  {
    path: 'subscribe/:callback',
    component: SubscribePage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
