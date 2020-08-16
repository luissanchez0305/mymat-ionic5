import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'contact',
    loadChildren: () => import('./contact/contact.module').then(m => m.ContactPageModule)
  },
  {
    path: 'favorites',
    loadChildren: () => import('./favorites/favorites.module').then(m => m.FavoritesPageModule)
  },
  {
    path: 'help',
    loadChildren: () => import('./help/help.module').then(m => m.HelpPageModule)
  },
  {
    path: 'playing',
    loadChildren: () => import('./playing/playing.module').then(m => m.PlayingPageModule)
  },
  {
    path: 'program',
    loadChildren: () => import('./program/program.module').then(m => m.ProgramPageModule)
  },
  {
    path: 'programs/:bubble',
    loadChildren: () => import('./programs/programs.module').then(m => m.ProgramsPageModule)
  },
  {
    path: 'slider',
    loadChildren: () => import('./slider/slider.module').then(m => m.SliderPageModule)
  },
  {
    path: 'subscribe',
    loadChildren: () => import('./subscribe/subscribe.module').then(m => m.SubscribePageModule)
  },
  {
    path: 'wifi',
    loadChildren: () => import('./wifi/wifi.module').then(m => m.WifiPageModule)
  },
  {
    path: 'example',
    loadChildren: () => import('./example/example.module').then( m => m.ExamplePageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
    TranslateModule

  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
