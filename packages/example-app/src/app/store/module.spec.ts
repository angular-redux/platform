import { NgRedux, DevToolsExtension } from '@angular-redux/store';
import { NgReduxTestingModule, MockNgRedux } from '@angular-redux/store/testing';
import { TestBed, async, getTestBed } from '@angular/core/testing';
import { StoreModule } from './module';
import { IAppState } from './model';
import { RootEpics } from './epics';

describe('Store Module', () => {
  let mockNgRedux: NgRedux<any>;
  let devTools: DevToolsExtension;
  let mockEpics: RootEpics;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ NgReduxTestingModule ],
    }).compileComponents().then(() => {
      const testbed = getTestBed();

      mockEpics = {
        createEpics() { return [] }
      } as RootEpics;

      devTools = testbed.get(DevToolsExtension);
      mockNgRedux = MockNgRedux.getInstance();
    });
  }));

  it('should configure the store when the module is loaded', async(() => {
    const configureSpy = spyOn(MockNgRedux.getInstance(), 'configureStore');
    const instance = new StoreModule(mockNgRedux, devTools, null, mockEpics);

    expect(configureSpy).toHaveBeenCalled();
  }));
});
