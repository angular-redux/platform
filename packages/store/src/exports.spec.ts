import {
  DevToolsExtension,
  dispatch,
  enableFractalReducers,
  NgRedux,
  NgReduxModule,
  select,
  select$,
  WithSubStore,
} from './index';

describe('The @angular-redux/store package exports', () => {
  it('should contain the NgReduxModule class', () => {
    expect(NgReduxModule).toBeDefined();
  });

  it('should contain the NgRedux class', () => {
    expect(NgRedux).toBeDefined();
  });

  it('should contain the DevToolsExtension class', () => {
    expect(DevToolsExtension).toBeDefined();
  });

  it('should contain the enableFractalReducers function', () => {
    expect(enableFractalReducers).toBeDefined();
  });

  it('should contain the select property decorator', () => {
    expect(select).toBeDefined();
  });

  it('should contain the select$ property decorator', () => {
    expect(select$).toBeDefined();
  });

  it('should contain the dispatch property decorator', () => {
    expect(dispatch).toBeDefined();
  });

  it('should contain the WithSubStore class decorator', () => {
    expect(WithSubStore).toBeDefined();
  });
});
