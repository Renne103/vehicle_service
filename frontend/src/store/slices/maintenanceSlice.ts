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
  error: Record<string, string>[] | null;
}

const initialState: MaintenanceState = {
  list: [],
  current: undefined,
  loading: false,
  error: null,
};

export const fetchMaintenances = createAsyncThunk<
  Maintenance[],
  string,
  { rejectValue: string }
>('maintenance/fetchAll', async (vin, thunkAPI) => {
  try {
    const res = await axios.get<Maintenance[]>(`/maintenances?vin=${vin}`);
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

export const deleteMaintenance = createAsyncThunk<
  { id: number },
  { id: number; vin: string },
  { rejectValue: string }
>(
  'maintenance/delete',
  async ({ id, vin }, thunkAPI) => {
    try {
      await axios.delete(`/maintenances/${id}`, { params: { vin } });
      return { id };
    } catch {
      return thunkAPI.rejectWithValue('Ошибка при удалении обслуживания');
    }
  }
);

export const updateMaintenance = createAsyncThunk<
  Maintenance,
  { id: number; updates: Partial<Maintenance> },
  { rejectValue: string }
>(
  'maintenance/update',
  async ({ id, updates }, thunkAPI) => {
    try {
      const res = await axios.patch<Maintenance>(`/maintenances/${id}`, updates);
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.detail || 'Ошибка при обновлении обслуживания'
      );
    }
  }
);

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
        state.error = action.payload as unknown as Record<string, string>[];
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
        state.error = action.payload as unknown as Record<string, string>[];
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
        state.error = action.payload as unknown as Record<string, string>[];
      })

      .addCase(deleteMaintenance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMaintenance.fulfilled, (state, action) => {
        state.list = state.list.filter(m => m.id !== action.payload.id);
        if (state.current?.id === action.payload.id) {
          state.current = undefined;
        }
        state.loading = false;
      })
      .addCase(deleteMaintenance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as unknown as Record<string, string>[];
      })

      .addCase(updateMaintenance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMaintenance.fulfilled, (state, action: PayloadAction<Maintenance>) => {
        const idx = state.list.findIndex(m => m.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
        if (state.current?.id === action.payload.id) state.current = action.payload;
        state.loading = false;
      })
      .addCase(updateMaintenance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as unknown as Record<string, string>[];
      })
  },
});

export const { clearCurrent } = maintenanceSlice.actions;
export default maintenanceSlice.reducer;
