import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "./api";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

const initialState = {
  users: [],
  isLoading: false,
  error: null,
};

// Lấy token từ cookie để xác thực người dùng
const token = Cookies.get("token");

// Thực hiện gọi API để lấy danh sách người dùng
export const getUsers = createAsyncThunk(
  "user/getUsers", // Tên action trong Redux
  async (payload, { rejectWithValue }) => {
    try {
      // Gửi yêu cầu GET đến API để lấy danh sách người dùng, thêm token vào header để xác thực
      const res = await axios.get(
        "https://doanweb-api.onrender.com/api/v1/getUsers",
        {
          headers: {
            token: `Bearer ${token}`, // Thêm token vào header
          },
        }
      );
      return res.data.users; // Trả về danh sách người dùng nhận được từ API
    } catch (error) {
      // Nếu có lỗi, trả về lỗi
      return rejectWithValue(error.response.data);
    }
  }
);

// Cập nhật vai trò người dùng
export const updateRoleUser = createAsyncThunk(
  "user/updateRoleUser", // Tên action trong Redux
  async (payload, { rejectWithValue }) => {
    try {
      // Gửi yêu cầu PUT đến API để cập nhật vai trò người dùng, thêm token vào header
      const res = await axios.put(
        "https://doanweb-api.onrender.com/api/v1/users/updateRole",
        payload,
        {
          headers: {
            token: `Bearer ${token}`, // Thêm token vào header
          },
        }
      );
      return res.data; // Trả về kết quả cập nhật
    } catch (error) {
      // Nếu có lỗi, trả về lỗi
      return rejectWithValue(error.response.data);
    }
  }
);

// Cập nhật thông tin người dùng
export const updateUser = createAsyncThunk(
  "user/updateUser", // Tên action trong Redux
  async ({ id, data1 }, { rejectWithValue }) => {
    try {
      // Gửi yêu cầu PUT để cập nhật thông tin người dùng với dữ liệu multipart/form-data và thêm token vào header
      const response = await axios.put(
        `https://doanweb-api.onrender.com/api/v1/updateUser/${id}`,
        data1,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Định dạng dữ liệu
            token: `Bearer ${token}`, // Thêm token vào header
          },
        }
      );
      // Hiển thị thông báo thành công
      Swal.fire({
        title: "Success!",
        text: "Update user successfully!", // Thông báo thành công
        icon: "success",
        confirmButtonText: "OK",
      });
      return response.data.user; // Trả về thông tin người dùng đã cập nhật
    } catch (error) {
      // Nếu có lỗi xảy ra, trả về lỗi
      return rejectWithValue(error.response.data);
    }
  }
);

// Lấy thông tin người dùng theo ID
export const getUserById = createAsyncThunk(
  "user/getUserById", // Tên action trong Redux
  async (id, { rejectWithValue }) => {
    try {
      // Gửi yêu cầu GET đến API để lấy thông tin người dùng theo ID
      const response = await API.get(`/api/v1/getUserById/${id}`);
      return response.data.user; // Trả về thông tin người dùng
    } catch (error) {
      // Nếu có lỗi xảy ra, trả về lỗi
      return rejectWithValue(error.response.data);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = state.users.map((user) =>
          user._id === action.payload._id ? action.payload : user
        );
        sessionStorage.setItem("user", JSON.stringify(action.payload));
        window.location.reload();
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getUserById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = state.users.map((user) =>
          user._id === action.payload._id ? action.payload : user
        );
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateRoleUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateRoleUser.fulfilled, (state, action) => {
        state.isLoading = false;
        const { role, id } = action.meta.arg;
        state.users = state.users.map((user) =>
          user._id === id ? { ...user, role } : user
        );
      })
      .addCase(updateRoleUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
