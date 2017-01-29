import { Injectable } from '@angular/core';
import { Action } from 'redux';

@Injectable()
export class ElephantsActions {
  static readonly LOAD_SUCCEEDED = 'LOAD_SUCCEEDED(ELEPHANTS)';
  static readonly LOAD_FAILED = 'LOAD_FAILED(ELEPHANTS)';

  loadSucceeded(payload) {
    return {
      type: ElephantsActions.LOAD_SUCCEEDED,
      payload,
    };
  }

  loadFailed(error) {
    return {
      type: ElephantsActions.LOAD_FAILED,
      error,
    };
  }
}
