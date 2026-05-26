import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { createProductUseCases } from '../application/product.use-cases';
import { ProductApiRepository } from '../infrastructure/product.api';
import { PRODUCT_REPOSITORY, PRODUCT_USE_CASES } from '../presentation/di/product.tokens';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    { provide: PRODUCT_REPOSITORY, useClass: ProductApiRepository },
    {
      provide: PRODUCT_USE_CASES,
      useFactory: (repo: ProductApiRepository) => createProductUseCases(repo),
      deps: [PRODUCT_REPOSITORY],
    },
  ],
};
