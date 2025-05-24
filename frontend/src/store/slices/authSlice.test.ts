import configureMockStore from 'redux-mock-store';
import {thunk} from 'redux-thunk';
import axios from '../../utils/axios';
import reducer, { logout, registerUser, loginUser } from './authSlice';

jest.mock('../../utils/axios');
const mockAxios = axios as jest.Mocked<typeof axios>;

const middlewares : any[] = [thunk];
const mockStore = configureMockStore(middlewares);

describe('authSlice reducer', () => {
  const initialState = {
    token: null,
    username: null,
    error: null,
  };

  beforeEach(() => {
    localStorage.clear();
  });

  it('should handle logout', () => {
	const prevError = [{ msg: 'e' }];
	localStorage.setItem('token', 'abc123');
	const prev = { token: 'abc123', username: 'joe', error: prevError };
	const next = reducer(prev as any, logout());
  
	expect(next.token).toBeNull();
	expect(next.username).toBeNull();
	expect(localStorage.getItem('token')).toBeNull();
  
	expect(next.error).toBe(prevError);
  });

  it('should clear error on registerUser.pending', () => {
    const next = reducer(initialState as any, { type: registerUser.pending.type });
    expect(next.error).toBeNull();
  });

  it('should set username on registerUser.fulfilled', () => {
    const action = {
      type: registerUser.fulfilled.type,
      payload: { username: 'alice' },
    };
    const next = reducer(initialState as any, action);
    expect(next.username).toBe('alice');
  });

  it('should set error on registerUser.rejected', () => {
    const errors = [{ detail: 'fail' }];
    const action = {
      type: registerUser.rejected.type,
      payload: errors,
    };
    const next = reducer(initialState as any, action as any);
    expect(next.error).toEqual(errors);
  });

  it('should clear error on loginUser.pending', () => {
    const next = reducer(initialState as any, { type: loginUser.pending.type });
    expect(next.error).toBeNull();
  });

  it('should set token on loginUser.fulfilled', () => {
    const action = {
      type: loginUser.fulfilled.type,
      payload: { token: 'tok123' },
    };
    const next = reducer(initialState as any, action);
    expect(next.token).toBe('tok123');
  });

  it('should set error on loginUser.rejected', () => {
    const errors = [{ detail: 'bad' }];
    const action = {
      type: loginUser.rejected.type,
      payload: errors,
    };
    const next = reducer(initialState as any, action as any);
    expect(next.error).toEqual(errors);
  });
});

describe('authSlice thunks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('registerUser: dispatches pending then fulfilled on success', async () => {
    mockAxios.post.mockResolvedValueOnce({ data: { username: 'bob' } });
    const store = mockStore({ auth: {} });

    await store.dispatch(
      registerUser({
        username: 'bob',
        password: 'p',
        second_password: 'p',
        tg: '@t',
      }) as any
    );

    const types = store.getActions().map(a => a.type);
    expect(types).toEqual([
      registerUser.pending.type,
      registerUser.fulfilled.type,
    ]);

    const fulfilled = store.getActions().find(a => a.type === registerUser.fulfilled.type)!;
    expect(fulfilled.payload).toEqual({ username: 'bob' });
  });

  it('registerUser: dispatches pending then rejected on failure', async () => {
    mockAxios.post.mockRejectedValueOnce({ response: { data: { detail: 'Bad' } } });
    const store = mockStore({ auth: {} });

    await store.dispatch(
      registerUser({
        username: 'u',
        password: 'p',
        second_password: 'pp',
        tg: '',
      }) as any
    );

    const types = store.getActions().map(a => a.type);
    expect(types).toEqual([
      registerUser.pending.type,
      registerUser.rejected.type,
    ]);

    const rejected = store.getActions().find(a => a.type === registerUser.rejected.type)!;
    expect(rejected.payload).toBe('Bad');
  });

  it('loginUser: dispatches pending then fulfilled and sets localStorage', async () => {
    mockAxios.post.mockResolvedValueOnce({ data: { token: 'xyz' } });
    const store = mockStore({ auth: {} });

    await store.dispatch(
      loginUser({ username: 'u', password: 'p' }) as any
    );

    const types = store.getActions().map(a => a.type);
    expect(types).toEqual([
      loginUser.pending.type,
      loginUser.fulfilled.type,
    ]);
    expect(localStorage.getItem('token')).toBe('xyz');

    const fulfilled = store.getActions().find(a => a.type === loginUser.fulfilled.type)!;
    expect(fulfilled.payload).toEqual({ token: 'xyz' });
  });

  it('loginUser: dispatches pending then rejected on failure', async () => {
    mockAxios.post.mockRejectedValueOnce({ response: { data: { detail: 'Fail' } } });
    const store = mockStore({ auth: {} });

    await store.dispatch(
      loginUser({ username: 'u', password: 'p' }) as any
    );

    const types = store.getActions().map(a => a.type);
    expect(types).toEqual([
      loginUser.pending.type,
      loginUser.rejected.type,
    ]);

    const rejected = store.getActions().find(a => a.type === loginUser.rejected.type)!;
    expect(rejected.payload).toBe('Fail');
  });
});
