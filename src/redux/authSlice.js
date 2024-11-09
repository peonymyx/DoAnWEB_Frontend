import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import axios from "axios";
// Khởi tạo trạng thái ban đầu cho slice
const initialState = {
  // Lấy thông tin người dùng từ sessionStorage nếu có, nếu không có thì gán giá trị là null
  currentUser: JSON.parse(sessionStorage.getItem("user")) || null,
  // Trạng thái tải dữ liệu (loading) ban đầu là false
  isLoading: false,
  // Trạng thái lỗi ban đầu là null
  error: null,
};

// Định nghĩa một action async để đăng nhập người dùng
export const login = createAsyncThunk(
  "user/login", // Tên action
  async (payload, { rejectWithValue }) => {
    // payload là thông tin đăng nhập, rejectWithValue giúp trả về lỗi nếu có
    try {
      // Gửi yêu cầu POST đến API để đăng nhập
      const res = await axios.post(
        "https://doanweb-api.onrender.com/api/v1/signin", // URL API đăng nhập
        payload, // Dữ liệu gửi đi (thông tin đăng nhập)
        {
          headers: {
            "Content-Type": "application/json", // Kiểu dữ liệu gửi đi là JSON
          },
        }
      );
      return res.data; // Trả về dữ liệu nhận được từ API
    } catch (error) {
      // Nếu có lỗi, trả về thông báo lỗi
      return rejectWithValue(error.response.data);
    }
  }
);

// Tạo slice quản lý trạng thái người dùng
const authSlice = createSlice({
  name: "user", // Tên slice là 'user'
  initialState, // Trạng thái ban đầu của slice
  reducers: {
    // Các reducer để thay đổi trạng thái
    // Bắt đầu quá trình đăng ký
    registerStart: (state) => {
      state.isLoading = true;
    },
    // Đăng ký thành công
    registerSuccess: (state, action) => {
      state.isLoading = false; // Tắt trạng thái loading
      state.currentUser = action.payload; // Cập nhật thông tin người dùng
    },
    // Đăng ký thất bại
    registerFailure: (state, action) => {
      state.isLoading = false; // Tắt trạng thái loading
      state.error = action.payload; // Lưu thông báo lỗi
    },
    // Đăng xuất người dùng
    logOut: (state) => {
      state.currentUser = null; // Đặt currentUser thành null
      Cookies.remove("token"); // Xóa token trong cookie
      sessionStorage.removeItem("user"); // Xóa thông tin người dùng trong sessionStorage
    },
  },
  extraReducers: {
    // Các reducer xử lý các action async
    // Khi đang thực hiện login (pending)
    [login.pending]: (state) => {
      state.isLoading = true; // Đặt trạng thái loading là true
    },
    // Khi login thành công (fulfilled)
    [login.fulfilled]: (state, action) => {
      state.isLoading = false; // Tắt trạng thái loading
      state.currentUser = action.payload.others; // Cập nhật thông tin người dùng
      console.log("User data:", action.payload.others); // In ra thông tin người dùng
      Cookies.set("token", action.payload.token); // Lưu token vào cookie
      sessionStorage.setItem("user", JSON.stringify(action.payload.others)); // Lưu thông tin người dùng vào sessionStorage
      // Kiểm tra vai trò của người dùng và điều hướng tới trang tương ứng
      if (
        action.payload.others.role === "admin" ||
        action.payload.others.role === "nhanvien"
      ) {
        window.location.href = "/dashBoard"; // Điều hướng tới trang quản trị
      } else {
        window.location.href = "/"; // Điều hướng tới trang chủ
      }
    },
    // Khi login thất bại (rejected)
    [login.rejected]: (state, action) => {
      state.isLoading = false; // Tắt trạng thái loading
      const errorMessage = action.payload?.message || "Có lỗi xảy ra"; // Lưu thông báo lỗi nếu có
      alert(errorMessage); // Hiển thị thông báo lỗi cho người dùng
      state.error = errorMessage; // Lưu lỗi vào state
    },
  },
});

export const {
  registerStart,
  registerSuccess,
  registerFailure,
  loginStart,
  loginSuccess,
  loginFailure,
  logOut,
} = authSlice.actions;

export default authSlice.reducer;
