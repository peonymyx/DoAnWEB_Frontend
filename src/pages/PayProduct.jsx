import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { addOther } from "../redux/otherSlice";
import Paypal from "../components/Paypal";
import { useLocation } from "react-router-dom";

function PayProducts() {
  const location = useLocation();
  const discountedTotal = location.state?.discountedTotal;
  const auth = useSelector((state) => state.auth.currentUser);
  const cart = useSelector((state) => state.cart.cart);
  const dispatch = useDispatch();
  const [username, setUsername] = useState(auth?.username || "");
  const [phone_number, setPhone_number] = useState(auth?.phone || "");
  const [address, setAddress] = useState(auth?.address || "");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("Đã thanh toán");

  // Hàm tính tổng giá trị đơn hàng sau khi áp dụng giảm giá
  const getTotal = () => {
    // Tính giá trị đơn hàng sau giảm giá chuyển từ VNĐ sang USD (giả sử tỷ giá 1 USD = 23000 VNĐ)
    const totalPriceUsd = Math.round((discountedTotal / 23000) * 100) / 100;

    // Trả về một đối tượng chứa tổng giá trị sau giảm giá và giá trị đơn hàng tính bằng USD
    return { discountedTotal, totalPriceUsd };
  };

  // Hàm định dạng giá tiền: chuyển giá thành chuỗi và thêm dấu phân cách hàng nghìn
  const formatPrice = (price) => {
    // Nếu giá trị là `undefined` hoặc `null`, trả về chuỗi rỗng
    if (price === undefined || price === null) {
      return "";
    }

    // Chuyển giá trị thành chuỗi, sau đó thêm dấu chấm (.) vào vị trí hàng nghìn
    // Ví dụ: 1000000 -> "1.000.000"
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VNĐ";
  };

  // Hàm xử lý khi người dùng thanh toán
  const handlePay = () => {
    // Dữ liệu đơn hàng sẽ được gửi đi bao gồm: tên người dùng, số điện thoại, địa chỉ, ghi chú và giỏ hàng
    const data = {
      username: username, // Tên người dùng
      phone_number: phone_number, // Số điện thoại
      address: address, // Địa chỉ
      note: note, // Ghi chú
      cart: cart, // Giỏ hàng
      status: "chưa thanh toán", // Trạng thái đơn hàng (chưa thanh toán)
    };

    // Gửi dữ liệu đơn hàng tới reducer (hoặc API) để xử lý thêm (ví dụ: lưu vào cơ sở dữ liệu)
    dispatch(addOther(data));
  };

  return (
    <div className="bg-gray-100 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Responsive Container */}
        <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Responsive Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Left Column - Order Summary */}
            <div>
              <h1 className="text-2xl font-bold mb-6 text-gray-800">
                CHI TIẾT ĐƠN HÀNG
              </h1>

              {/* Responsive Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-3 text-lg font-semibold tracking-wide">
                        Sản phẩm
                      </th>
                      <th className="p-3 text-lg font-semibold tracking-wide text-center">
                        SL
                      </th>
                      <th className="py-3 pr-7 text-lg font-semibold tracking-wide text-right">
                        Giá
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((item) => (
                      <tr key={item.product_id} className="border-b">
                        <td className="p-3">
                          <div className="flex items-center">
                            <span className="font-medium">{item.name}</span>
                            <span className="text-md font-semibold text-gray-500 ml-2">
                              ({item.size})
                            </span>
                          </div>
                        </td>
                        <td className="p-3 text-center">{item.quantity}</td>
                        <td className="p-3 text-right">
                          {formatPrice(item.price)}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50 font-bold">
                      <td className="p-3 text-lg">Tổng cộng</td>
                      <td></td>
                      <td className="p-3 text-right text-lg">
                        {formatPrice(getTotal().discountedTotal)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Column - Customer Information */}
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                THÔNG TIN NGƯỜI MUA
              </h2>

              {/* Form with Responsive Inputs */}
              <div className="space-y-4">
                <div>
                  <label className="block text-md font-semibold text-gray-700 mb-2">
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    className="w-full text-md px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Nhập họ và tên"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-md font-semibold text-gray-700 mb-2">
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    className="w-full text-md px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Nhập số điện thoại"
                    value={phone_number}
                    onChange={(e) => setPhone_number(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-md font-semibold text-gray-700 mb-2">
                    Địa chỉ *
                  </label>
                  <input
                    type="text"
                    className="w-full text-md px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Nhập địa chỉ"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-md font-semibold text-gray-700 mb-2">
                    Ghi chú
                  </label>
                  <textarea
                    className="w-full text-md px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    rows="4"
                    placeholder="Nhập ghi chú (nếu có)"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div className="mt-8">
                <p className="text-2xl font-bold mb-4 text-gray-800">
                  PHƯƠNG THỨC THANH TOÁN
                </p>

                {/* PayPal Payment */}
                <div className="h-[140px]">
                  <Paypal
                    payload={{
                      cart,
                      username: username,
                      phone_number: phone_number,
                      address: address,
                      note: note,
                      userId: auth?._id,
                      status: status,
                    }}
                    amount={getTotal().totalPriceUsd}
                  />
                </div>

                {/* Divider Line with Centered Text */}
                <div className="flex items-center justify-center my-6">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="mx-4 text-gray-500 font-medium">HOẶC</span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>

                {/* Cash on Delivery */}
                <button
                  onClick={handlePay}
                  className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center space-x-2"
                >
                  <span className="text-lg">Thanh toán khi nhận hàng</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PayProducts;
