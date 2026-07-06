import { isDevMode } from '@angular/core';
import { TranslocoOptions } from '@jsverse/transloco';
import { TranslocoHttpLoader } from '../loaders';

export function getTranslocoConfig(): TranslocoOptions {
  return {
    config: {
      availableLangs: ['en', 'uk'],
      defaultLang: 'en',
      reRenderOnLangChange: true,
      prodMode: !isDevMode(),
    },
    loader: TranslocoHttpLoader,
  };
}
