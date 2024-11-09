import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="border rounded-lg p-2 hover:shadow-lg transition-shadow bg-white relative"
      whileHover={{ scale: 1.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/productdetail/${product._id}`}>
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={product.image}
            alt={product.name}
            className="h-36 sm:h-[400px] w-full object-cover object-center transition-transform duration-300 transform hover:scale-110"
          />
          {isHovered && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
              <button className="bg-blue-700 text-blue-300 py-1 sm:py-2 sm:px-4 rounded-full text-xs sm:text-sm font-semibold transition-colors duration-300 hover:bg-blue-500 hover:text-white">
                Xem nhanh
              </button>
            </div>
          )}
        </div>
        <h2 className="text-sm sm:text-lg font-bold mt-3 truncate">
          {product.name}
        </h2>
        <p className="text-sm sm:text-lg font-semibold mt-1 text-blue-600">
          {product.price?.toLocaleString()}₫
        </p>
        <button className="mt-2 w-full text-lg bg-blue-500 text-white py-1 px-2 sm:py-2 sm:px-4 rounded-full sm:text-sm transition-colors duration-300 hover:bg-blue-600 flex items-center justify-center">
          <ShoppingCart className="mr-1 sm:mr-2 h-3 w-3 sm:h-5 sm:w-5" />
          <span className="text-lg flex items-center">Thêm giỏ hàng</span>
        </button>
      </Link>
    </motion.div>
  );
};

// Thêm PropTypes validation cho ProductCard
ProductCard.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    price: PropTypes.number.isRequired,
  }).isRequired,
};

const BestSellingProducts = () => {
  const [bestSellers, setBestSellers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Hàm `fetchBestSellers` để lấy dữ liệu sản phẩm bán chạy từ API
    const fetchBestSellers = async () => {
      try {
        // Khi bắt đầu gọi API, đặt trạng thái `isLoading` thành `true` để hiển thị loading
        setIsLoading(true);

        // Gọi API với phương thức GET tới endpoint `https://doanweb-api.onrender.com/api/v1/best-sellers`
        const response = await axios.get(
          "https://doanweb-api.onrender.com/api/v1/best-sellers"
        );

        // Lấy danh sách sản phẩm từ `response.data.products` và chọn 4 sản phẩm đầu tiên
        setBestSellers(response.data.products.slice(0, 4));

        // Sau khi lấy dữ liệu thành công, đặt `isLoading` thành `false` để ẩn loading
        setIsLoading(false);
      } catch (err) {
        // Xử lý khi có lỗi xảy ra trong quá trình gọi API
        console.error("Error fetching best sellers:", err);

        // Đặt trạng thái `error` với thông báo lỗi để thông báo cho người dùng
        setError("An error occurred while fetching best-selling products.");

        // Đặt `isLoading` thành `false` để ẩn loading ngay cả khi gặp lỗi
        setIsLoading(false);
      }
    };

    // Gọi hàm `fetchBestSellers` ngay khi component này được render lần đầu tiên
    fetchBestSellers();

    // Mảng rỗng `[]` đảm bảo rằng `useEffect` chỉ chạy một lần khi component được mount
  }, []);

  if (isLoading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-[1300px] mx-auto mt-12 mb-12">
      <p className="text-4xl font-bold text-center my-4 text-black">
        Sản phẩm bán chạy
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {bestSellers.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {bestSellers.length === 0 && (
        <p className="text-center text-gray-500 my-4 sm:my-8 text-sm sm:text-base">
          Không có sản phẩm bán chạy nào.
        </p>
      )}
    </div>
  );
};

export default BestSellingProducts;
