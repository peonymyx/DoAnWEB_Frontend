// redux/couponSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  coupons: [],
  discount: 0,
  isLoading: false,
  error: null,
};

// Tạo mã giảm giá (coupon)
export const createCoupon = createAsyncThunk(
  "coupon/create", // Tên action
  async (couponData, { rejectWithValue }) => {
    try {
      // Gửi yêu cầu POST để tạo mã giảm giá mới
      const response = await axios.post(
        "https://doanweb-api.onrender.com/api/v1/coupons",
        couponData
      );
      return response.data; // Trả về dữ liệu mã giảm giá đã tạo
    } catch (error) {
      // Trả về lỗi nếu có lỗi xảy ra
      return rejectWithValue(error.response.data);
    }
  }
);

// Lấy tất cả mã giảm giá
export const fetchCoupons = createAsyncThunk(
  "coupon/fetchAll", // Tên action
  async (_, { rejectWithValue }) => {
    try {
      // Gửi yêu cầu GET để lấy tất cả mã giảm giá
      const response = await axios.get(
        "https://doanweb-api.onrender.com/api/v1/coupons"
      );
      return response.data; // Trả về danh sách mã giảm giá
    } catch (error) {
      // Trả về lỗi nếu có lỗi xảy ra
      return rejectWithValue(error.response.data);
    }
  }
);

// Cập nhật mã giảm giá
export const updateCoupon = createAsyncThunk(
  "coupon/update", // Tên action
  async ({ id, couponData }, { rejectWithValue }) => {
    try {
      // Gửi yêu cầu PUT để cập nhật mã giảm giá theo ID
      const response = await axios.put(
        `https://doanweb-api.onrender.com/api/v1/coupons/${id}`,
        couponData
      );
      return response.data; // Trả về dữ liệu mã giảm giá đã cập nhật
    } catch (error) {
      console.log(error);
      // Trả về lỗi nếu có lỗi xảy ra
      return rejectWithValue(error.response.data);
    }
  }
);

// Xóa mã giảm giá
export const deleteCoupon = createAsyncThunk(
  "coupon/delete", // Tên action
  async (id, { rejectWithValue }) => {
    try {
      // Gửi yêu cầu DELETE để xóa mã giảm giá theo ID
      await axios.delete(
        `https://doanweb-api.onrender.com/api/v1/coupons/${id}`
      );
      return id; // Trả về ID của mã giảm giá đã xóa
    } catch (error) {
      // Trả về lỗi nếu có lỗi xảy ra
      return rejectWithValue(error.response.data);
    }
  }
);

// Áp dụng mã giảm giá
export const applyCoupon = createAsyncThunk(
  "coupon/apply", // Tên action
  async (code, { rejectWithValue }) => {
    try {
      // Gửi yêu cầu POST để áp dụng mã giảm giá
      const response = await axios.post(
        "https://doanweb-api.onrender.com/api/v1/apply",
        {
          code,
        }
      );
      return response.data.discount; // Trả về giá trị giảm giá
    } catch (error) {
      // Trả về lỗi nếu có lỗi xảy ra
      return rejectWithValue(error.response.data);
    }
  }
);

// Create slice
const couponSlice = createSlice({
  name: "coupons",
  initialState,
  reducers: {
    resetDiscount: (state) => {
      state.discount = 0;
    },
  },
  extraReducers: (builder) => {
    // Create coupon
    builder.addCase(createCoupon.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createCoupon.fulfilled, (state, action) => {
      state.isLoading = false;
      state.coupons.push(action.payload);
    });
    builder.addCase(createCoupon.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Fetch all coupons
    builder.addCase(fetchCoupons.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchCoupons.fulfilled, (state, action) => {
      state.isLoading = false;
      state.coupons = action.payload;
    });
    builder.addCase(fetchCoupons.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Update coupon
    builder.addCase(updateCoupon.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateCoupon.fulfilled, (state, action) => {
      state.isLoading = false;
      const index = state.coupons.findIndex(
        (coupon) => coupon._id === action.payload._id
      );
      if (index !== -1) {
        state.coupons[index] = action.payload;
      }
    });
    builder.addCase(updateCoupon.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Delete coupon
    builder.addCase(deleteCoupon.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(deleteCoupon.fulfilled, (state, action) => {
      state.isLoading = false;
      state.coupons = state.coupons.filter(
        (coupon) => coupon._id !== action.payload
      );
    });
    builder.addCase(deleteCoupon.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Apply coupon
    builder.addCase(applyCoupon.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(applyCoupon.fulfilled, (state, action) => {
      state.isLoading = false;
      state.discount = action.payload; // Update discount
    });
    builder.addCase(applyCoupon.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
  },
});

// Export actions and reducer
export const { resetDiscount } = couponSlice.actions;
export default couponSlice.reducer;
