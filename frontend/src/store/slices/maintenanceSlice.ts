import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

export enum CategoryOfWork {
  Engine = 'Двигатель и его компоненты',
  Transmission = 'Трансмиссия',
  Suspension = 'Подвеска и ходовая часть',
  Brakes = 'Тормозная система',
  Steering = 'Рулевое управление',
  Electrical = 'Электрооборудование',
  Fuel = 'Топливная система',
  Exhaust = 'Выхлопная система',
  AirConditioning = 'Система кондиционирования',
  Body = 'Кузовные работы',
  Other = 'Прочие работы',
}

export interface Maintenance {
  id: number;
  car_vin: string;
  date: string;
  mileage: number;
  cost: number;
  comments: string;
  category_of_work: CategoryOfWork;
  documents?: string[];
}

interface MaintenanceState {
  list: Maintenance[];
  current?: Maintenance;
  loading: boolean;
  error: string | null;
}

const initialState: MaintenanceState = {
  list: [],
  current: undefined,
  loading: false,
  error: null,
};

export const fetchMaintenances = createAsyncThunk<
  Maintenance[],
  void,
  { rejectValue: string }
>('maintenance/fetchAll', async (_, thunkAPI) => {
  try {
    const res = await axios.get<Maintenance[]>('/maintenances/');
    return res.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue('Ошибка при загрузке списка обслуживаний');
  }
});

export const fetchMaintenanceById = createAsyncThunk<
  Maintenance,
  number,
  { rejectValue: string }
>('maintenance/fetchById', async (id, thunkAPI) => {
  try {
    const res = await axios.get<Maintenance>(`/maintenances/${id}`);
    return res.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue('Ошибка при загрузке данных обслуживания');
  }
});

export const addNewMaintenance = createAsyncThunk<
  Maintenance,
  Omit<Maintenance, 'id'>,
  { rejectValue: string }
>('maintenance/addNew', async (payload, thunkAPI) => {
  try {
    const res = await axios.post<Maintenance>('/maintenances/', payload);
    return res.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(
      err.response?.data?.detail || 'Ошибка при создании обслуживания'
    );
  }
});

const maintenanceSlice = createSlice({
  name: 'maintenance',
  initialState,
  reducers: {
    clearCurrent: (state) => {
      state.current = undefined;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMaintenances.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMaintenances.fulfilled, (state, action: PayloadAction<Maintenance[]>) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(fetchMaintenances.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Неизвестная ошибка';
      })
      .addCase(fetchMaintenanceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMaintenanceById.fulfilled, (state, action: PayloadAction<Maintenance>) => {
        state.current = action.payload;
        state.loading = false;
      })
      .addCase(fetchMaintenanceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Неизвестная ошибка';
      })
      .addCase(addNewMaintenance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addNewMaintenance.fulfilled, (state, action: PayloadAction<Maintenance>) => {
        state.list.push(action.payload);
        state.loading = false;
      })
      .addCase(addNewMaintenance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Неизвестная ошибка';
      });
  },
});

export const { clearCurrent } = maintenanceSlice.actions;
export default maintenanceSlice.reducer;
