// Nhập axios để thực hiện các yêu cầu HTTP
import axios from "axios";
// Tạo một instance của axios với base URL là "https://doanweb-api.onrender.com"
const API = axios.create({ baseURL: "https://doanweb-api.onrender.com" });

// Nhập Cookies từ thư viện js-cookie để xử lý cookie trong trình duyệt
import Cookies from "js-cookie";

// Lấy token từ cookie nếu có
const token = Cookies.get("token");

// Cài đặt interceptor để thêm token vào header của mỗi yêu cầu
API.interceptors.request.use((req) => {
  // Kiểm tra xem token có tồn tại không
  if (token) {
    // Thêm token vào header yêu cầu với định dạng Bearer token
    req.headers.token = `Bearer ${token}`;
    // Đặt kiểu nội dung của yêu cầu là 'multipart/form-data' (thường dùng cho các yêu cầu upload tệp)
    req.headers["Content-Type"] = "multipart/form-data";
  }
  // Trả lại yêu cầu đã được chỉnh sửa
  return req;
});

// Xuất API để sử dụng ở các nơi khác trong ứng dụng
export default API;
