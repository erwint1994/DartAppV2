import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

interface GameOption {
  id: string;
  title: string;
  description: string;
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
  readonly games: GameOption[] = [
    {
      id: '1v1-501',
      title: '1 vs 1 — 501',
      description: 'Classic 501 game against a friend',
      icon: '🎯',
      enabled: true,
    },
    {
      id: '1vbot-501',
      title: '1 vs Bot — 501',
      description: 'Play 501 against the computer',
      icon: '🤖',
      enabled: false,
    },
    {
      id: '999',
      title: '999',
      description: 'Score as high as you can',
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
