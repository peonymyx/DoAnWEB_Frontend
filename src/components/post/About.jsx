import {
  PhoneIcon,
  RefreshCwIcon,
  ShieldCheckIcon,
  TruckIcon,
} from "lucide-react";

const About = () => {
  return (
    <div className="flex flex-col md:flex-row justify-center md:gap-28 items-center bg-gray-50 py-8 px-10 space-y-4 md:space-y-2">
      {/* MIỄN PHÍ GIAO HÀNG ĐƠN TỪ 199K */}
      <div className="flex flex-col items-center text-center space-y-2 transform transition-transform duration-200 hover:scale-110">
        <TruckIcon className="md:h-20 md:w-20 w-14 h-14 text-gray-700" />
        <p className="text-lg font-semibold text-gray-800 mt-3">
          MIỄN PHÍ GIAO HÀNG ĐƠN TỪ 199K
        </p>
        <p className="text-gray-500 text-lg m-2">Giao hàng nhanh chóng</p>
      </div>

      {/*  BẢO HÀNH SẢN PHẨM */}
      <div className="flex flex-col items-center text-center space-y-2 transform transition-transform duration-200 hover:scale-110">
        <ShieldCheckIcon className="md:h-20 md:w-20 w-14 h-14 text-gray-700" />
        <p className="text-lg font-semibold text-gray-800 mt-3">
          BẢO HÀNH SẢN PHẨM
        </p>
        <p className="text-gray-500 text-lg m-2">
          Trong vòng 6 tháng kể từ ngày mua
        </p>
      </div>

      {/*    ĐỔI HÀNG LINH HOẠT */}
      <div className="flex flex-col items-center text-center space-y-2 transform transition-transform duration-200 hover:scale-110">
        <RefreshCwIcon className="md:h-20 md:w-20 w-14 h-14 text-gray-700" />
        <p className="text-lg font-semibold text-gray-800 mt-3">
          ĐỔI HÀNG LINH HOẠT
        </p>
        <p className="text-gray-500  text-lg m-2">
          Trong vòng 15 ngày kể từ ngày mua
        </p>
      </div>

      {/* TƯ VẤN NHANH CHÓNG */}
      <div className="flex flex-col items-center text-center space-y-2 transform transition-transform duration-200 hover:scale-110">
        <PhoneIcon className="md:h-20 md:w-20 w-14 h-14 text-gray-700" />
        <p className="text-lg font-semibold text-gray-800 mt-3">
          TƯ VẤN NHANH CHÓNG
        </p>
        <p className="text-gray-500  text-lg m-2">
          Hỗ trợ từ 7h30-23h mỗi ngày
        </p>
      </div>
    </div>
  );
};

export default About;
