import axios from "axios";
import Cookies from "js-cookie"; // Import đúng cách từ js-cookie

// Thêm interceptor cho tất cả các request
axios.interceptors.request.use(
  (config) => {
    // Lấy token từ Cookies
    const token = Cookies.get("token");

    // Nếu có token, thêm token vào header Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config; // Trả về config để request tiếp tục
  },
  (error) => {
    // Xử lý lỗi trước khi request được gửi đi
    return Promise.reject(error);
  }
);

// Thêm interceptor để xử lý response
axios.interceptors.response.use(
  (response) => {
    // Nếu response thành công, trả về dữ liệu như bình thường
    return response;
  },
  (error) => {
    // Kiểm tra nếu response trả về lỗi do xác thực
    if (error.response.status === 401) {
      // 401: Unauthorized - điều hướng người dùng tới trang đăng nhập
      window.location.href = "/login";
    }

    // Xử lý các lỗi khác
    return Promise.reject(error);
  }
);

export default axios;
