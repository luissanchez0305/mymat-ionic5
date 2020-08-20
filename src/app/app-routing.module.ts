import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DataRSVService } from './data-rsv.service';


const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'  },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'contact', loadChildren: () => import('./contact/contact.module').then(m => m.ContactPageModule) },
  { path: 'favorites', loadChildren: () => import('./favorites/favorites.module').then(m => m.FavoritesPageModule) },
  { path: 'help', loadChildren: () => import('./help/help.module').then(m => m.HelpPageModule) },
  { path: 'playing', loadChildren: () => import('./playing/playing.module').then(m => m.PlayingPageModule) },
  { path: 'program', loadChildren: './program/program.module#ProgramPageModule' },
  { path: 'programs', loadChildren: () => import('./programs/programs.module').then(m => m.ProgramsPageModule) },
  { path: 'programs/:bubble', loadChildren: () => import('./programs/programs.module').then(m => m.ProgramsPageModule) },
  { path: 'slider', loadChildren: () => import('./slider/slider.module').then(m => m.SliderPageModule) },
  { path: 'subscribe', loadChildren: () => import('./subscribe/subscribe.module').then(m => m.SubscribePageModule) },
  { path: 'wifi', loadChildren: () => import('./wifi/wifi.module').then(m => m.WifiPageModule) },
  { path: 'wifi/:programs', loadChildren: () => import('./wifi/wifi.module').then(m => m.WifiPageModule) }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
    TranslateModule

  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
