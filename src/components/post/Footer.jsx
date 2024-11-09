import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Footer = () => {
  const [showButton, setShowButton] = useState(false);

  //cuộn lên đầu trang khi nhấn nút
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-blueGray-200 pt-8 pb-6 border-t-2 shadow-md mt-auto relative">
      <div className="mx-auto px-16">
        <div className="flex flex-wrap text-left lg:text-left">
          <div className="w-full lg:w-6/12 px-4">
            <h2 className="text-3xl font-semibold text-blueGray-700 mb-2">
              ASIN
            </h2>
            <h4 className="text-lg mt-0 mb-2 text-blueGray-600">
              CÔNG TY CỔ PHẦN THỜI TRANG ASIN VIỆT NAM
            </h4>
            <h6 className="text-lg mt-0 mb-2 text-blueGray-600">
              Hotline: 1900 8079
            </h6>
            <h6 className="text-lg mt-0 mb-2 text-blueGray-600">
              <b>Địa chỉ</b>: 279 Nguyễn Tri Phương, phường 5, quận 10
            </h6>
            <div className="mt-6 lg:mb-0 mb-6">
              <button
                className="bg-white text-lightBlue-600 font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none mr-2"
                type="button"
              >
                <i className="fab fa-facebook text-xl"></i>
              </button>
              <button
                className="bg-white font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none mr-2"
                type="button"
              >
                <i className="fab fa-instagram text-xl"></i>
              </button>
              <button
                className="bg-white text-blueGray-800 font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none mr-2"
                type="button"
              >
                <i className="fab fa-youtube text-xl"></i>
              </button>
            </div>
          </div>
          <div className="w-full lg:w-6/12 px-4">
            <div className="flex flex-wrap items-top mb-6">
              <div className="w-full lg:w-4/12 ml-auto">
                <span className="block uppercase text-blueGray-500 text-md font-bold mb-3">
                  GIỚI THIỆU ASIN
                </span>
                <ul className="list-unstyled">
                  <li>
                    <Link
                      className="text-blueGray-600 hover:text-blueGray-800 font-semibold block pb-2 text-md mb-2"
                      to="/"
                    >
                      Giới thiệu
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-blueGray-600 hover:text-blueGray-800 font-semibold block pb-2 text-md mb-2"
                      to="/"
                    >
                      Hệ thống cửa hàng
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-blueGray-600 hover:text-blueGray-800 font-semibold block pb-2 text-md mb-2"
                      to="/"
                    >
                      Liên hệ với ASIN
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-blueGray-600 hover:text-blueGray-800 font-semibold block pb-2 text-md mb-2"
                      to="/"
                    >
                      Chính sách bảo mật
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="w-full lg:w-4/12">
                <span className="block uppercase text-blueGray-500 text-md font-bold mb-3">
                  HỖ TRỢ KHÁCH HÀNG
                </span>
                <ul className="list-unstyled">
                  <li>
                    <Link
                      className="text-blueGray-600 hover:text-blueGray-800 font-semibold block pb-2 text-md mb-2"
                      to="/"
                    >
                      Chính sách vận chuyển
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-blueGray-600 hover:text-blueGray-800 font-semibold block pb-2 text-md mb-2"
                      to="/"
                    >
                      Hướng dẫn thanh toán
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-blueGray-600 hover:text-blueGray-800 font-semibold block pb-2 text-md mb-2"
                      to="/"
                    >
                      Quy định đổi hàng
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-blueGray-600 hover:text-blueGray-800 font-semibold block pb-2 text-md mb-2"
                      to="/"
                    >
                      Hướng dẫn mua hàng
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <hr className="my-6 border-blueGray-300" />
        <div className="flex flex-wrap items-center md:justify-between justify-center">
          <div className="w-full md:w-4/12 px-4 mx-auto text-center">
            <div className="text-sm text-blueGray-500 font-semibold py-1">
              Copyright © {new Date().getFullYear()}{" "}
              <a
                href="https://www.creative-tim.com/product/notus-js"
                className="text-blueGray-500 hover:text-gray-800"
                target="_blank"
                rel="noopener noreferrer"
              >
                ASIN
              </a>{" "}
              by{" "}
              <a
                href="https://www.creative-tim.com?ref=njs-profile"
                className="text-blueGray-500 hover:text-blueGray-800"
                target="_blank"
                rel="noopener noreferrer"
              >
                Group 2
              </a>
            </div>
          </div>
        </div>
      </div>
      {showButton && (
        <button
          onClick={scrollToTop}
          className="flex items-center justify-center text-2xl fixed right-2 w-12 h-12 sm:w-16 sm:h-16 sm:bottom-24 bottom-16 bg-blue-400 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors duration-300 focus:outline-none"
        >
          ↑
        </button>
      )}
    </footer>
  );
};

export default Footer;
