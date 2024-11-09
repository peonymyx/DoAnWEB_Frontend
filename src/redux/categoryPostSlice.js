import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Swal from "sweetalert2";
import axios from "axios";

const initialState = {
  categoryPost: [],
  isLoading: false,
  error: null,
};

// Lấy danh mục bài viết (categoryPost) từ API
export const getCategoryPost = createAsyncThunk(
  "categoryPost/getCategoryPost", // Tên action
  async (payload, { rejectWithValue }) => {
    try {
      // Gửi yêu cầu GET đến API để lấy danh mục bài viết
      const res = await axios.get(
        "https://doanweb-api.onrender.com/api/v1/category-post"
      );
      // Trả về dữ liệu categoryPost nhận được từ phản hồi của API
      return res.data.categoryPost;
    } catch (error) {
      // Nếu có lỗi, trả về lỗi bằng cách sử dụng rejectWithValue
      return rejectWithValue(error.response.data);
    }
  }
);

// Thêm một danh mục bài viết (categoryPost) mới
export const addCategoryPost = createAsyncThunk(
  "categoryPost/addCategoryPost", // Tên action
  async (payload, { rejectWithValue }) => {
    try {
      // Gửi yêu cầu POST đến API để thêm danh mục bài viết mới
      const res = await axios.post(
        "https://doanweb-api.onrender.com/api/v1/category-post/add",
        payload
      );
      // Hiển thị thông báo thành công khi thêm danh mục bài viết thành công
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Add category successfully", // Thông báo thành công
      });
      // Trả về dữ liệu categoryPost mới được thêm từ phản hồi của API
      return res.data.categoryPost;
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

// Xóa một danh mục bài viết (categoryPost)
export const deleteCategoryPost = createAsyncThunk(
  "categoryPost/deleteCategoryPost", // Tên action
  async (payload, { rejectWithValue }) => {
    try {
      // Gửi yêu cầu DELETE đến API để xóa danh mục bài viết theo ID
      const res = await axios.delete(
        `https://doanweb-api.onrender.com/api/v1/category-post/delete/${payload}`
      );
      // Hiển thị thông báo thành công khi xóa danh mục bài viết thành công
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Delete category successfully", // Thông báo thành công
      });
      // Trả về dữ liệu categoryPost sau khi xóa từ phản hồi của API
      return res.data.categoryPost;
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

// Cập nhật một danh mục bài viết (categoryPost)
export const updateCategoryPost = createAsyncThunk(
  "categoryPost/updateCategoryPost", // Tên action
  async ({ data }, { rejectWithValue }) => {
    try {
      // Gửi yêu cầu PUT đến API để cập nhật danh mục bài viết
      const res = await axios.put(
        `https://doanweb-api.onrender.com/api/v1/category-post/update`,
        data
      );
      // Hiển thị thông báo thành công khi cập nhật danh mục bài viết thành công
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Update category successfully", // Thông báo thành công
      });
      // Trả về dữ liệu categoryPost sau khi cập nhật từ phản hồi của API
      return res.data.categoryPost;
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

const categoryPostSlice = createSlice({
  name: "categoryPost",
  initialState,
  reducers: {},
  extraReducers: {
    [getCategoryPost.pending]: (state) => {
      state.isLoading = true;
    },
    [getCategoryPost.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.categoryPost = action.payload;
    },
    [getCategoryPost.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    [addCategoryPost.pending]: (state) => {
      state.isLoading = true;
    },
    [addCategoryPost.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.categoryPost.push(action.payload);
    },
    [addCategoryPost.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    [deleteCategoryPost.pending]: (state) => {
      state.isLoading = true;
    },
    [deleteCategoryPost.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.categoryPost = state.categoryPost.filter(
        (item) => item._id !== action.payload._id
      );
    },
    [deleteCategoryPost.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    [updateCategoryPost.pending]: (state) => {
      state.isLoading = true;
    },
    [updateCategoryPost.fulfilled]: (state, action) => {
      state.isLoading = false;
      console.log(action);
      const { id, name, slug } = action.meta.arg.data;
      const index = state.categoryPost.findIndex(
        (categoryPost) => categoryPost._id === id
      );
      state.categoryPost[index].name = name;
      state.categoryPost[index].slug = slug;
    },
    [updateCategoryPost.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export default categoryPostSlice.reducer;
