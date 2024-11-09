import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "./api";
import Swal from "sweetalert2";
import axios from "axios";
import Cookies from "js-cookie";

const initialState = {
  storage: [],
  isLoading: false,
  error: null,
};

// Thực hiện gọi API để lấy thông tin kho
export const getStorage = createAsyncThunk(
  "storage/getStorage", // Tên action trong Redux
  async (payload, { rejectWithValue }) => {
    try {
      // Gửi yêu cầu GET đến API để lấy thông tin kho
      const res = await API.get("/api/v1/getStorage");
      console.log(res.data); // Hiển thị dữ liệu nhận được từ API
      return res.data.storage; // Trả về dữ liệu kho nhận được
    } catch (error) {
      // Nếu có lỗi xảy ra, trả về lỗi
      return rejectWithValue(error.response.data);
    }
  }
);

const token = Cookies.get("token"); // Lấy token từ cookie

// Xóa thông tin kho theo ID
export const deleteStorage = createAsyncThunk(
  "storage/deleteStorage", // Tên action trong Redux
  async (id, { rejectWithValue }) => {
    try {
      // Gửi yêu cầu DELETE đến API để xóa kho theo ID
      const res = await axios.delete(
        `https://doanweb-api.onrender.com/api/v1/deleteStorage/${id}`,
        {
          headers: {
            "Content-Type": "application/json", // Định dạng nội dung
            token: `Bearer ${token}`, // Thêm token vào header để xác thực
          },
        }
      );

      // Hiển thị thông báo thành công khi xóa thành công
      Swal.fire({
        icon: "success",
        title: "Delete storage successfully",
        showConfirmButton: false,
        timer: 1500,
      });
      return res.data.storage; // Trả về dữ liệu kho sau khi xóa
    } catch (error) {
      // Hiển thị thông báo lỗi nếu có lỗi xảy ra
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response.data.message,
      });
      return rejectWithValue(error.response.data); // Trả về lỗi nếu có
    }
  }
);

// Xóa thông tin kho theo product_id
export const deleteStorageByproduct_id = createAsyncThunk(
  "storage/deleteStorageByproduct_id", // Tên action trong Redux
  async (id, { rejectWithValue }) => {
    try {
      // Gửi yêu cầu DELETE đến API để xóa kho theo product_id
      const res = await API.delete(`/api/v1/deleteStorage/${id}`);
      console.log("xoa thanh cong"); // Hiển thị thông báo khi xóa thành công
      return res.data; // Trả về kết quả sau khi xóa
    } catch (error) {
      // Trả về lỗi nếu có
      return rejectWithValue(error.response.data);
    }
  }
);

// Cập nhật thông tin kho theo product_id
export const updateStorageByproduct_id = createAsyncThunk(
  "storage/updateStorageByproduct_id", // Tên action trong Redux
  async (data, { rejectWithValue }) => {
    console.log(data); // Hiển thị dữ liệu cần cập nhật
    try {
      // Gửi yêu cầu PUT để cập nhật thông tin kho
      const res = await axios.put(
        `https://doanweb-api.onrender.com/api/v1/updateStorage`,
        data,
        {
          headers: {
            "Content-Type": "application/json", // Định dạng nội dung
            token: `Bearer ${token}`, // Thêm token vào header để xác thực
          },
        }
      );
      // Hiển thị thông báo thành công khi cập nhật thành công
      Swal.fire({
        icon: "success",
        title: "Update storage successfully",
        showConfirmButton: false,
        timer: 1500,
      });
      return res.data.storage; // Trả về dữ liệu kho đã cập nhật
    } catch (error) {
      // Hiển thị thông báo lỗi nếu có lỗi xảy ra
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response.data.message,
      });
      return rejectWithValue(error.response.data); // Trả về lỗi nếu có
    }
  }
);

const storageSlice = createSlice({
  name: "storage",
  initialState,
  reducers: {},
  extraReducers: {
    [getStorage.pending]: (state) => {
      state.isLoading = true;
    },
    [getStorage.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.storage = action.payload;
    },
    [getStorage.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    [deleteStorage.pending]: (state) => {
      state.isLoading = true;
    },
    [deleteStorage.fulfilled]: (state, action) => {
      state.isLoading = false;
      if (action.payload) {
        state.storage = state.storage.filter(
          (item) => item._id !== action.payload._id
        );
      }
    },
    [deleteStorage.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    [deleteStorageByproduct_id.pending]: (state) => {
      state.isLoading = true;
    },
    [deleteStorageByproduct_id.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.storage = action.payload;
    },
    [deleteStorageByproduct_id.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    [updateStorageByproduct_id.pending]: (state) => {
      state.isLoading = true;
    },
    [updateStorageByproduct_id.fulfilled]: (state, action) => {
      state.isLoading = false;
      console.log(action);
      const { quantity_import, product_id } = action.meta.arg;
      for (let i = 0; i < state.storage.length; i++) {
        if (state.storage[i].product_id._id === product_id) {
          state.storage[i].quantity_import = quantity_import;
        }
      }
    },
    [updateStorageByproduct_id.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export default storageSlice.reducer;
