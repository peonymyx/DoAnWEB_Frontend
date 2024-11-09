import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  statistical: [],
  isLoading: false,
  error: null,
};

// Thực hiện gọi API để lấy thông tin thống kê
export const fetchStatistical = createAsyncThunk(
  "/statistical/fetchStatistical", // Tên action trong Redux
  async () => {
    // Gửi yêu cầu GET đến API để lấy thông tin thống kê
    const response = await axios.get(
      "https://doanweb-api.onrender.com/api/v1/statistical" // Địa chỉ API lấy thông tin thống kê
    );
    // Trả về dữ liệu thống kê nhận được từ API
    return response.data;
  }
);

const statisticalSlice = createSlice({
  name: "statistical",
  initialState,
  reducers: {},
  extraReducers: {
    [fetchStatistical.pending]: (state) => {
      state.isLoading = true;
    },
    [fetchStatistical.fulfilled]: (state, action) => {
      state.statistical = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    [fetchStatistical.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.error;
    },
  },
});

export default statisticalSlice.reducer;
