import React, { useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const MyOrderDetail = () => {
  // Lấy tham số `id` từ URL bằng hook `useParams()`
  // Tham số này dùng để truy vấn thông tin sản phẩm theo `id` từ URL
  const { id } = useParams();

  // Khai báo state `other` để lưu trữ thông tin sản phẩm hoặc các dữ liệu liên quan
  const [other, setOther] = React.useState([]);

  // `useEffect` để gọi API và lấy thông tin sản phẩm dựa trên `id` từ URL
  useEffect(() => {
    // Gửi yêu cầu GET đến API để lấy thông tin sản phẩm theo `id`
    axios
      .get(`https://doanweb-api.onrender.com/api/v1/otherProduct/${id}`)
      .then((res) => {
        // Khi dữ liệu nhận được, cập nhật state `other` với thông tin sản phẩm
        setOther(res.data.otherProduct);
      })
      .catch((error) => {
        // Nếu có lỗi xảy ra trong quá trình lấy dữ liệu, log lỗi ra console
        console.log(error);
      });
  }, [id]); // useEffect này sẽ chạy lại khi giá trị của `id` thay đổi

  // Tính tổng giá trị đơn hàng trong giỏ hàng (nếu có thông tin giỏ hàng trong `other`)
  let totalPrice = 0;
  // Duyệt qua tất cả các sản phẩm trong giỏ hàng và tính tổng giá trị
  other?.cart?.forEach((item) => {
    // Tính tổng giá trị = giá sản phẩm * số lượng và cộng dồn vào `totalPrice`
    totalPrice += item.price * item.quantity;
  });

  return (
    <div className="content-wrapper">
      <div className="content-header p-4">
        <h1 className="text-2xl font-semibold mb-4">
          Chi tiết đơn hàng #{other.id}
        </h1>
        <div className="bg-white p-6 rounded-lg shadow-md mx-auto">
          {other?.cart?.map((item) => (
            <div key={item._id} className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="flex-1">
                <p className="text-lg font-semibold">{item.name}</p>
                <p className="text-lg font-semibold">
                  Giá:{" "}
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(item.price)}{" "}
                </p>
              </div>
              <div className="flex-1">
                <p className="text-lg font-semibold">
                  Số lượng: {item.quantity}
                </p>
              </div>
            </div>
          ))}
          <div className="container-fluid mb-4">
            <p className="text-lg font-semibold">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(totalPrice)}
            </p>
            <p className="text-lg font-semibold">Ghi chú: {other.note}</p>
          </div>
        </div>
        <a href="/my-order">Quay lại</a>
      </div>
    </div>
  );
};

export default MyOrderDetail;
