import configureMockStore from 'redux-mock-store';
import {thunk} from 'redux-thunk';
import axios from '../../utils/axios';
import reducer, {
  CategoryOfWork,
  Maintenance,
  fetchMaintenances,
  fetchMaintenanceById,
  addNewMaintenance,
  deleteMaintenance,
  updateMaintenance,
  clearCurrent,
} from './maintenanceSlice';

jest.mock('../../utils/axios');
const mockAxios = axios as jest.Mocked<typeof axios>;

type State = {
  list: Maintenance[];
  current?: Maintenance;
  loading: boolean;
  error: Record<string, string>[] | null;
};

const initialState: State = {
  list: [],
  current: undefined,
  loading: false,
  error: null,
};

const middlewares: any[] = [thunk];
const mockStore = configureMockStore<State>(middlewares);

describe('maintenanceSlice reducer', () => {
  it('returns initial state', () => {
    expect(reducer(undefined as any, { type: '' })).toEqual(initialState);
  });

  it('clearCurrent resets current and error', () => {
    const prev: State = {
      ...initialState,
      current: { id:1, car_vin:'v', date:'d', mileage:0, cost:0, comments:'', category_of_work: CategoryOfWork.Other },
      error: [{ msg:'e' }],
    };
    const next = reducer(prev, clearCurrent());
    expect(next.current).toBeUndefined();
    expect(next.error).toBeNull();
  });

  it('fetchMaintenances.pending sets loading', () => {
    const next = reducer(initialState, { type: fetchMaintenances.pending.type });
    expect(next.loading).toBe(true);
    expect(next.error).toBeNull();
  });

  it('fetchMaintenances.fulfilled stores list & clears loading', () => {
    const list: Maintenance[] = [{ id:1, car_vin:'v', date:'d', mileage:0, cost:0, comments:'', category_of_work: CategoryOfWork.Engine }];
    const next = reducer(initialState, { type: fetchMaintenances.fulfilled.type, payload: list });
    expect(next.list).toEqual(list);
    expect(next.loading).toBe(false);
  });

  it('fetchMaintenances.rejected sets error & clears loading', () => {
    const next = reducer(initialState, { type: fetchMaintenances.rejected.type, payload: 'err' });
    expect(next.error).toEqual('err');
    expect(next.loading).toBe(false);
  });

  it('fetchMaintenanceById.fulfilled sets current & clears loading', () => {
    const item: Maintenance = { id:2, car_vin:'v2', date:'d2', mileage:1, cost:1, comments:'c', category_of_work: CategoryOfWork.Brakes };
    const next = reducer(initialState, { type: fetchMaintenanceById.fulfilled.type, payload: item });
    expect(next.current).toEqual(item);
    expect(next.loading).toBe(false);
  });

  it('addNewMaintenance.fulfilled pushes to list & clears loading', () => {
    const item: Maintenance = { id:3, car_vin:'v3', date:'d3', mileage:2, cost:2, comments:'c3', category_of_work: CategoryOfWork.Fuel };
    const next = reducer(initialState, { type: addNewMaintenance.fulfilled.type, payload: item });
    expect(next.list).toContainEqual(item);
    expect(next.loading).toBe(false);
  });

  it('deleteMaintenance.fulfilled removes from list & clears current & loading', () => {
    const prev: State = {
      list: [{ id:4, car_vin:'v4', date:'d4', mileage:3, cost:3, comments:'c4', category_of_work: CategoryOfWork.Other }],
      current: { id:4, car_vin:'v4', date:'d4', mileage:3, cost:3, comments:'c4', category_of_work: CategoryOfWork.Other },
      loading: false,
      error: null,
    };
    const next = reducer(prev, { type: deleteMaintenance.fulfilled.type, payload: { id: 4 } });
    expect(next.list).toHaveLength(0);
    expect(next.current).toBeUndefined();
    expect(next.loading).toBe(false);
  });

  it('updateMaintenance.fulfilled updates list & current & clears loading', () => {
    const orig: Maintenance = { id:5, car_vin:'v5', date:'d5', mileage:4, cost:4, comments:'c5', category_of_work: CategoryOfWork.Steering };
    const updated: Maintenance = { ...orig, cost:10 };
    const prev: State = { list: [orig], current: orig, loading:false, error:null };
    const next = reducer(prev, { type: updateMaintenance.fulfilled.type, payload: updated });
    expect(next.list[0].cost).toBe(10);
    expect(next.current?.cost).toBe(10);
    expect(next.loading).toBe(false);
  });
});

describe('maintenanceSlice thunks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetchMaintenances success', async () => {
    const vin = 'V1';
    const data: Maintenance[] = [{ id:1, car_vin:vin, date:'d', mileage:0, cost:0, comments:'', category_of_work: CategoryOfWork.Engine }];
    mockAxios.get.mockResolvedValueOnce({ data });
    const store = mockStore(initialState);

    await store.dispatch(fetchMaintenances(vin) as any);
    const types = store.getActions().map(a => a.type);
    expect(types).toEqual([fetchMaintenances.pending.type, fetchMaintenances.fulfilled.type]);
  });

  it('fetchMaintenances failure', async () => {
    mockAxios.get.mockRejectedValueOnce(new Error());
    const store = mockStore(initialState);

    await store.dispatch(fetchMaintenances('V2') as any);
    const types = store.getActions().map(a => a.type);
    expect(types).toEqual([fetchMaintenances.pending.type, fetchMaintenances.rejected.type]);
  });

  it('addNewMaintenance success', async () => {
    const payload = { car_vin:'v', date:'d', mileage:0, cost:0, comments:'', category_of_work: CategoryOfWork.Body } as Omit<Maintenance,'id'>;
    const res: Maintenance = { ...payload, id:10 };
    mockAxios.post.mockResolvedValueOnce({ data: res });
    const store = mockStore(initialState);

    await store.dispatch(addNewMaintenance(payload) as any);
    const types = store.getActions().map(a => a.type);
    expect(types).toEqual([addNewMaintenance.pending.type, addNewMaintenance.fulfilled.type]);
  });

  it('deleteMaintenance success', async () => {
    mockAxios.delete.mockResolvedValueOnce({});
    const store = mockStore({ ...initialState, list: [{ id:20, car_vin:'x', date:'', mileage:0, cost:0, comments:'', category_of_work: CategoryOfWork.Other }] });

    await store.dispatch(deleteMaintenance({ id:20, vin:'x' }) as any);
    const types = store.getActions().map(a => a.type);
    expect(types).toEqual([deleteMaintenance.pending.type, deleteMaintenance.fulfilled.type]);
  });

  it('updateMaintenance success', async () => {
    const upd = { id:30, updates: { cost:99 } };
    const res: Maintenance = { id:30, car_vin:'z', date:'', mileage:0, cost:99, comments:'', category_of_work: CategoryOfWork.Transmission };
    mockAxios.patch.mockResolvedValueOnce({ data: res });
    const store = mockStore({ ...initialState, list: [res] });

    await store.dispatch(updateMaintenance(upd) as any);
    const types = store.getActions().map(a => a.type);
    expect(types).toEqual([updateMaintenance.pending.type, updateMaintenance.fulfilled.type]);
  });
});
