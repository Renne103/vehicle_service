import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

export interface Car {
  vin: string;
  model: string;
  brand: string;
  year_of_release: string;
  mileage: number;
  plate_license: string;
  photo: string;
}

interface CarState {
  cars: Car[];
  error: Record<string, string>[] | null;
}

const initialState: CarState = {
  cars: [],
  error: null,
};

export const fetchCars = createAsyncThunk('cars/fetchCars', async (_, thunkAPI) => {
  try {
    const res = await axios.get('/cars/');
    return res.data as Car[];
  } catch (err: any) {
    return thunkAPI.rejectWithValue('Ошибка при получении машин');
  }
});

export const addNewCar = createAsyncThunk(
  'cars/addNewCar',
  async (carData: Car, thunkAPI) => {
    try {
      const res = await axios.post('/cars/', carData);
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.detail || 'Ошибка при добавлении машины');
    }
  }
);

export const uploadCarPhoto = createAsyncThunk(
  'cars/uploadCarPhoto',
  async (photo: File, thunkAPI) => {
    const formData = new FormData();
    formData.append('photo', photo);

    try {
      const res = await axios.post('/documents/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue('Ошибка при загрузке фото');
    }
  }
);

export const updateCar = createAsyncThunk(
  'cars/updateCar',
  async ({ vin, updates }: { vin: string; updates: Partial<Car> }, thunkAPI) => {
    try {
      const res = await axios.patch(`/cars/${vin}/`, updates);
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue('Ошибка при обновлении машины');
    }
  }
);

export const getCarByVin = createAsyncThunk(
  'cars/getCarByVin',
  async (vin: string, thunkAPI) => {
    try {
      const res = await axios.get(`/cars/${vin}/`);
      return res.data as Car;
    } catch (err: any) {
      return thunkAPI.rejectWithValue('Ошибка при получении машины');
    }
  }
);
export const deleteCar = createAsyncThunk(
  'cars/deleteCar',
  async (vin: string, thunkAPI) => {
    try {
      await axios.delete(`/cars/${vin}/`);
      return vin; // возвращаем VIN для удаления из состояния
    } catch (err: any) {
      return thunkAPI.rejectWithValue('Ошибка при удалении машины');
    }
  }
);



const carSlice = createSlice({
  name: 'cars',
  initialState,
  reducers: {
    resetErrors(state, action) {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCars.fulfilled, (state, action) => {
        state.cars = action.payload;
        state.error = null;
      })
      .addCase(fetchCars.rejected, (state, action) => {
        state.error = action.payload as Record<string, string>[];
      })
      .addCase(addNewCar.rejected, (state, action) => {
        state.error = action.payload as Record<string, string>[];
      })

      .addCase(uploadCarPhoto.fulfilled, (state, action) => {
        state.error = null;
        console.log(action.payload);
      })
      .addCase(uploadCarPhoto.rejected, (state, action) => {
        state.error = action.payload as Record<string, string>[];
      })

      .addCase(updateCar.fulfilled, (state, action) => {
        const index = state.cars.findIndex(car => car.vin === action.payload.vin);
        if (index !== -1) {
          state.cars[index] = action.payload;
        }
      })
      .addCase(getCarByVin.fulfilled, (state, action) => {
        const exists = state.cars.find(car => car.vin === action.payload.vin);
        if (!exists) {
          state.cars.push(action.payload);
        }
      })
      .addCase(deleteCar.fulfilled, (state, action) => {
        state.cars = state.cars.filter(car => car.vin !== action.payload);
      })
      .addCase(updateCar.rejected, (state, action) => {
        state.error = [{ error: action.payload as string }];
      })
      .addCase(getCarByVin.rejected, (state, action) => {
        state.error = [{ error: action.payload as string }];
      })
      .addCase(deleteCar.rejected, (state, action) => {
        state.error = [{ error: action.payload as string }];
      });
      
  },
});

export default carSlice.reducer;
export const { resetErrors } = carSlice.actions;
