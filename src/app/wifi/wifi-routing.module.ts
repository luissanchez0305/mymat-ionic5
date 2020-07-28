import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WifiPage } from './wifi';
import { PlayingPage } from '../playing/playing';

const routes: Routes = [
  {
    path: '',
    component: WifiPage
  },
  {
  	path: 'playing',
  	component: PlayingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WifiPageRoutingModule {}
