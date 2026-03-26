import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.html',
  styleUrl: './settings.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {
  private readonly router = inject(Router);

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}
