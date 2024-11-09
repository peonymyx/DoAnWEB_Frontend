import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Swal from "sweetalert2";
import axios from "axios";

const initialState = {
  other: [],
  selectedOther: null,
  isLoading: false,
  error: null,
};

// Lấy sản phẩm khác
export const getOther = createAsyncThunk(
  "other/getOther", // Tên action
  async (_, { rejectWithValue }) => {
    try {
      // Gửi yêu cầu GET để lấy danh sách sản phẩm khác
      const res = await axios.get(
        "https://doanweb-api.onrender.com/api/v1/otherProduct"
      );
      console.log(res.data.otherProduct); // In ra dữ liệu sản phẩm khác nhận được
      return res.data.otherProduct; // Trả về dữ liệu sản phẩm khác
    } catch (error) {
      // Trả về lỗi nếu có lỗi xảy ra
      return rejectWithValue(error.response.data);
    }
  }
);

// Cập nhật trạng thái đơn hàng
export const updateStatusOder = createAsyncThunk(
  "other/updateStatusOder", // Tên action
  async (payload, { rejectWithValue }) => {
    console.log(payload); // In ra payload (dữ liệu trạng thái đơn hàng)
    try {
      // Gửi yêu cầu PUT để cập nhật trạng thái đơn hàng
      const res = await axios.put(
        "https://doanweb-api.onrender.com/api/v1/otherProduct/update",
        payload // Truyền dữ liệu trạng thái đơn hàng
      );
      console.log(res.data.otherProduct); // In ra sản phẩm đã được cập nhật
      return res.data.otherProduct; // Trả về dữ liệu sản phẩm đã cập nhật
    } catch (error) {
      // Trả về lỗi nếu có lỗi xảy ra
      return rejectWithValue(error.response.data);
    }
  }
);

// Lấy sản phẩm khác theo ID
export const getOtherById = createAsyncThunk(
  "other/getOtherById", // Tên action
  async (payload, { rejectWithValue }) => {
    try {
      // Gửi yêu cầu GET để lấy sản phẩm khác theo ID
      const res = await axios.get(
        `https://doanweb-api.onrender.com/api/v1/otherProduct/${payload}` // payload là ID sản phẩm
      );
      return res.data.otherProduct; // Trả về dữ liệu sản phẩm khác
    } catch (error) {
      // Trả về lỗi nếu có lỗi xảy ra
      return rejectWithValue(error.response.data);
    }
  }
);

// Thêm sản phẩm khác
export const addOther = createAsyncThunk(
  "other/addOther", // Tên action
  async (payload, { rejectWithValue }) => {
    try {
      // Gửi yêu cầu POST để thêm sản phẩm khác
      const res = await axios.post(
        "https://doanweb-api.onrender.com/api/v1/otherProduct/add",
        payload, // Dữ liệu sản phẩm khác cần thêm
        {
          headers: {
            "Content-Type": "application/json", // Định dạng dữ liệu là JSON
          },
        }
      );
      // Xóa dữ liệu trong localStorage và chuyển hướng đến trang thành công
      localStorage.clear();
      window.location.href = "/othersuccess";
      return res.data.other; // Trả về sản phẩm đã thêm
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

const otherSlice = createSlice({
  name: "other",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addOther.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addOther.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(addOther.fulfilled, (state, action) => {
        state.isLoading = false;
        state.other.push(action.payload);
      })
      .addCase(getOther.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOther.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getOther.fulfilled, (state, action) => {
        state.isLoading = false;
        state.other = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getOtherById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOtherById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getOtherById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedOther = action.payload;
      })
      .addCase(updateStatusOder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateStatusOder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateStatusOder.fulfilled, (state, action) => {
        state.isLoading = false;
        const { status, id } = action.meta.arg;
        const index = state.other.findIndex((item) => item._id === id);
        if (index !== -1) {
          state.other[index].status = status;
        }
      });
  },
});

export default otherSlice.reducer;

export const selectOther = (state) => state.other.other;
export const selectOtherLoading = (state) => state.other.isLoading;
export const selectSelectedOther = (state) => state.other.selectedOther;
