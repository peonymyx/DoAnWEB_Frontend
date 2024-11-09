import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
const ResetPassword = () => {
  // Lấy searchParams từ URL để sử dụng thông tin token
  const [searchParams] = useSearchParams();
  // Khai báo state để lưu trữ giá trị mật khẩu nhập vào
  const [password, setPassword] = useState("");
  // Khai báo hook điều hướng trang
  const navigate = useNavigate();
  // Lấy token từ URL (thường dùng trong các trường hợp reset mật khẩu hoặc xác thực)
  const token = searchParams.get("token");

  // Hàm xử lý khi người dùng gửi thông tin (thường là khi nhấn nút xác nhận đổi mật khẩu)
  const handleSubmit = async () => {
    // Đặt tiêu đề cho yêu cầu POST (yêu cầu phải có Content-Type là application/json)
    const headers = {
      "Content-Type": "application/json",
    };

    try {
      // Gửi yêu cầu POST tới API để đổi mật khẩu, truyền token và mật khẩu mới
      const res = await axios.post(
        "https://doanweb-api.onrender.com/api/v1/resetpassword", // Địa chỉ API đổi mật khẩu
        { token, password }, // Dữ liệu gửi đi bao gồm token và mật khẩu
        headers // Tiêu đề của yêu cầu
      );

      // Nếu thành công, hiển thị thông báo thành công
      console.log(res);
      Swal.fire({
        icon: "success", // Biểu tượng thành công
        title: "Đổi mật khẩu thành công", // Tiêu đề thông báo
        text: "Vui lòng đăng nhập để tiếp tục", // Nội dung thông báo
        showConfirmButton: false, // Ẩn nút xác nhận
        timer: 1500, // Hiển thị thông báo trong 1,5 giây
      });

      // Điều hướng người dùng đến trang đăng nhập
      navigate("/login");
    } catch (error) {
      // Nếu có lỗi, log lỗi ra console và hiển thị thông báo lỗi
      console.log(error);
      Swal.fire({
        icon: "error", // Biểu tượng lỗi
        title: "Lỗi!", // Tiêu đề thông báo lỗi
        text: "Đổi mật khẩu thất bại", // Nội dung thông báo lỗi
        footer: "<a href>Bạn đang gặp vấn đề?</a>", // Footer với đường dẫn hỗ trợ
      });
    }
  };

  return (
    <div className="flex items-center justify-center h-[480px]">
      <div
        className="py-2 px-4 border border-gray-200 rounded-full max-w-[400px] mx-auto mt-20 flex items-center gap-x-5"
        aria-label="form-send-password"
      >
        <div className="flex-1">
          <input
            type="password"
            className="w-full text-lg text-black bg-transparent outline-none placeholder:text-black"
            placeholder="Nhập mật khẩu mới..."
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <span
          onClick={handleSubmit}
          className="flex-shrink-0 rotate-45 cursor-pointer mb-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </span>
      </div>
    </div>
  );
};

export default ResetPassword;
