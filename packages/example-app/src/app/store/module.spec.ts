import { DevToolsExtension, NgRedux } from '@angular-redux/store';
import {
  MockNgRedux,
  NgReduxTestingModule,
} from '@angular-redux/store/testing';
import { async, getTestBed, TestBed } from '@angular/core/testing';
import { RootEpics } from './epics';
import { StoreModule } from './module';

xdescribe('Store Module', () => {
  let mockNgRedux: NgRedux<any>;
  let devTools: DevToolsExtension;
  let mockEpics: Partial<RootEpics>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgReduxTestingModule],
    })
      .compileComponents()
      .then(() => {
        const testbed = getTestBed();

        mockEpics = {
          createEpics() {
            return [];
          },
        };

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
