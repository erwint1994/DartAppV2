import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game-setup',
  templateUrl: './game-setup.html',
  styleUrl: './game-setup.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameSetupComponent {
  readonly setsOptions = [1, 3, 5, 7];
  readonly legsOptions = [1, 3, 5];

  readonly selectedSets = signal(1);
  readonly selectedLegs = signal(3);

  private readonly router = inject(Router);

  selectSets(value: number): void {
    this.selectedSets.set(value);
  }

  selectLegs(value: number): void {
    this.selectedLegs.set(value);
  }

  startGame(): void {
    this.router.navigate(['/game'], {
      queryParams: {
        mode: '1v1-501',
        sets: this.selectedSets(),
        legs: this.selectedLegs(),
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}
