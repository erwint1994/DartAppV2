import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

type TranslationData = Record<string, unknown>;

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private readonly http = inject(HttpClient);
  private readonly translations = signal<TranslationData>({});
  private readonly currentLang = signal('en');

  readonly lang = this.currentLang.asReadonly();

  /** Reactive flag — true once any translation file has loaded */
  readonly ready = computed((): boolean => Object.keys(this.translations()).length > 0);

  constructor() {
    const saved = typeof localStorage !== 'undefined'
      ? localStorage.getItem('dartapp-lang') ?? 'en'
      : 'en';
    void this.use(saved);
  }

  async use(lang: string): Promise<void> {
    this.currentLang.set(lang);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('dartapp-lang', lang);
    }
    try {
      const data = await firstValueFrom(
        this.http.get<TranslationData>(`i18n/${lang}.json`),
      );
      this.translations.set(data);
    } catch {
      if (lang !== 'en') {
        await this.use('en');
      }
    }
  }

  /** Look up a dot-separated key, e.g. "game.bust" */
  t(key: string, params?: Record<string, string | number>): string {
    const parts = key.split('.');
    let current: unknown = this.translations();
    for (const part of parts) {
      if (current !== null && typeof current === 'object') {
        current = (current as Record<string, unknown>)[part];
      } else {
        return key;
      }
    }
    if (typeof current !== 'string') {
      return key;
    }
    if (params) {
      return Object.entries(params).reduce<string>(
        (str, [k, v]) => str.replace(`{{${k}}}`, String(v)),
        current,
      );
    }
    return current;
  }
}
