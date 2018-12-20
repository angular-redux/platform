import { DevToolsExtension, NgRedux } from '@angular-redux/store';
import {
  MockNgRedux,
  NgReduxTestingModule,
} from '@angular-redux/store/testing';
import { async, getTestBed, TestBed } from '@angular/core/testing';
import { RootEpics } from './epics';
import { StoreModule } from './module';

describe('Store Module', () => {
  let mockNgRedux: NgRedux<any>;
  let devTools: DevToolsExtension;
  let mockEpics: Partial<RootEpics>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgReduxTestingModule],
    })
  }));

  it('should configure the store when the module is loaded', async(() => {
    mockEpics = {
      createEpics() {
        return [];
      },
    };
    devTools = TestBed.get(DevToolsExtension);
    mockNgRedux = MockNgRedux.getInstance();

    const configureSpy = spyOn(MockNgRedux.getInstance(), 'configureStore');
    const module = new StoreModule(
      mockNgRedux,
      devTools,
      null as any,
      mockEpics as any,
    );

    expect(configureSpy).toHaveBeenCalled();
  }));
});
