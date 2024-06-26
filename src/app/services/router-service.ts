import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';

import { APP_BASE_HREF } from '@angular/common';

@Injectable()
export class RouterService {
  constructor(private router: Router, @Inject(APP_BASE_HREF) private baseHref: string) {}

  getCurrentUrl(): string {
    return this.router.url;
  }

  getBasePath(): string {
    return this.baseHref;
  }

  private getBaseUrl(): string {
    return `${window.location.protocol}//${window.location.host}`;
  }

  createFullUrlWithBaseUrlAndBasePath(path: string): string {
    const urlPath = path || '/';
    const [protocol, host] = this.getBaseUrl().split('//');
    const hostWithPath = `${host}/${this.getBasePath()}/${urlPath}`.replace(/\/+/g, '/');
    return `${protocol}//${hostWithPath}`;
  }

  redirectToHome(): void {
    this.router.navigate(['/']);
  }

  redirectToUnavailable(): void {
    this.router.navigate(['/unavailable']);
  }

  redirectTo(route: string): void {
    this.router.navigate([`/${route}`]);
  }
}
