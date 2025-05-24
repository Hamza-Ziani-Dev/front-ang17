import { Injectable, Inject } from '@angular/core';
import { WINDOW } from '../apps/core/tokens/window.token';
@Injectable({
  providedIn: 'root'
})
export class WindowService {

  constructor(@Inject(WINDOW) private window: Window) {
  }

  getHostname(): string {
      return this.window.location.hostname;
  }
  getHost(): string {
    return this.window.location.host;
  }
  getProtocol(): string {
    return this.window.location.protocol;
  }
  getPort(): string {
    return this.window.location.port;
  }
}
