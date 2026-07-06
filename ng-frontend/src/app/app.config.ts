import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideTransloco } from '@jsverse/transloco';
import { provideApollo } from 'apollo-angular';
import { routes } from './app.routes';
import { getApolloConfig, getTranslocoConfig } from './core/config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([])),
    provideApollo(getApolloConfig),
    provideHttpClient(),
    provideTransloco(getTranslocoConfig()),
  ],
};
