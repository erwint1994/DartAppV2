import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslationService } from '../../services/translation.service';

interface ReleaseNote {
  version: string;
  date: string;
  highlights: string[];
}

interface Language {
  code: string;
  label: string;
}

const LANGUAGES: Language[] = [
  { code: 'en', label: 'English' },
  { code: 'nl', label: 'Nederlands' },
  { code: 'de', label: 'Deutsch' },
  { code: 'fr', label: 'Français' },
  { code: 'es', label: 'Español' },
];

const RELEASE_NOTES: ReleaseNote[] = [
  {
    version: '1.0.0',
    date: '2026-03-26',
    highlights: [
      'Initial release of DartApp',
      '1v1 501 game mode with sets & legs',
      'Custom numpad for score entry (no keyboard popup)',
      'Standard double-out checkout suggestions (170 → 2)',
      'Bust detection with proper dart rules',
      'Undo system to revert any turn',
      'Quick-score buttons for common scores',
      'Turn history with last 6 entries',
      'Dark theme with orange accents and grid background',
      'Profile and Settings pages',
      'GitHub Pages deployment pipeline',
      'Strict ESLint with Angular typed linting',
    ],
  },
];

@Component({
  selector: 'app-settings',
  templateUrl: './settings.html',
  styleUrl: './settings.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {
  private readonly router = inject(Router);
  readonly i18n = inject(TranslationService);

  readonly appVersion: string = '1.0.0';
  readonly languages = LANGUAGES;
  readonly releaseNotes = RELEASE_NOTES;

  readonly selectedLanguage = signal<string>(this.loadLanguage());
  readonly showReleaseNotes = signal(false);

  selectLanguage(code: string): void {
    this.selectedLanguage.set(code);
    void this.i18n.use(code);
  }

  toggleReleaseNotes(): void {
    this.showReleaseNotes.update((v) => !v);
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  private loadLanguage(): string {
    if (typeof localStorage === 'undefined') {
      return 'en';
    }
    return localStorage.getItem('dartapp-lang') ?? 'en';
  }
}
