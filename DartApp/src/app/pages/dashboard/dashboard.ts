import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslationService } from '../../services/translation.service';

interface GameOption {
  id: string;
  titleKey: string;
  descKey: string;
  icon: string;
  enabled: boolean;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  readonly i18n = inject(TranslationService);

  readonly games: GameOption[] = [
    {
      id: '1v1-501',
      titleKey: 'dashboard.games.1v1-501.title',
      descKey: 'dashboard.games.1v1-501.description',
      icon: '🎯',
      enabled: true,
    },
    {
      id: '1vbot-501',
      titleKey: 'dashboard.games.1vbot-501.title',
      descKey: 'dashboard.games.1vbot-501.description',
      icon: '🤖',
      enabled: false,
    },
    {
      id: '999',
      titleKey: 'dashboard.games.999.title',
      descKey: 'dashboard.games.999.description',
      icon: '💯',
      enabled: false,
    },
  ];

  private readonly router = inject(Router);

  selectGame(game: GameOption): void {
    if (!game.enabled) {
      return;
    }
    if (game.id === '1v1-501') {
      this.router.navigate(['/game-setup']);
    }
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  goToSettings(): void {
    this.router.navigate(['/settings']);
  }
}
