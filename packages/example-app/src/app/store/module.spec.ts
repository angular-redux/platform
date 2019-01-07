import { async } from '@angular/core/testing';
import { applyMiddleware, compose, createStore } from 'redux';
import { RootEpics } from './epics';
import { StoreModule } from './module';

describe('Store Module', () => {
  let mockEpics: Partial<RootEpics>;

  beforeEach(async(() => {
    mockEpics = {
      createEpics() {
        return [];
      },
    };
  }));

  it('should configure the store when the module is loaded', async(() => {
    const mockNgRedux = {
      configureStore(_: any, __: any, middleware: any = [], ___: any) {
        createStore(
          () => '',
          compose(...middleware.map((m: any) => applyMiddleware(m))),
        );
      },
    };
    const configureSpy = spyOn(mockNgRedux, 'configureStore').and.callThrough();
    const store = new StoreModule(
      mockNgRedux as any,
      {
        enhancer: jasmine.createSpy(),
        isEnabled: jasmine.createSpy(),
      } as any,
      null as any,
      mockEpics as any,
    );

    expect(configureSpy).toHaveBeenCalled();
  }));
});
