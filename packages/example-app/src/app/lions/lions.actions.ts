import { Injectable } from '@angular/core';
import { Action } from 'redux';

@Injectable()
export class LionsActions {
  static readonly LOAD_SUCCEEDED = 'LOAD_SUCCEEDED(LIONS)';
  static readonly LOAD_FAILED = 'LOAD_FAILED(LIONS)';

  loadSucceeded(payload) {
    return {
      type: LionsActions.LOAD_SUCCEEDED,
      payload,
    };
  }

  loadFailed(error) {
    return {
      type: LionsActions.LOAD_FAILED,
      error,
    };
  }
}
