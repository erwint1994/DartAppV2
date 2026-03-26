import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { GameSetupComponent } from './pages/game-setup/game-setup';
import { GameComponent } from './pages/game/game';
import { ProfileComponent } from './pages/profile/profile';
import { SettingsComponent } from './pages/settings/settings';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'game-setup', component: GameSetupComponent },
  { path: 'game', component: GameComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'settings', component: SettingsComponent },
  { path: '**', redirectTo: '' },
];
