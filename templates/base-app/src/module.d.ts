import '@metafox/framework/Manager';
import {AppState} from './types';

declare module '@metafox/framework/Manager' {
  interface Manager {
    // add more services
  }

  interface GlobalState {
    __appName__?: AppState;
  }
}
