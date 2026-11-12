import { act } from 'react';
import {
  resetMapRouteEditorStateAction,
  setRouteToEditModeAction,
  setSelectedRouteIdAction,
  setVisibleRouteIdsAction,
  store,
} from '..';
import { selectVisibleOrSelectedRouteIds } from './mapRouteEditor';

describe('selectVisibleOrSelectedRouteIds', () => {
  beforeEach(() => {
    act(() => {
      store.dispatch(resetMapRouteEditorStateAction());
    });
  });

  it('returns only the visible route ids when nothing is selected', () => {
    act(() => {
      store.dispatch(setVisibleRouteIdsAction(['route-1']));
    });

    expect(selectVisibleOrSelectedRouteIds(store.getState())).toEqual([
      'route-1',
    ]);
  });

  it('does not add a merely opened (selected) route that is not visible', () => {
    act(() => {
      store.dispatch(setVisibleRouteIdsAction(['route-1']));
      store.dispatch(setSelectedRouteIdAction('route-2'));
    });

    expect(selectVisibleOrSelectedRouteIds(store.getState())).toEqual([
      'route-1',
    ]);
  });

  it('adds the selected route while it is being drawn / edited', () => {
    act(() => {
      store.dispatch(setVisibleRouteIdsAction(['route-1']));
      store.dispatch(setSelectedRouteIdAction('route-2'));
      store.dispatch(setRouteToEditModeAction());
    });

    expect(selectVisibleOrSelectedRouteIds(store.getState())).toEqual([
      'route-1',
      'route-2',
    ]);
  });

  it('does not duplicate a selected route that is already visible', () => {
    act(() => {
      store.dispatch(setVisibleRouteIdsAction(['route-1']));
      store.dispatch(setSelectedRouteIdAction('route-1'));
      store.dispatch(setRouteToEditModeAction());
    });

    expect(selectVisibleOrSelectedRouteIds(store.getState())).toEqual([
      'route-1',
    ]);
  });
});
