import { Link } from "react-router-dom";
import axios from "axios";
import {
  decrementQuantity,
  incrementQuantity,
  removeCart,
  selectCart,
} from "../redux/cartSlice";
import { updateUser } from "../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function Cart() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth.currentUser);
  const cart = useSelector(selectCart);
  const [coupons, setCoupons] = useState([]);
  const [setLoading] = useState(true);

  const [discountedTotal, setDiscountedTotal] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCoupon, setSelectedCoupon] = useState("");
  const [filteredCoupons, setFilteredCoupons] = useState(coupons);
  useEffect(() => {
    // Kiểm tra nếu người dùng đã đăng nhập (`auth` tồn tại), thực hiện gọi API lấy mã giảm giá
    if (auth) {
      // Hàm bất đồng bộ `fetchCoupons` để lấy dữ liệu mã giảm giá từ API
      const fetchCoupons = async () => {
        try {
          // Gọi API lấy mã giảm giá của người dùng với `_id` từ `auth`
          const response = await axios.get(
            `https://doanweb-api.onrender.com/api/v1/users/${auth._id}/coupons`
          );
          // Cập nhật danh sách mã giảm giá với dữ liệu nhận được từ API
          setCoupons(response.data);
        } catch (error) {
          // Xử lý lỗi khi có sự cố trong quá trình gọi API
          console.error("Error fetching coupons:", error);
        } finally {
          // Sau khi kết thúc quá trình (thành công hoặc lỗi), đặt `loading` thành `false`
          setLoading(false);
        }
      };

      // Gọi hàm `fetchCoupons` để lấy dữ liệu mã giảm giá
      fetchCoupons();
    }
    // `useEffect` này chỉ chạy khi giá trị của `auth` thay đổi
  }, [auth]);

  useEffect(() => {
    // Cập nhật danh sách mã giảm giá được lọc khi `coupons` hoặc `searchTerm` thay đổi
    setFilteredCoupons(
      // Duyệt qua danh sách `coupons` để lọc các mã giảm giá có chứa `searchTerm`
      coupons.filter((coupon) =>
        coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    // `useEffect` này sẽ được kích hoạt lại khi `coupons` hoặc `searchTerm` thay đổi
  }, [coupons, searchTerm]);

  // Hàm `handleCouponSelect` để xử lý khi người dùng chọn một mã giảm giá
  const handleCouponSelect = (couponCode) => {
    // Đặt mã giảm giá được chọn vào `selectedCoupon`
    setSelectedCoupon(couponCode);
  };

  // Hàm `applyCoupon` để áp dụng mã giảm giá cho tổng giá trị giỏ hàng
  const applyCoupon = () => {
    // Kiểm tra nếu chưa có mã giảm giá nào được chọn
    if (!selectedCoupon) {
      alert("Vui lòng chọn mã giảm giá trước!");
      return;
    }

    // Tìm mã giảm giá được chọn từ danh sách `coupons`
    const coupon = coupons.find((c) => c.code === selectedCoupon);
    // Nếu không tìm thấy mã giảm giá, hiển thị thông báo lỗi
    if (!coupon) {
      alert("Mã giảm giá không hợp lệ!");
      return;
    }

    // Tính tổng giá sau khi áp dụng mã giảm giá
    const discount = coupon.discount / 100; // Tính phần trăm giảm giá
    const { totalPrice } = getTotal(); // Lấy tổng giá gốc từ hàm `getTotal`
    const discountedPrice = totalPrice * (1 - discount); // Tính giá sau khi giảm
    setDiscountedTotal(discountedPrice); // Đặt `discountedTotal` với giá đã giảm
    alert(`Mã giảm giá ${selectedCoupon} đã được áp dụng!`);
  };

  // Hàm `getTotal` để tính tổng số lượng và tổng giá trị của các sản phẩm trong giỏ hàng
  const getTotal = () => {
    let totalQuantity = 0; // Tổng số lượng sản phẩm
    let totalPrice = 0; // Tổng giá trị trước khi giảm giá
    // Duyệt qua các sản phẩm trong `cart` để tính tổng số lượng và tổng giá
    cart.forEach((item) => {
      totalQuantity += item.quantity; // Cộng dồn số lượng sản phẩm
      totalPrice += item.quantity * item.price; // Cộng dồn giá của từng sản phẩm
    });
    return {
      totalQuantity, // Trả về tổng số lượng sản phẩm
      totalPrice, // Trả về tổng giá gốc
      discountedTotal: discountedTotal || totalPrice, // Trả về tổng giá sau khi giảm (hoặc giá gốc nếu chưa áp dụng giảm)
    };
  };

  const formatPrice = (price) => {
    if (price === undefined || price === null) {
      return "";
    }
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VNĐ";
  };

  if (!auth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: -50, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-6 rounded-lg shadow-lg text-center"
        >
          <p className="text-lg font-semibold mb-4">
            Đăng nhập để xem giỏ hàng
          </p>
          <a
            href="/login"
            className="inline-block bg-blue-500 text-white py-2 px-4 rounded-full transition-colors duration-300 hover:bg-blue-600"
          >
            Đăng nhập
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div>
      <div className="pt-10">
        <div className="container mx-auto p-8">
          <h1 className="text-2xl font-bold mb-4">
            DANH SÁCH SẢN PHẨM ĐÃ CHỌN
          </h1>
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            {cart.length > 0 &&
              cart.map((item) => (
                <motion.div
                  key={`${item.product_id}-${item.size}`}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center justify-between mb-4"
                >
                  <div className="flex items-center">
                    <img
                      src={item.image}
                      alt="Sản phẩm"
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="ml-4">
                      <h2 className="text-lg font-semibold">
                        {item.name} - {item.size}
                      </h2>
                      <p className="text-gray-600 text-lg">
                        Giá: {formatPrice(item.price)}
                      </p>
                      <div className="flex items-center mt-1">
                        <p className="mr-2">Số Lượng:</p>
                        <button
                          onClick={() =>
                            dispatch(
                              decrementQuantity(
                                `${item.product_id}-${item.size}`
                              )
                            )
                          }
                          className="text-xl mx-3 w-5 h-5 bg-slate-200 inline-flex items-center justify-center"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          className="w-20 sm:pl-4 text-center border border-gray-300 rounded"
                          readOnly
                        />
                        <button
                          onClick={() =>
                            dispatch(
                              incrementQuantity(
                                `${item.product_id}-${item.size}`
                              )
                            )
                          }
                          className="text-xl mx-3 w-5 h-5 bg-slate-200 inline-flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={() =>
                        dispatch(removeCart(`${item.product_id}-${item.size}`))
                      }
                      className="text-red-500 hover:text-red-700"
                    >
                      Xóa
                    </button>
                  </div>
                </motion.div>
              ))}
          </div>

          {/* Nhập mã giảm giá */}
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h2 className="text-xl font-semibold mb-4">MÃ GIẢM GIÁ</h2>
            {filteredCoupons.length === 0 ? (
              <p>Không có mã giảm giá nào.</p>
            ) : (
              <ul className="bg-white shadow-md rounded p-4">
                {filteredCoupons.map((coupon) => (
                  <li
                    key={coupon._id}
                    className="flex justify-between items-center border-b py-2 cursor-pointer"
                    onClick={() => handleCouponSelect(coupon.code)}
                  >
                    <span className="text-lg">{coupon.code}</span>
                    <span className="text-lg text-green-600">
                      {coupon.discount}%
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <input
              type="text"
              disabled
              value={selectedCoupon}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nhập mã giảm giá..."
              className="w-full py-3 pl-6 border text-blue-500 border-gray-300 rounded mb-2 font-bold text-xl"
            />
            <button
              onClick={applyCoupon}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-lg font-bold mt-4"
            >
              Áp dụng
            </button>
          </div>

          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8">
            <h2 className="text-xl font-semibold mb-4">TỔNG TIỀN</h2>
            <div className="flex justify-between mb-2">
              <p className="text-gray-600 text-lg">Tổng cộng:</p>
              <p className="font-semibold text-lg">
                {formatPrice(getTotal().discountedTotal)}
              </p>
            </div>
          </div>
          {/* Nút tiếp tục thanh toán */}
          <div className="mt-8">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 "
              onClick={() => {
                if (auth) {
                  const CouponList = coupons.filter(
                    (c) => c.code !== selectedCoupon
                  );
                  dispatch(updateUser({ CouponList: CouponList }));
                }
              }}
            >
              <Link
                to="/payproducts"
                className="text-lg font-bold hover:text-white"
                state={{ discountedTotal: getTotal().discountedTotal }}
              >
                Tiếp tục thanh toán
              </Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
