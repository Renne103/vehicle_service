import configureMockStore from 'redux-mock-store';
import {thunk} from 'redux-thunk';
import axios from '../../utils/axios';
import reducer, {
  fetchCars,
  addNewCar,
  updateCar,
  getCarByVin,
  deleteCar,
  Car,
} from './carSlice';

jest.mock('../../utils/axios');
const mockAxios = axios as jest.Mocked<typeof axios>;

type State = { cars: Car[]; error: Record<string, string>[] | null };
const initialState: State = { cars: [], error: null };

const middlewares: any[] = [thunk];
const mockStore = configureMockStore<State>(middlewares);

describe('carSlice reducer', () => {
  it('should return initial state', () => {
    expect(reducer(undefined as any, { type: '' })).toEqual(initialState);
  });

  it('fetchCars.fulfilled sets cars & clears error', () => {
    const cars: Car[] = [{ vin: '1', model: 'M', brand: 'B', year_of_release: '2020', mileage: 100, plate_license: 'X', photo: 'p.png' }];
    const next = reducer(initialState, { type: fetchCars.fulfilled.type, payload: cars });
    expect(next).toEqual({ cars, error: null });
  });

  it('fetchCars.rejected sets error', () => {
    const next = reducer(initialState, { type: fetchCars.rejected.type, payload: 'err' });
    expect(next.error).toEqual('err');
  });

  it('addNewCar.rejected sets error', () => {
    const action = { type: addNewCar.rejected.type, payload: 'bad' };
    const next = reducer(initialState, action as any);
    expect(next.error).toEqual('bad');
  });

  it('updateCar.fulfilled updates existing car', () => {
    const prev: State = { cars: [{ vin: '1', model: 'X', brand: 'B', year_of_release: '1', mileage: 0, plate_license: '', photo: '' }], error: null };
    const updated = { vin: '1', model: 'Y', brand: 'B', year_of_release: '2', mileage: 10, plate_license: '', photo: '' };
    const next = reducer(prev, { type: updateCar.fulfilled.type, payload: updated });
    expect(next.cars[0]).toEqual(updated);
  });

  it('getCarByVin.fulfilled pushes if not exists', () => {
    const car: Car = { vin: '2', model: 'M2', brand: 'B2', year_of_release: '2021', mileage: 200, plate_license: '', photo: '' };
    const next = reducer(initialState, { type: getCarByVin.fulfilled.type, payload: car });
    expect(next.cars).toContainEqual(car);
  });

  it('deleteCar.fulfilled removes car', () => {
    const prev: State = { cars: [{ vin: '1', model:'',brand:'',year_of_release:'',mileage:0,plate_license:'',photo:'' }], error: null };
    const next = reducer(prev, { type: deleteCar.fulfilled.type, payload: '1' });
    expect(next.cars).toHaveLength(0);
  });
});

describe('carSlice thunks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetchCars dispatches pending and fulfilled', async () => {
    const cars: Car[] = [{ vin:'v', model:'m',brand:'b',year_of_release:'y',mileage:1,plate_license:'p',photo:'ph' }];
    mockAxios.get.mockResolvedValueOnce({ data: cars });
    const store = mockStore({ cars: [], error: null });

    await store.dispatch(fetchCars() as any);
    const types = store.getActions().map(a => a.type);
    expect(types).toEqual([fetchCars.pending.type, fetchCars.fulfilled.type]);
    expect(store.getActions()[1].payload).toEqual(cars);
  });

  it('fetchCars dispatches rejected on error', async () => {
    mockAxios.get.mockRejectedValueOnce(new Error());
    const store = mockStore(initialState);

    await store.dispatch(fetchCars() as any);
    const types = store.getActions().map(a => a.type);
    expect(types).toEqual([fetchCars.pending.type, fetchCars.rejected.type]);
  });

  it('addNewCar dispatches pending and fulfilled', async () => {
    const car: Car = { vin:'v', model:'m',brand:'b',year_of_release:'y',mileage:1,plate_license:'p',photo:'ph' };
    mockAxios.post.mockResolvedValueOnce({ data: car });
    const store = mockStore(initialState);

    await store.dispatch(addNewCar(car) as any);
    const types = store.getActions().map(a => a.type);
    expect(types).toEqual([addNewCar.pending.type, addNewCar.fulfilled.type]);
    expect(store.getActions()[1].payload).toEqual(car);
  });

  it('updateCar dispatches pending and fulfilled', async () => {
    const upd = { vin:'v', updates: { model:'mm' } };
    const resp: Car = { ...upd.updates as any, vin:'v', brand:'b', year_of_release:'y', mileage:1, plate_license:'p', photo:'ph' };
    mockAxios.patch.mockResolvedValueOnce({ data: resp });
    const store = mockStore(initialState);

    await store.dispatch(updateCar(upd) as any);
    const types = store.getActions().map(a => a.type);
    expect(types).toEqual([updateCar.pending.type, updateCar.fulfilled.type]);
  });

  it('getCarByVin dispatches pending and fulfilled', async () => {
    const car: Car = { vin:'z',model:'',brand:'',year_of_release:'',mileage:0,plate_license:'',photo:'' };
    mockAxios.get.mockResolvedValueOnce({ data: car });
    const store = mockStore(initialState);

    await store.dispatch(getCarByVin('z') as any);
    const types = store.getActions().map(a => a.type);
    expect(types).toEqual([getCarByVin.pending.type, getCarByVin.fulfilled.type]);
  });

  it('deleteCar dispatches pending and fulfilled', async () => {
    mockAxios.delete.mockResolvedValueOnce({ data: {} });
    const store = mockStore(initialState);

    await store.dispatch(deleteCar('v') as any);
    const types = store.getActions().map(a => a.type);
    expect(types).toEqual([deleteCar.pending.type, deleteCar.fulfilled.type]);
    expect(store.getActions()[1].payload).toBe('v');
  });
});
