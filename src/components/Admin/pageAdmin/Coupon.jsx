import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createCoupon, // Import hàm tạo mã giảm giá
  fetchCoupons, // Import hàm lấy danh sách mã giảm giá
  deleteCoupon, // Import hàm xóa mã giảm giá
  updateCoupon, // Import hàm cập nhật mã giảm giá
} from "../../../redux/couponSlice";

const CouponAdmin = () => {
  const dispatch = useDispatch(); // Khởi tạo dispatch để sử dụng các hàm trong redux
  const coupons = useSelector((state) => state.coupons.coupons); // Lấy danh sách mã giảm giá từ redux store
  console.log("coupons", coupons); // In ra danh sách mã giảm giá trong console để kiểm tra

  const [newCouponCode, setNewCouponCode] = useState(""); // Trạng thái lưu mã giảm giá mới
  const [discount, setDiscount] = useState(""); // Trạng thái lưu mức giảm giá
  const [expiryDate, setExpiryDate] = useState(""); // Trạng thái lưu ngày hết hạn
  const [editingCoupon, setEditingCoupon] = useState(null); // Trạng thái lưu mã giảm giá đang chỉnh sửa
  const [searchQuery, setSearchQuery] = useState(""); // Trạng thái lưu chuỗi tìm kiếm
  const [currentPage, setCurrentPage] = useState(1); // Trạng thái lưu trang hiện tại của phân trang
  const couponsPerPage = 5; // Số lượng mã giảm giá hiển thị trên mỗi trang

  useEffect(() => {
    dispatch(fetchCoupons()); // Gọi hàm lấy danh sách mã giảm giá khi component được render
  }, [dispatch]);

  const handleAddCoupon = () => {
    // Hàm thêm mã giảm giá mới
    if (!newCouponCode || !discount || !expiryDate) return; // Kiểm tra xem có trường nào trống không

    const newCoupon = {
      code: newCouponCode, // Lưu mã giảm giá mới
      discount: parseFloat(discount), // Chuyển mức giảm giá sang kiểu số thực
      expiryDate, // Lưu ngày hết hạn
    };
    dispatch(createCoupon(newCoupon)); // Dispatch hàm tạo mã giảm giá
    resetForm(); // Reset lại form nhập
  };

  const handleEditCoupon = (coupon) => {
    // Hàm chỉnh sửa mã giảm giá
    setEditingCoupon(coupon); // Đặt mã giảm giá đang chỉnh sửa
    setNewCouponCode(coupon.code); // Điền mã giảm giá vào form
    setDiscount(coupon.discount); // Điền mức giảm giá vào form
    setExpiryDate(coupon.expiryDate); // Điền ngày hết hạn vào form
  };

  const handleUpdateCoupon = () => {
    // Hàm cập nhật mã giảm giá
    if (!editingCoupon) return; // Kiểm tra có mã giảm giá đang chỉnh sửa không

    const updatedCoupon = {
      code: newCouponCode, // Mã giảm giá mới
      discount: discount, // Mức giảm giá mới
      expiryDate: expiryDate, // Ngày hết hạn mới
    };

    console.log("Updating coupon with ID:", editingCoupon._id); // Log ID mã giảm giá đang cập nhật

    dispatch(
      updateCoupon({ id: editingCoupon._id, couponData: updatedCoupon }) // Dispatch cập nhật mã giảm giá
    );
    resetForm(); // Reset lại form nhập
  };

  const handleDeleteCoupon = (id) => async () => {
    // Hàm xóa mã giảm giá
    console.log("xóa ", id); // Log ID mã giảm giá đang xóa
    try {
      dispatch(deleteCoupon(id)); // Dispatch xóa mã giảm giá
    } catch (error) {
      console.error("Failed to delete coupon:", error); // Log lỗi nếu xóa thất bại
    }
  };

  const resetForm = () => {
    // Hàm reset lại form nhập
    setNewCouponCode(""); // Xóa mã giảm giá trong form
    setDiscount(""); // Xóa mức giảm giá trong form
    setExpiryDate(""); // Xóa ngày hết hạn trong form
    setEditingCoupon(null); // Xóa mã giảm giá đang chỉnh sửa
  };

  const filteredCoupons = coupons.filter(
    (coupon) => coupon.code.toLowerCase().includes(searchQuery.toLowerCase()) // Lọc danh sách mã giảm giá theo từ khóa tìm kiếm
  );

  const indexOfLastCoupon = currentPage * couponsPerPage; // Tính chỉ số mã giảm giá cuối cùng của trang hiện tại
  const indexOfFirstCoupon = indexOfLastCoupon - couponsPerPage; // Tính chỉ số mã giảm giá đầu tiên của trang hiện tại
  const currentCoupons = filteredCoupons.slice(
    indexOfFirstCoupon,
    indexOfLastCoupon // Lấy danh sách mã giảm giá hiện tại trên trang
  );

  const totalPages = Math.ceil(filteredCoupons.length / couponsPerPage); // Tính tổng số trang

  const handlePageChange = (page) => {
    setCurrentPage(page); // Thay đổi trang hiện tại
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl sm:text-3xl font-bold text-center mb-4 sm:mb-6 my-3">
        Quản Lý Mã Coupon
      </h2>

      {/* Form nhập coupon */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-4 sm:mb-6">
        <input
          type="text"
          value={newCouponCode}
          onChange={(e) => setNewCouponCode(e.target.value)}
          placeholder="Nhập mã coupon"
          className="border px-3 py-2 rounded w-full sm:w-1/3"
        />
        <input
          type="number"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
          placeholder="Giảm giá (%)"
          className="border px-3 py-2 rounded w-full sm:w-1/3"
        />
        <input
          type="date"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-1/3"
        />
        <button
          onClick={editingCoupon ? handleUpdateCoupon : handleAddCoupon}
          className={`px-4 py-2 rounded text-white w-full sm:w-auto ${
            editingCoupon
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {editingCoupon ? "Cập Nhật" : "Thêm"}
        </button>
      </div>

      {/* Ô tìm kiếm */}
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Tìm kiếm mã coupon..."
        className="border mb-4 px-3 py-2 rounded w-full"
      />

      {/* Bảng hiển thị coupon */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300 text-center">
          <thead className="bg-blue-800 text-white text-lg">
            <tr>
              <th className="border p-4">Mã Coupon</th>
              <th className="border p-4">Giảm Giá (%)</th>
              <th className="border p-4">Ngày Hết Hạn</th>
              <th className="border p-4">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {currentCoupons.map((coupon) => (
              <tr
                key={coupon.id}
                className={
                  new Date(coupon.expiryDate) < new Date() ? "bg-red-100" : ""
                }
              >
                <td className="border p-4 text-lg font-bold">{coupon.code}</td>
                <td className="border p-4 text-lg">{coupon.discount}%</td>
                <td className="border p-4 text-lg">
                  {new Date(coupon.expiryDate).toLocaleDateString()}
                </td>
                <td className="border p-4 flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-2">
                  <button
                    onClick={() => handleEditCoupon(coupon)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={handleDeleteCoupon(coupon._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Phân trang*/}
      <div className="sticky bottom-0 right-0 flex justify-end p-4 bg-white">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`mx-1 px-3 py-1 rounded ${
              page === currentPage
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CouponAdmin;
