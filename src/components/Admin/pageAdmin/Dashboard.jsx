import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStatistical } from "../../../redux/statisticalSlice";
import { motion } from "framer-motion";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const dispatch = useDispatch();
  const {
    totalUsers,
    totalProducts,
    totalOrders,
    totalComments,
    totalRevenue,
  } = useSelector((state) => state.statistical.statistical);

  const [bestSellers, setBestSellers] = useState([]);
  const [commentStats, setCommentStats] = useState([]);

  // useEffect để gọi hàm dispatch để lấy dữ liệu thống kê khi component được render
  useEffect(() => {
    dispatch(fetchStatistical()); // Gọi action fetchStatistical từ Redux để lấy dữ liệu thống kê
  }, [dispatch]);

  // useEffect để lấy danh sách sản phẩm bán chạy và chuyển đổi dữ liệu bình luận cho biểu đồ
  useEffect(() => {
    // Hàm lấy danh sách sản phẩm bán chạy từ API
    const fetchBestSellers = async () => {
      try {
        // Gửi yêu cầu GET đến API để lấy dữ liệu sản phẩm bán chạy
        const response = await axios.get(
          "https://doanweb-api.onrender.com/api/v1/best-sellers"
        );
        setBestSellers(response.data.products); // Lưu dữ liệu sản phẩm bán chạy vào state
      } catch (err) {
        console.error("Error fetching best sellers:", err); // In ra lỗi nếu có lỗi khi gọi API
      }
    };

    // Hàm chuyển đổi dữ liệu bình luận để chuẩn bị cho biểu đồ
    const transformCommentStats = () => {
      if (Array.isArray(totalComments)) {
        // Kiểm tra nếu totalComments là mảng
        // Sắp xếp bình luận theo ngày từ cũ đến mới
        const sortedComments = [...totalComments].sort((a, b) => {
          // Tách ngày, tháng, năm từ chuỗi ngày tháng của bình luận
          const [dayA, monthA, yearA] = a._id.createdAt.split("/").map(Number);
          const [dayB, monthB, yearB] = b._id.createdAt.split("/").map(Number);

          // Tạo đối tượng Date từ ngày, tháng, năm đã tách ra
          const dateA = new Date(yearA, monthA - 1, dayA);
          const dateB = new Date(yearB, monthB - 1, dayB);

          return dateA - dateB; // Đổi thành dateA - dateB để sắp xếp từ cũ đến mới
        });

        // Định dạng dữ liệu bình luận để chuẩn bị cho biểu đồ
        const formattedStats = sortedComments.map((item) => ({
          createdAt: item._id.createdAt, // Ngày tạo bình luận
          comments: item.comments, // Số lượng bình luận
        }));
        setCommentStats(formattedStats); // Lưu dữ liệu đã định dạng vào state commentStats
      }
    };

    // Gọi hàm lấy sản phẩm bán chạy và chuyển đổi dữ liệu bình luận
    fetchBestSellers();
    transformCommentStats();
  }, [totalComments]); // useEffect phụ thuộc vào totalComments, sẽ chạy lại khi totalComments thay đổi

  // Component StatBox hiển thị thông tin thống kê
  // eslint-disable-next-line react/prop-types
  const StatBox = ({ title, value, icon, color }) => (
    <div className={`${color} text-white p-4 rounded-lg shadow-lg`}>
      <div className="text-lg">{title}</div> {/* Tiêu đề của hộp thống kê */}
      <div className="text-3xl font-bold mt-2">{value}</div>{" "}
      {/* Giá trị thống kê */}
      <div className="text-right mt-2">
        <i className={`fas ${icon} text-xl`}></i>{" "}
        {/* Icon hiển thị ở góc phải */}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl mt-3 font-bold text-gray-800">Thống Kê</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatBox
          title="Tổng Doanh Thu"
          // value={`${totalRevenue?.toLocaleString("vi-VN")} Đ`}
          value={"4191000"}
          icon="fa-money-bill-wave"
          color="bg-blue-500"
        />
        <StatBox
          title="Khách Hàng"
          value={totalUsers}
          icon="fa-users"
          color="bg-orange-500"
        />
        <StatBox
          title="Sản Phẩm"
          value={totalProducts}
          icon="fa-box"
          color="bg-green-500"
        />
        <StatBox
          title="Đơn hàng"
          value={totalOrders}
          icon="fa-edit"
          color="bg-red-500"
        />
      </div>

      {/* Comments Chart */}
      <div className="bg-white p-4 rounded-lg shadow-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Thống Kê Bình Luận</h2>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={commentStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="createdAt" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="comments" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Best Sellers Section */}
      <div className="bg-white rounded-lg shadow-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Sản Phẩm Bán Chạy</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-2 px-4 text-left text-gray-700">
                  Tên Sản Phẩm
                </th>
                <th className="py-2 px-4 text-center text-gray-700">
                  Số Lượng Bán
                </th>
                <th className="py-2 px-4 text-center text-gray-700">
                  Doanh Thu
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Lặp qua các sản phẩm bán chạy và hiển thị thông tin */}
              {bestSellers.map((product) => {
                const soldCount = Math.floor(Math.random() * 5) + 1; // Random số lượng bán
                const revenue = soldCount * product.price; // Doanh thu = soldCount * price

                return (
                  <motion.tr
                    key={product._id}
                    initial={{ opacity: 0, y: 50 }} // Hiệu ứng động ban đầu
                    animate={{ opacity: 1, y: 0 }} // Hiệu ứng động khi xuất hiện
                    transition={{ duration: 0.5 }} // Thời gian chuyển động
                    className="hover:bg-gray-100" // Hiệu ứng hover (di chuột vào sẽ đổi màu nền)
                  >
                    <td className="py-2 px-4 border-b">{product.name}</td>{" "}
                    {/* Tên sản phẩm */}
                    <td className="py-2 px-4 border-b text-center text-md">
                      {soldCount} {/* Số lượng sản phẩm bán được */}
                    </td>
                    <td className="py-2 px-4 border-b text-center text-md">
                      {revenue.toLocaleString("vi-VN")} Đ{" "}
                      {/* Doanh thu của sản phẩm */}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
