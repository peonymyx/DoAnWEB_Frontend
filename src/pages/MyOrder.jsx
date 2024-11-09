import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const MyOrder = () => {
  const [myOrder, setMyOrder] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const navigate = useNavigate();

  const auth = useSelector((state) => state.auth.currentUser);

  // useEffect này được dùng để lấy danh sách đơn hàng từ server khi người dùng đã đăng nhập (có `auth`)
  // Nếu người dùng đã đăng nhập, gửi yêu cầu lấy đơn hàng từ API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Gửi yêu cầu GET đến API để lấy danh sách đơn hàng cho người dùng
        const response = await axios.get(
          `https://doanweb-api.onrender.com/api/v1/otherProduct?userId=${auth?._id}`
        );
        // Cập nhật state `myOrder` với dữ liệu đơn hàng nhận được từ API
        setMyOrder(response.data.otherProduct);
      } catch (error) {
        // Nếu có lỗi xảy ra khi lấy dữ liệu, log lỗi ra console
        console.error("Error fetching orders:", error);
      }
    };

    // Nếu người dùng đã đăng nhập (có `auth`), gọi hàm `fetchOrders` để lấy dữ liệu
    if (auth) {
      fetchOrders();
    }
  }, [auth]); // Chạy lại mỗi khi `auth` thay đổi

  // useEffect này kiểm tra nếu người dùng chưa đăng nhập (không có `auth`)
  // Nếu chưa đăng nhập, chuyển hướng người dùng tới trang đăng nhập (`/login`)
  useEffect(() => {
    if (!auth) {
      navigate("/login"); // Điều hướng người dùng tới trang đăng nhập
    }
  }, [auth, navigate]); // Chạy lại mỗi khi `auth` hoặc `navigate` thay đổi

  // Hàm tính tổng giá trị đơn hàng trong giỏ hàng
  // `cart` là mảng các sản phẩm trong giỏ hàng
  const calculateTotal = (cart) => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0); // Tính tổng giá trị của giỏ hàng
  };

  // Hàm định dạng ngày tháng từ chuỗi ngày (string)
  // `dateString` là chuỗi ngày cần định dạng
  const formatDate = (dateString) => {
    // Chuyển đổi chuỗi ngày thành đối tượng `Date` và định dạng lại theo định dạng Việt Nam
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <label
          htmlFor="datePicker"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Chọn ngày:
        </label>
        <input
          type="date"
          id="datePicker"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {myOrder.length === 0 ? (
        <div className="text-center text-gray-500">Không có đơn hàng</div>
      ) : (
        myOrder.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-lg overflow-hidden mb-6 shadow-md"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <div>
                <img
                  src="https://designercomvn.s3.ap-southeast-1.amazonaws.com/wp-content/uploads/2018/12/06090103/logo-shop-qu%E1%BA%A7n-%C3%A1o-8.png"
                  alt="Logo"
                  className="h-12 w-auto"
                />
              </div>
              <div className="text-right">
                <h2 className="text-xl font-bold text-gray-800">Hóa Đơn</h2>
                <p className="text-sm text-gray-600">Số: {order._id}</p>
              </div>
            </div>

            {/* Customer Info */}
            <div className="p-4 grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">
                  Hóa đơn tới:
                </h3>
                <p className="text-gray-600">
                  {order.username}
                  <br />
                  {order.address}
                  <br />
                  {order.phone_number}
                </p>
              </div>
              <div className="md:text-right">
                <p className="text-gray-600">
                  <span className="font-semibold">Ngày:</span>{" "}
                  {formatDate(order.createdAt)}
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-left">Tên sản phẩm</th>
                    <th className="p-3 text-center">Số Lượng</th>
                    <th className="p-3 text-center">Đơn Giá</th>
                    <th className="p-3 text-right">Thành Tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {order.cart.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-3">{item.name}</td>
                      <td className="p-3 text-center">{item.quantity}</td>
                      <td className="p-3 text-center">
                        {item.price.toLocaleString()}đ
                      </td>
                      <td className="p-3 text-right">
                        {(item.price * item.quantity).toLocaleString()}đ
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-100 font-bold">
                    <td colSpan="3" className="p-3 text-right">
                      Tổng Tiền
                    </td>
                    <td className="p-3 text-right">
                      {calculateTotal(order.cart).toLocaleString()}đ
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MyOrder;
