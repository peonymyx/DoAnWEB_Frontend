import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const BANNER = [
  { src: "./HangMuaDong.webp" },
  { src: "./KhuyenMai.webp" },
  { src: "./XaHangHe.webp" },
  { src: "./AnhGiaMoi.webp" },
];

const Banner = () => {
  // Khai báo state currentIndex, quản lý chỉ số của banner hiện tại
  const [currentIndex, setCurrentIndex] = useState(0);

  // useEffect để tự động chuyển banner mỗi 3 giây
  useEffect(() => {
    // Thiết lập một interval để tự động chuyển banner sau mỗi 3 giây
    const interval = setInterval(() => {
      // Cập nhật currentIndex, khi hết mảng quay lại từ đầu
      setCurrentIndex((prevIndex) => (prevIndex + 1) % BANNER.length);
    }, 3000); // Đặt thời gian chờ giữa các lần chuyển banner là 3000ms (3 giây)

    // Cleanup function để dọn dẹp interval khi component bị unmount
    return () => clearInterval(interval);
  }, []); // useEffect chỉ chạy một lần khi component mount, không phụ thuộc vào biến nào khác

  // Hàm để chuyển đến banner trước
  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      // Nếu currentIndex đang là 0, chuyển đến banner cuối cùng (BANNER.length - 1)
      prevIndex === 0 ? BANNER.length - 1 : prevIndex - 1
    );
  };

  // Hàm để chuyển đến banner tiếp theo (next)
  const handleNext = () => {
    setCurrentIndex(
      (prevIndex) =>
        // Cập nhật currentIndex, khi đạt đến cuối mảng, quay lại từ đầu
        (prevIndex + 1) % BANNER.length
    );
  };

  return (
    <div className="relative md:h-[778px] h-[220px] overflow-hidden">
      <div className="carousel-inner relative w-full h-full">
        <AnimatePresence initial={false}>
          {BANNER.map(
            (item, index) =>
              index === currentIndex && (
                <motion.div
                  key={index}
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Link to="/listproducts">
                    <img
                      className="w-full h-full object-cover"
                      src={item.src}
                      alt="Image"
                    />
                  </Link>
                </motion.div>
              )
          )}
        </AnimatePresence>
      </div>
      <button
        type="button"
        className="flex absolute top-0 left-0 z-30 justify-center items-center px-4 h-full cursor-pointer group focus:outline-none hover:scale-125 transition-transform duration-100"
        onClick={handlePrev}
      >
        <span className="carousel-control-prev-icon flex justify-center items-center w-6 h-6 rounded-full sm:w-10 sm:h-10 text-white">
          <span className="hidden">Previous</span>
        </span>
      </button>
      <button
        type="button"
        className="flex absolute top-0 right-0 z-30 justify-center items-center px-4 h-full cursor-pointer group focus:outline-none hover:scale-125 transition-transform duration-100"
        onClick={handleNext}
      >
        <span className="carousel-control-next-icon flex justify-center items-center w-6 h-6 rounded-full sm:w-10 sm:h-10  text-white">
          <span className="hidden">Next</span>
        </span>
      </button>
    </div>
  );
};

export default Banner;
