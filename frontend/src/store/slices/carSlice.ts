import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

export interface Car {
  vin: string;
  model: string;
  brand: string;
  year_of_release: string;
  mileage: number;
}

interface CarState {
  cars: Car[];
  error: string | null;
}

const initialState: CarState = {
  cars: [],
  error: null,
};

export const fetchCars = createAsyncThunk('cars/fetchCars', async (_, thunkAPI) => {
  try {
    const res = await axios.get('/cars/cars');
    return res.data as Car[];
  } catch (err: any) {
    return thunkAPI.rejectWithValue('Ошибка при получении машин');
  }
});

export const addNewCar = createAsyncThunk(
  'cars/addNewCar',
  async (carData: Car, thunkAPI) => {
    try {
      const res = await axios.post('/cars/new_car', carData);
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.detail || 'Ошибка при добавлении машины');
    }
  }
);

const carSlice = createSlice({
  name: 'cars',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCars.fulfilled, (state, action) => {
        state.cars = action.payload;
        state.error = null;
      })
      .addCase(fetchCars.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(addNewCar.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export default carSlice.reducer;
