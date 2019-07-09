import {
  NgReduxRouter,
  NgReduxRouterModule,
  routerReducer,
  UPDATE_LOCATION,
} from './index';

describe('The @angular-redux/router package exports', () => {
  it('should contain the NgReduxRouter class', () => {
    expect(NgReduxRouter).toBeDefined();
  });

  it('should contain the NgReduxRouterModule class', () => {
    expect(NgReduxRouterModule).toBeDefined();
  });

  it('should contain the routerReducer function', () => {
    expect(routerReducer).toBeDefined();
  });

  it('should contain the UPDATE_LOCATION const', () => {
    expect(UPDATE_LOCATION).toBeDefined();
  });
});
