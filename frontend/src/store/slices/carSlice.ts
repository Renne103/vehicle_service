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
    const res = await axios.get('/cars');
    return res.data as Car[];
  } catch (err: any) {
    return thunkAPI.rejectWithValue('Ошибка при получении машин');
  }
});

export const addNewCar = createAsyncThunk(
  'cars/addNewCar',
  async (carData: Car, thunkAPI) => {
    try {
      const res = await axios.post('/cars', carData);
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
      const res = await axios.post('/docs/', formData, {
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
      });
  },
});

export default carSlice.reducer;
