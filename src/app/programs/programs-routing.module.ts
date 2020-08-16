import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProgramsPage } from './programs';
import { ProgramPage } from '../program/program';

const routes: Routes = [
  {
    path: '',
    component: ProgramsPage,
  },
  {    
  	path: 'program', 
  	component: ProgramPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProgramsPageRoutingModule {}
