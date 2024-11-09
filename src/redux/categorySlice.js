import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "./api";
import Swal from "sweetalert2";
import axios from "axios";
import Cookies from "js-cookie";

const initialState = {
  category: [],
  isLoading: false,
  error: null,
};

// Lấy token từ cookies
const token = Cookies.get("token");

// Lấy danh sách các danh mục từ API
export const getCategory = createAsyncThunk(
  "category/getCategory", // Tên action
  async (payload, { rejectWithValue }) => {
    try {
      // Gửi yêu cầu GET đến API để lấy danh sách danh mục
      const res = await API.get("/api/v1/category");
      console.log(res.data.category); // Hiển thị danh mục nhận được từ API
      // Trả về danh mục nhận được từ phản hồi của API
      return res.data.category;
    } catch (error) {
      // Nếu có lỗi, trả về lỗi bằng cách sử dụng rejectWithValue
      return rejectWithValue(error.response.data);
    }
  }
);

// Thêm một danh mục mới
export const addCategory = createAsyncThunk(
  "category/addCategory", // Tên action
  async (payload, { rejectWithValue }) => {
    try {
      // Gửi yêu cầu POST đến API để thêm danh mục mới với token trong headers
      const res = await axios.post(
        "https://doanweb-api.onrender.com/api/v1/category/add",
        payload, // Dữ liệu gửi lên để thêm danh mục
        {
          headers: {
            "Content-Type": "application/json", // Xác định loại nội dung gửi lên là JSON
            token: `Bearer ${token}`, // Gửi token xác thực trong header
          },
        }
      );
      // Hiển thị thông báo thành công khi thêm danh mục thành công
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Add category successfully", // Thông báo thành công
      });
      // Chuyển hướng đến trang danh mục sau khi thêm thành công
      window.location.href = "/category";
      // Trả về danh mục mới được thêm từ phản hồi của API
      return res.data.category;
    } catch (error) {
      // Hiển thị thông báo lỗi nếu có lỗi xảy ra
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response.data.message, // Thông báo lỗi từ API
      });
      // Trả về lỗi nếu có lỗi xảy ra
      return rejectWithValue(error.response.data);
    }
  }
);

// Cập nhật một danh mục
export const updateCategory = createAsyncThunk(
  "category/updateCategory", // Tên action
  async ({ data }, { rejectWithValue }) => {
    try {
      // Gửi yêu cầu PUT đến API để cập nhật danh mục với token trong headers
      const res = await axios.put(
        `https://doanweb-api.onrender.com/api/v1/category/update`,
        data, // Dữ liệu gửi lên để cập nhật danh mục
        {
          headers: {
            "Content-Type": "application/json", // Xác định loại nội dung gửi lên là JSON
            token: `Bearer ${token}`, // Gửi token xác thực trong header
          },
        }
      );
      // Hiển thị thông báo thành công khi cập nhật danh mục thành công
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Update category successfully", // Thông báo thành công
      });
      // Trả về danh mục đã được cập nhật từ phản hồi của API
      return res.data.category;
    } catch (error) {
      // Hiển thị thông báo lỗi nếu có lỗi xảy ra
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response.data.message, // Thông báo lỗi từ API
      });
      // Trả về lỗi nếu có lỗi xảy ra
      return rejectWithValue(error.response.data);
    }
  }
);

// Xóa một danh mục theo ID
export const deleteCategory = createAsyncThunk(
  "category/deleteCategory", // Tên action
  async (id, { rejectWithValue }) => {
    try {
      // Gửi yêu cầu DELETE đến API để xóa danh mục theo ID với token trong headers
      const res = await axios.delete(
        `https://doanweb-api.onrender.com/api/v1/category/delete/${id}`,
        {
          headers: {
            "Content-Type": "application/json", // Xác định loại nội dung gửi lên là JSON
            token: `Bearer ${token}`, // Gửi token xác thực trong header
          },
        }
      );
      // Hiển thị thông báo thành công khi xóa danh mục thành công
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Delete category successfully", // Thông báo thành công
      });
      // Trả về danh mục đã được xóa từ phản hồi của API
      return res.data.category;
    } catch (error) {
      // Hiển thị thông báo lỗi nếu có lỗi xảy ra
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response.data.message, // Thông báo lỗi từ API
      });
      // Trả về lỗi nếu có lỗi xảy ra
      return rejectWithValue(error.response.data);
    }
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState,
  extraReducers: {
    [getCategory.pending]: (state) => {
      state.isLoading = true;
    },
    [getCategory.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.category = action.payload;
    },
    [getCategory.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    [addCategory.pending]: (state) => {
      state.isLoading = true;
    },
    [addCategory.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.category.push(action.payload);
    },
    [addCategory.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    [updateCategory.pending]: (state) => {
      state.isLoading = true;
    },
    [updateCategory.fulfilled]: (state, action) => {
      state.isLoading = false;
      const { id, name, slug } = action.meta.arg.data;
      const index = state.category.findIndex((category) => category._id === id);
      state.category[index].name = name;
      state.category[index].slug = slug;
    },
    [updateCategory.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    [deleteCategory.pending]: (state) => {
      state.isLoading = true;
    },
    [deleteCategory.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.category = state.category.filter(
        (category) => category._id !== action.payload._id
      );
    },
    [deleteCategory.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export default categorySlice.reducer;
