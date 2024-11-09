import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { Search, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { getProduct } from "../redux/productSlice";
import BestSellingProducts from "./BestSellingProducts";

// ProductCard component remains the same
const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="border rounded-lg p-2 mb-4 hover:shadow-lg transition-shadow bg-white relative"
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
              <button className="bg-blue-700 text-blue-300 py-1 px-4 rounded-full text-xs sm:text-sm font-semibold transition-colors duration-300 hover:bg-blue-500 hover:text-white">
                Xem nhanh
              </button>
            </div>
          )}
        </div>
        <h2 className="text-sm sm:text-lg mt-3 font-bold truncate">
          {product.name}
        </h2>
        <p className="text-sm sm:text-lg font-semibold mt-1 text-blue-600">
          {product.price?.toLocaleString()}₫
        </p>
        <button className="mt-2 w-full text-lg bg-blue-500 text-white py-1 px-4 rounded-full transition-colors duration-300 hover:bg-blue-600 flex items-center justify-center">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Thêm giỏ hàng
        </button>
      </Link>
    </motion.div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    price: PropTypes.number.isRequired,
  }).isRequired,
};

// Pagination component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];
  const maxDisplayedPages = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxDisplayedPages / 2));
  let endPage = Math.min(totalPages, startPage + maxDisplayedPages - 1);

  if (endPage - startPage + 1 < maxDisplayedPages) {
    startPage = Math.max(1, endPage - maxDisplayedPages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex items-center justify-center space-x-2 mt-8 mb-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-white"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {startPage > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className={`px-4 py-2 rounded-lg hover:bg-gray-100`}
          >
            1
          </button>
          {startPage > 2 && <span className="px-2">...</span>}
        </>
      )}

      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`px-4 py-2 rounded-lg ${
            currentPage === number
              ? "bg-blue-500 text-white"
              : "hover:bg-gray-100"
          }`}
        >
          {number}
        </button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="px-2">...</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            className={`px-4 py-2 rounded-lg hover:bg-gray-100`}
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-white"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
};

const ListProducts = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product.products);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8; // 4 products per row * 2 rows

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        await dispatch(getProduct());
        await getCategoryList();
        setIsLoading(false);
      } catch (err) {
        setError("An error occurred while fetching data.");
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]); // Also scroll to top when page changes

  const getCategoryList = async () => {
    try {
      const res = await axios.get(
        "https://doanweb-api.onrender.com/api/v1/category"
      );
      setCategories(res.data.category);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("An error occurred while fetching categories.");
    }
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setCurrentPage(1); // Reset to first page when category changes
  };

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, sortBy]);

  const filteredProducts = Array.isArray(products)
    ? products
        .filter(
          (product) =>
            (selectedCategory === "All" ||
              product.category === selectedCategory) &&
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
          switch (sortBy) {
            case "name-asc":
              return a.name.localeCompare(b.name);
            case "name-desc":
              return b.name.localeCompare(a.name);
            case "price-asc":
              return a.price - b.price;
            case "price-desc":
              return b.price - a.price;
            default:
              return 0;
          }
        })
    : [];

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (isLoading) {
    return <div className="text-center mt-8">Đang tải......</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <h1 className="text-2xl sm:text-4xl font-bold text-center m-4 sm:mb-4">
        Sản phẩm của chúng tôi
      </h1>
      <p className="text-center mb-4 sm:mb-8 text-xl text-gray-600">
        Khám phá bộ sưu tập quần áo chất lượng cao mới nhất của chúng tôi
      </p>

      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 text-xl sm:pl-10 pr-4 py-1 sm:py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4 text-sm">
          <span className="text-gray-600 text-xl">Danh mục:</span>
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="w-52 border rounded-md px-1 text-xl sm:px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">Tất cả</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4 text-sm">
          <span className="text-gray-600 text-xl">Sắp xếp theo:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-52 border rounded-md px-1 text-xl sm:px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Mặc định</option>
            <option value="name-asc">Tên A-Z</option>
            <option value="name-desc">Tên Z-A</option>
            <option value="price-asc">Giá Thấp đến Cao</option>
            <option value="price-desc">Giá Cao xuống Thấp</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
        {currentProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 ? (
        <p className="text-center text-gray-500 my-4 sm:my-8 text-sm sm:text-base">
          Không tìm thấy sản phẩm phù hợp với tiêu chí của bạn.
        </p>
      ) : (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
      
      <BestSellingProducts />
    </div>
  );
};

export default ListProducts;
