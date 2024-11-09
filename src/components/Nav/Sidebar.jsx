import { useState } from "react"; // Dùng hook useState để quản lý trạng thái
import { Link } from "react-router-dom"; // Dùng Link để điều hướng trang trong React Router
import { useDispatch, useSelector } from "react-redux"; // Dùng hook từ Redux để lấy dữ liệu và dispatch action
import { logOut } from "../../redux/authSlice"; // Import action logOut từ slice của Redux
import {
  HomeIcon,
  ShoppingBagIcon,
  ChatBubbleOvalLeftIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  ChartBarIcon,
  TagIcon,
  CogIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/solid"; // Import các icon từ Heroicons

const Sidebar = () => {
  // Khai báo state isOpen để quản lý trạng thái mở/đóng của sidebar
  const [isOpen, setIsOpen] = useState(false);
  // Lấy thông tin người dùng từ Redux store (người dùng hiện tại)
  const auth = useSelector((state) => state.auth.currentUser);
  // Khai báo dispatch để gửi các action tới Redux store
  const dispatch = useDispatch();

  // Hàm để toggle trạng thái mở/đóng của sidebar
  const toggleSidebar = () => {
    setIsOpen(!isOpen); // Đảo ngược trạng thái isOpen
  };

  // Hàm để xử lý đăng xuất
  const handleLogOut = () => {
    dispatch(logOut()); // Gửi action logOut để cập nhật trạng thái đăng nhập trong Redux
    window.location.href = "/"; // Chuyển hướng về trang chủ sau khi đăng xuất
  };

  // Component NavItem để tạo từng mục trong menu sidebar
  // eslint-disable-next-line react/prop-types
  const NavItem = ({ to, icon: Icon, text }) => (
    <li>
      <Link
        to={to} // Link điều hướng tới trang
        className="flex items-center p-2 text-white hover:bg-blue-800 rounded-lg"
        onClick={() => setIsOpen(false)} // Đóng sidebar khi người dùng chọn mục
      >
        <Icon className="h-6 w-6" /> {/* Hiển thị icon */}
        <span className="ml-3">{text}</span> {/* Hiển thị text mô tả mục */}
      </Link>
    </li>
  );

  return (
    <div>
      {/* Nút điều khiển mở/đóng sidebar trên mobile */}
      <div className="lg:hidden fixed top-4 left-4 z-40">
        {/* Nếu sidebar đang mở thì hiển thị nút đóng */}
        {isOpen ? (
          <button
            onClick={toggleSidebar} // Khi nhấn vào nút này thì sẽ đóng sidebar
            className="text-white hover:bg-blue-800 rounded-lg p-2 ml-[190px] mt-[2px]"
            aria-label="Toggle Sidebar" // Mô tả cho công cụ hỗ trợ
          >
            <XMarkIcon className="h-6 w-6" /> {/* Hiển thị icon đóng */}
          </button>
        ) : (
          // Nếu sidebar đóng thì hiển thị nút mở
          <button
            onClick={toggleSidebar} // Khi nhấn vào nút này thì sẽ mở sidebar
            className="text-white bg-gray-300 border-gray-500 border hover:bg-blue-800 rounded-lg p-2 ml-3"
            aria-label="Toggle Sidebar" // Mô tả cho công cụ hỗ trợ
          >
            <Bars3Icon className="h-6 w-6" /> {/* Hiển thị icon mở */}
          </button>
        )}
      </div>

      {/* Sidebar */}
      <aside
        className={`bg-blue-900 w-72 fixed top-0 bottom-0 z-30 transition-transform duration-300 ease-in-out overflow-y-auto 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`} // Sử dụng class của Tailwind CSS để điều chỉnh vị trí sidebar
      >
        <div className="flex flex-col h-full justify-between">
          {/* Menu Items */}
          <div className="px-3 py-4">
            <ul className="space-y-6 text-xl mt-4">
              {/* Các mục trong sidebar, mỗi mục là một NavItem */}
              <NavItem to="/dashBoard" icon={ChartBarIcon} text="Thống Kê" />
              <NavItem to="/category" icon={TagIcon} text="Danh Mục Sản Phẩm" />
              <NavItem
                to="/ProductManagement"
                icon={CogIcon}
                text="Quản Lý Sản Phẩm"
              />
              <NavItem
                to="/otherManagement"
                icon={ShoppingBagIcon}
                text="Quản Lý Đơn Hàng"
              />
              <NavItem
                to="/mess"
                icon={ChatBubbleOvalLeftIcon}
                text="Tin Nhắn"
              />
              <NavItem to="/CouponManage" icon={Cog6ToothIcon} text="Coupon" />
              <NavItem
                to="/commentManagement"
                icon={HomeIcon}
                text="Bình Luận"
              />
              {/* Nếu người dùng có vai trò admin thì hiển thị mục quản lý tài khoản */}
              {auth.role === "admin" && (
                <NavItem
                  to="/AccountManagement"
                  icon={UserIcon}
                  text="Quản Lý Tài Khoản"
                />
              )}
            </ul>
          </div>

          {/* Footer với các nút Trang chủ và Đăng xuất */}
          <div className="p-4">
            <div className="flex flex-col items-center space-y-4">
              {/* Nút Trang chủ */}
              <Link
                to="/"
                className="flex items-center text-white bg-blue-700 hover:bg-blue-500 p-2 rounded-lg w-full justify-center"
                onClick={() => setIsOpen(false)} // Đóng sidebar khi nhấn vào Trang chủ
              >
                <span className="font-semibold">Trang chủ</span>
              </Link>

              {/* Nút Đăng xuất */}
              <Link
                onClick={handleLogOut} // Xử lý đăng xuất khi nhấn nút này
                className="flex items-center text-white bg-red-500 hover:bg-red-700 p-2 rounded-lg w-full justify-center"
              >
                <span className="font-semibold">Đăng xuất</span>
              </Link>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay để đóng sidebar khi người dùng click ra ngoài (chỉ trên mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 opacity-50 lg:hidden"
          onClick={toggleSidebar} // Khi click vào overlay thì đóng sidebar
        ></div>
      )}
    </div>
  );
};

export default Sidebar;
