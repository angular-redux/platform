import {
  composeReducers,
  ConnectArrayDirective,
  ConnectArrayTemplate,
  ConnectBase,
  ConnectDirective,
  defaultFormReducer,
  FORM_CHANGED,
  FormException,
  FormStore,
  formStoreFactory,
  NgReduxFormConnectArrayModule,
  NgReduxFormConnectModule,
  NgReduxFormModule,
  provideReduxForms,
  ReactiveConnectDirective,
} from './index';

describe('The @angular-redux/form package exports', () => {
  it('should contain the composeReducers function', () => {
    expect(composeReducers).toBeDefined();
  });

  it('should contain the ConnectArrayDirective class', () => {
    expect(ConnectArrayDirective).toBeDefined();
  });

  it('should contain the ConnectArrayTemplate class', () => {
    expect(ConnectArrayTemplate).toBeDefined();
  });

  it('should contain the ConnectBase class', () => {
    expect(ConnectBase).toBeDefined();
  });

  it('should contain the ConnectDirective class', () => {
    expect(ConnectDirective).toBeDefined();
  });

  it('should contain the defaultFormReducer function', () => {
    expect(defaultFormReducer).toBeDefined();
  });

  it('should contain the FORM_CHANGED const', () => {
    expect(FORM_CHANGED).toBeDefined();
  });

  it('should contain the FormException class', () => {
    expect(FormException).toBeDefined();
  });

  it('should contain the FormStore class', () => {
    expect(FormStore).toBeDefined();
  });

  it('should contain the formStoreFactory function', () => {
    expect(formStoreFactory).toBeDefined();
  });

  it('should contain the NgReduxFormConnectArrayModule class', () => {
    expect(NgReduxFormConnectArrayModule).toBeDefined();
  });

  it('should contain the NgReduxFormConnectModule class', () => {
    expect(NgReduxFormConnectModule).toBeDefined();
  });

  it('should contain the NgReduxFormModule class', () => {
    expect(NgReduxFormModule).toBeDefined();
  });

  it('should contain the provideReduxForms function', () => {
    expect(provideReduxForms).toBeDefined();
  });

  it('should contain the ReactiveConnectDirective class', () => {
    expect(ReactiveConnectDirective).toBeDefined();
  });
});
