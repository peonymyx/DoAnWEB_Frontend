import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Swal from "sweetalert2";
import axios from "../utils/axios";
import Cookies from "js-cookie";

const initialState = {
  comment: [],
  isLoading: false,
  error: null,
};

const token = Cookies.get("token");

// Thêm bình luận
export const addComment = createAsyncThunk(
  "comment/addComment", // Tên action
  async (payload, { rejectWithValue }) => {
    try {
      // Gửi yêu cầu POST để thêm bình luận mới với token trong headers
      const res = await axios.post(
        "https://doanweb-api.onrender.com/api/v1/comment/addComment",
        payload, // Dữ liệu gửi lên để thêm bình luận
        {
          headers: {
            "Content-Type": "application/json", // Xác định loại nội dung gửi lên là JSON
            token: `Bearer ${token}`, // Gửi token xác thực trong header
          },
        }
      );
      // Hiển thị thông báo thành công khi thêm bình luận thành công
      Swal.fire({
        icon: "success",
        text: "Thêm bình luận thành công", // Thông báo thành công
      });
      // Trả về bình luận đã được thêm từ phản hồi của API
      return res.data.comment;
    } catch (error) {
      // Hiển thị thông báo lỗi nếu có lỗi xảy ra
      Swal.fire({
        icon: "error",
        title: "Lỗi", // Tiêu đề thông báo lỗi
        text: "Vui lòng đăng nhập để bình luận", // Thông báo lỗi khi chưa đăng nhập
        confirmButtonText: ` <a href="/login">Đăng Nhập</a> `, // Link đăng nhập
      });
      // Trả về lỗi nếu có lỗi xảy ra
      return rejectWithValue(error.response.data);
    }
  }
);

// Lấy danh sách bình luận
export const getComment = createAsyncThunk(
  "comment/getComment", // Tên action
  async (payload, { rejectWithValue }) => {
    try {
      // Gửi yêu cầu GET để lấy danh sách bình luận từ API
      const res = await axios.get(
        "https://doanweb-api.onrender.com/api/v1/comment/getComment",
        {
          headers: {
            "Content-Type": "application/json", // Xác định loại nội dung gửi lên là JSON
            token: `Bearer ${token}`, // Gửi token xác thực trong header
          },
        }
      );
      // Trả về danh sách bình luận nhận được từ phản hồi của API
      return res.data.comment;
    } catch (error) {
      // Trả về lỗi nếu có lỗi xảy ra
      return rejectWithValue(error.response.data);
    }
  }
);

// Lấy bình luận theo ID sản phẩm
export const getCommentByProductId = createAsyncThunk(
  "comment/getCommentByProductId", // Tên action
  async (payload, { rejectWithValue }) => {
    try {
      // Gửi yêu cầu GET để lấy bình luận theo ID sản phẩm
      const res = await axios.get(
        `https://doanweb-api.onrender.com/api/v1/comment/getCommentByProductId/${payload}`,
        {
          headers: {
            "Content-Type": "application/json", // Xác định loại nội dung gửi lên là JSON
            token: `Bearer ${token}`, // Gửi token xác thực trong header
          },
        }
      );
      console.log(res.data.comment); // Hiển thị bình luận nhận được từ API
      // Trả về danh sách bình luận nhận được từ phản hồi của API
      return res.data.comment;
    } catch (error) {
      // Trả về lỗi nếu có lỗi xảy ra
      return rejectWithValue(error.response.data);
    }
  }
);

// Xóa bình luận của tác giả
export const deleteCommentByAuthor = createAsyncThunk(
  "comment/deleteCommentByAuthor", // Tên action
  async (payload, { rejectWithValue }) => {
    try {
      // Gửi yêu cầu DELETE để xóa bình luận theo ID của tác giả
      const res = await axios.delete(
        "https://doanweb-api.onrender.com/api/v1/comment/deleteCommentByAuthor/" +
          payload
      );
      // Hiển thị thông báo thành công khi xóa bình luận thành công
      Swal.fire({
        icon: "success",
        text: "Xóa bình luận thành công", // Thông báo thành công
      });
      // Trả về ID của bình luận đã bị xóa từ phản hồi của API
      return res.data.comment._id;
    } catch (error) {
      // Hiển thị thông báo lỗi nếu có lỗi xảy ra
      Swal.fire({
        icon: "error",
        title: "Lỗi", // Tiêu đề thông báo lỗi
      });
      // Trả về lỗi nếu có lỗi xảy ra
      return rejectWithValue(error.response.data);
    }
  }
);

const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {},
  extraReducers: {
    [addComment.pending]: (state) => {
      state.isLoading = true;
    },
    [addComment.fulfilled]: (state, action) => {
      state.isLoading = false;
      if (action.payload) {
        state.comment.push(action.payload);
      }
    },
    [addComment.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    [getComment.pending]: (state) => {
      state.isLoading = true;
    },
    [getComment.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.comment = action.payload;
    },
    [getComment.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    [getCommentByProductId.pending]: (state) => {
      state.isLoading = true;
    },
    [getCommentByProductId.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.comment = action.payload;
    },
    [getCommentByProductId.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    [deleteCommentByAuthor.pending]: (state) => {
      state.isLoading = true;
    },
    [deleteCommentByAuthor.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.comment = state.comment.filter(
        (comment) => comment._id !== action.payload
      );
    },
    [deleteCommentByAuthor.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export default commentSlice.reducer;
