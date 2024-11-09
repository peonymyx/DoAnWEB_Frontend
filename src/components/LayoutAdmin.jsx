import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Nav/Sidebar";
import { useSelector } from "react-redux";

// LayoutAdmin là một component layout cho các trang trong admin dashboard
const LayoutAdmin = () => {
  // Lấy thông tin người dùng hiện tại từ Redux store
  const auth = useSelector((state) => state.auth.currentUser);

  // Sử dụng hook useNavigate để điều hướng trang
  const navigate = useNavigate();

  // useEffect kiểm tra quyền người dùng khi component được mount
  useEffect(() => {
    // Kiểm tra nếu role người dùng không phải là 'admin' hoặc 'nhanvien'
    if (auth?.role !== "admin" && auth?.role !== "nhanvien") {
      // Nếu không phải admin hoặc nhân viên, điều hướng người dùng về trang chủ
      window.location.href = "/"; // Điều hướng về trang chủ
    }
  }, [auth, navigate]); // Hook này sẽ chạy mỗi khi auth hoặc navigate thay đổi

  // Nếu quyền người dùng không phải là 'admin' hoặc 'nhanvien', trả về null (không render gì cả)
  if (auth?.role !== "admin" && auth?.role !== "nhanvien") {
    return null;
  }

  // Nếu người dùng có quyền hợp lệ, trả về layout của trang admin
  return (
    <div className="wrapper flex min-h-screen bg-gray-100">
      {/* Sidebar Component - Thanh bên trái của layout */}
      <Sidebar />
      {/* Nội dung chính của layout */}
      <div className="flex-1 lg:ml-72 p-8 mt-12 overflow-x-auto">
        {/* Outlet - Placeholder cho các route con */}
        <Outlet />
      </div>
    </div>
  );
};

export default LayoutAdmin;
