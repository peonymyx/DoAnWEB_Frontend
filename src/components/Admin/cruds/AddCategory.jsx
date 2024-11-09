import { useForm } from "react-hook-form"; // Thư viện hỗ trợ quản lý và xử lý form trong React
import { useDispatch, useSelector } from "react-redux"; // Thư viện Redux hỗ trợ lấy và gửi dữ liệu qua Redux store
import { addCategory } from "../../../redux/categorySlice"; // Hàm action để thêm danh mục vào Redux
import { yupResolver } from "@hookform/resolvers/yup"; // Thư viện hỗ trợ tích hợp Yup validation vào react-hook-form
import * as yup from "yup"; // Thư viện Yup để xác thực dữ liệu nhập vào
import "./loading.css"; // Import file CSS để tạo hiệu ứng loading
import { Link } from "react-router-dom"; // Component Link để chuyển trang
import Swal from "sweetalert2"; // Thư viện SweetAlert2 để hiển thị thông báo đẹp mắt

// Xác định schema xác thực form bằng Yup
const schema = yup.object().shape({
  slug: yup.string().required("Vui lòng nhập mã số!"), // Xác thực trường mã số bắt buộc
  name: yup.string().required("Vui lòng nhập tên danh mục!"), // Xác thực trường tên bắt buộc
});

function AddCategory() {
  const dispatch = useDispatch(); // Hàm dispatch để gửi action đến Redux store
  const {
    register, // Hàm register dùng để đăng ký input với react-hook-form
    handleSubmit, // Hàm xử lý submit form
    formState: { errors }, // Lấy ra đối tượng errors để hiển thị lỗi xác thực
  } = useForm({
    resolver: yupResolver(schema), // Sử dụng Yup để xác thực dữ liệu form
  });

  const isLoading = useSelector((state) => state.category.isLoading); // Lấy trạng thái loading từ Redux

  // Xử lý khi người dùng submit form
  const onSubmit = (data) => {
    dispatch(addCategory(data)).then(() => {
      Swal.fire({
        title: "Thành công", // Tiêu đề của thông báo
        text: "Danh mục đã được thêm thành công!", // Nội dung thông báo
        showConfirmButton: false, // Ẩn nút xác nhận
        timer: 1500, // Thời gian hiển thị là 1,5 giây
      });
    });
  };

  return (
    <div className="h-[80vh] w-full flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit(onSubmit)} // Gọi hàm onSubmit khi form được submit
          className="w-full bg-gray-100 rounded-lg shadow p-4 md:p-6" // CSS để tạo style cho form
        >
          <h1 className="text-2xl md:text-3xl font-bold text-center pb-4">
            Thêm danh mục
          </h1>

          {isLoading && ( // Kiểm tra trạng thái loading, nếu true sẽ hiển thị overlay loading
            <div className="loading-overlay">
              <div className="loading-spinner"></div>
            </div>
          )}

          <div className="mb-4">
            <label className="mb-2 md:mb-3 block font-bold text-[#07074D] text-lg md:text-xl">
              Mã số
            </label>
            <input
              type="text"
              className="w-full rounded-md border text-base md:text-xl border-[#e0e0e0] bg-white py-2 md:py-3 px-4 md:px-6 font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              {...register("slug")} // Đăng ký input với react-hook-form
            />
            <p className="text-red-500 mt-2 text-base md:text-lg">
              {errors.slug?.message} {/* Hiển thị thông báo lỗi nếu có */}
            </p>
          </div>

          <div className="mb-4">
            <label className="mb-2 md:mb-3 block font-bold text-[#07074D] text-lg md:text-xl">
              Tên danh mục:
            </label>
            <div>
              <input
                type="text"
                className={`w-full rounded-md border text-base md:text-xl bg-white py-2 md:py-3 px-4 md:px-6 font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md ${
                  errors.name ? "border-red-500" : "border-[#e0e0e0]" // Đổi màu viền nếu có lỗi
                }`}
                {...register("name")} // Đăng ký input với react-hook-form
              />
              <p className="text-red-500 mt-2 text-base md:text-lg">
                {errors.name?.message} {/* Hiển thị thông báo lỗi nếu có */}
              </p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <Link
              to="/category" // Liên kết để quay lại trang danh mục
              className="text-base md:text-lg py-2 md:py-3 px-4 md:px-6 text-blue-500 hover:text-blue-700"
            >
              Quay Lại
            </Link>
            <button
              type="submit" // Nút submit form
              className="bg-blue-500 hover:bg-blue-700 text-base md:text-lg text-white font-bold py-2 md:py-3 px-4 md:px-6 rounded focus:outline-none focus:shadow-outline"
            >
              Thêm danh mục
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddCategory; // Xuất component AddCategory để sử dụng trong các file khác
