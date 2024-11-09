import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Swal from "sweetalert2";
import axios from "axios";

const initialState = {
  messages: [],
  isLoading: false,
  error: null,
};

// Lấy tin nhắn của người gửi
export const getMessenger = createAsyncThunk(
  "messenger/getMessenger", // Tên action
  async (payload, { rejectWithValue }) => {
    console.log(payload); // In ra payload (ID người gửi)
    try {
      // Gửi yêu cầu GET để lấy tin nhắn của người gửi theo senderId
      const res = await axios.get(
        `https://doanweb-api.onrender.com/api/v1/messenger?senderId=${payload}`
      );
      console.log(res.data); // In ra dữ liệu nhận được
      return res.data; // Trả về dữ liệu tin nhắn
    } catch (error) {
      // Trả về lỗi nếu có lỗi xảy ra
      return rejectWithValue(error.response.data);
    }
  }
);

// Thêm tin nhắn mới
export const addMessenger = createAsyncThunk(
  "messenger/addMessenger", // Tên action
  async (payload, { rejectWithValue }) => {
    try {
      // Gửi yêu cầu POST để thêm tin nhắn mới
      const res = await axios.post(
        "https://doanweb-api.onrender.com/api/v1/messenger/add",
        payload // Dữ liệu tin nhắn mới
      );
      return res.data.messenger; // Trả về dữ liệu tin nhắn đã thêm
    } catch (error) {
      // Hiển thị thông báo lỗi nếu có lỗi xảy ra
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response.data.message, // Lỗi từ API
      });
      // Trả về lỗi nếu có lỗi xảy ra
      return rejectWithValue(error.response.data);
    }
  }
);

const messengerSlice = createSlice({
  name: "messenger",
  initialState,
  reducers: {},
  extraReducers: {
    [getMessenger.pending]: (state) => {
      state.isLoading = true;
    },
    [getMessenger.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.messages = action.payload;
    },
    [getMessenger.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    [addMessenger.pending]: (state) => {
      state.isLoading = true;
    },
    [addMessenger.fulfilled]: (state, action) => {
      state.isLoading = false;
      const { content, user_id } = action.meta.arg;
      state.messages.push({ content, user_id });
    },
    [addMessenger.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export default messengerSlice.reducer;
