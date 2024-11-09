import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "./api";
import Swal from "sweetalert2";
import axios from "../utils/axios";

const initialState = {
  products: [],
  isLoading: false,
  error: null,
};

// Thêm bình luận
export const addComment = createAsyncThunk(
  "comment/addComment", // Tên action
  async (commentData, { rejectWithValue }) => {
    try {
      // Gửi yêu cầu POST để thêm bình luận
      const res = await axios.post(
        "https://doanweb-api.onrender.com/api/v1/comment",
        commentData // Dữ liệu bình luận
      );
      return res.data; // Trả về dữ liệu bình luận đã thêm
    } catch (error) {
      // Trả về lỗi nếu có lỗi xảy ra
      return rejectWithValue(error.response.data);
    }
  }
);

// Lấy thông tin sản phẩm
export const getProduct = createAsyncThunk(
  "product/getProduct", // Tên action
  async (arg, { rejectWithValue }) => {
    try {
      // Gửi yêu cầu GET để lấy thông tin sản phẩm
      const res = await API.get("/api/v1/getProduct");
      console.log("Dữ liệu từ API:", res.data); // In ra dữ liệu sản phẩm từ API
      return res.data.Product; // Trả về dữ liệu sản phẩm
    } catch (error) {
      // Trả về lỗi nếu có lỗi xảy ra
      return rejectWithValue(error.response.data);
    }
  }
);

// Thêm sản phẩm
export const addProduct = createAsyncThunk(
  "product/addProduct", // Tên action
  async (payload, { rejectWithValue }) => {
    try {
      // Gửi yêu cầu POST để thêm sản phẩm
      const res = await API.post("/api/v1/addProduct", payload);
      console.log(res.data); // In ra dữ liệu sản phẩm đã thêm
      Swal.fire({
        icon: "success",
        title: "Add product successfully", // Thông báo thành công
        showConfirmButton: false,
        timer: 1500,
      });
      window.location.href = "/ProductManagement"; // Chuyển hướng đến trang quản lý sản phẩm
      return res.data; // Trả về dữ liệu sản phẩm đã thêm
    } catch (error) {
      // Hiển thị thông báo lỗi nếu có lỗi xảy ra
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response.data.message, // Lỗi từ API
      });
      return rejectWithValue(error.response.data); // Trả về lỗi nếu có lỗi xảy ra
    }
  }
);

// Lấy thông tin sản phẩm theo ID
export const getProductById = createAsyncThunk(
  "product/getProductById", // Tên action
  async (payload, { rejectWithValue }) => {
    try {
      // Gửi yêu cầu GET để lấy thông tin sản phẩm theo ID
      const res = await API.get(`/api/v1/getProductById/${payload}`);
      console.log(res.data); // In ra dữ liệu sản phẩm theo ID
      return res.data.Product; // Trả về dữ liệu sản phẩm
    } catch (error) {
      // Trả về lỗi nếu có lỗi xảy ra
      return rejectWithValue(error.response.data);
    }
  }
);

// Cập nhật thông tin sản phẩm
export const updateProduct = createAsyncThunk(
  "product/updateProduct", // Tên action
  async (data, { rejectWithValue }) => {
    try {
      // Gửi yêu cầu PUT để cập nhật thông tin sản phẩm
      const res = await API.put(`/api/v1/updateProduct/${data.id}`, data);
      Swal.fire({
        icon: "success",
        title: "Update product successfully", // Thông báo cập nhật thành công
        showConfirmButton: false,
        timer: 1500,
      });
      window.location.href = "/ProductManagement"; // Chuyển hướng đến trang quản lý sản phẩm
      return res.data.product; // Trả về dữ liệu sản phẩm đã cập nhật
    } catch (error) {
      // Hiển thị thông báo lỗi nếu có lỗi xảy ra
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response.data.message, // Lỗi từ API
      });
      return rejectWithValue(error.response.data); // Trả về lỗi nếu có lỗi xảy ra
    }
  }
);

// Xóa sản phẩm
export const deleteProduct = createAsyncThunk(
  "product/deleteProduct", // Tên action
  async (payload, { rejectWithValue }) => {
    try {
      // Gửi yêu cầu DELETE để xóa sản phẩm
      const res = await API.delete(`/api/v1/deleteProduct/${payload}`);
      console.log(res.data); // In ra dữ liệu kết quả sau khi xóa sản phẩm
      Swal.fire({
        icon: "success",
        title: "Delete product successfully", // Thông báo xóa thành công
        showConfirmButton: false,
        timer: 1500,
      });
      return res.data; // Trả về dữ liệu sau khi xóa sản phẩm
    } catch (error) {
      // Hiển thị thông báo lỗi nếu có lỗi xảy ra
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response.data.message, // Lỗi từ API
      });
      return rejectWithValue(error.response.data); // Trả về lỗi nếu có lỗi xảy ra
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProduct.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getProduct.fulfilled, (state, action) => {
      state.isLoading = false;
      state.products = action.payload;
    });
    builder.addCase(getProduct.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
    builder.addCase(addProduct.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(addProduct.fulfilled, (state, action) => {
      state.isLoading = false;
      state.products.push(action.payload.product);
    });
    builder.addCase(addProduct.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
    builder.addCase(deleteProduct.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deleteProduct.fulfilled, (state, action) => {
      // state.isLoading = false;
      // // console.log(current(state));

      // const index = state.products.findIndex(
      //   (product) => product._id === action.payload.product._id
      // );
      // console.log(index);
      // state.products.splice(index, 1);
      state.isLoading = false;

      console.log("Action payload:", action.payload); // Kiểm tra giá trị của action.payload

      if (!action.payload || !action.payload.product) {
        console.error("Invalid payload:", action.payload);
        return;
      }

      const index = state.products.findIndex(
        (product) => product._id === action.payload.product._id
      );
      console.log("Index to delete:", index);

      if (index !== -1) {
        state.products.splice(index, 1); // Xóa sản phẩm chỉ khi index hợp lệ
      }
    });
    builder.addCase(deleteProduct.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
    builder.addCase(getProductById.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getProductById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.products = action.payload;
    });
    builder.addCase(getProductById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
    builder.addCase(updateProduct.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateProduct.fulfilled, (state, action) => {
      state.isLoading = false;
      console.log(action);
      const { id, description, dosage, image, maxAge, minAge, name, origin } =
        action.meta.arg;
      for (let i = 0; i < state.product.length; i++) {
        if (state.products[i]._id === id) {
          state.products[i].description = description;
          state.products[i].dosage = dosage;
          state.products[i].image = image;
          state.products[i].maxAge = maxAge;
          state.products[i].minAge = minAge;
          state.products[i].name = name;
          state.products[i].origin = origin;
        }
      }
    });
    builder.addCase(updateProduct.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
  },
});

export const {
  addProductStart,
  addProductSuccess,
  addProductFailure,
  deleteProductStart,
  deleteProductSuccess,
  deleteProductFailure,
  updateProductStart,
  UpdateProductSuccess,
  updateProductFailure,
} = productSlice.actions;

export default productSlice.reducer;
