import { useForm } from "react-hook-form"; // Thư viện hỗ trợ quản lý form trong React
import { useDispatch, useSelector } from "react-redux"; // Thư viện Redux hỗ trợ lấy và gửi dữ liệu qua Redux store
import { addCategoryPost } from "../../../redux/categoryPostSlice"; // Hàm action để thêm danh mục bài viết vào Redux store
import { yupResolver } from "@hookform/resolvers/yup"; // Thư viện giúp tích hợp Yup vào react-hook-form để xác thực dữ liệu
import * as yup from "yup"; // Thư viện Yup để xác thực dữ liệu
import "./loading.css"; // Import file CSS để tạo hiệu ứng loading
import Sidebar from "../../Nav/Sidebar"; // Component Sidebar để hiển thị menu bên trái
import { Link } from "react-router-dom"; // Component Link để chuyển trang

// Xác định schema xác thực form bằng Yup
const schema = yup.object().shape({
  name: yup.string().email().required("Vui lòng nhập tên danh mục!"), // Xác thực trường "name" là email và bắt buộc phải nhập
});

function AddCategoryPost() {
  const dispatch = useDispatch(); // Hàm dispatch để gửi action đến Redux store
  const {
    register, // Hàm dùng để đăng ký các input với react-hook-form
    handleSubmit, // Hàm xử lý submit form
    formState: { errors }, // Lấy ra đối tượng errors để hiển thị lỗi xác thực
  } = useForm({
    resolver: yupResolver(schema), // Sử dụng Yup để xác thực dữ liệu form
  });

  const isLoading = useSelector((state) => state.categoryPost.isLoading); // Lấy trạng thái loading từ Redux

  // Xử lý khi người dùng submit form
  const onSubmit = (data) => {
    dispatch(addCategoryPost(data)); // Gửi dữ liệu đến action addCategoryPost để thêm danh mục bài viết
  };

  return (
    <div className="flex h-[100vh]">
      <Sidebar /> {/* Hiển thị Sidebar bên trái */}
      <form
        onSubmit={handleSubmit(onSubmit)} // Gọi hàm onSubmit khi form được submit
        className="w-[450px] mx-auto p-4 bg-gray-100 h-max mt-40 rounded-lg shadow" // CSS để tạo style cho form
      >
        <h1 className=" text-2xl font-bold text-center pb-4">
          Thêm danh mục bài viết
        </h1>
        {isLoading && ( // Kiểm tra trạng thái loading, nếu true sẽ hiển thị overlay loading
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
          </div>
        )}
        <div className="mb-4">
          <label className="block text-gray-700 text-md font-bold mb-2">
            Tên danh mục:
          </label>
          <div>
            <input
              type="text"
              className={`w-full px-3 py-2 rounded-lg border ${
                errors.name ? "border-red-500" : "border-gray-300" // Nếu có lỗi thì đổi màu viền thành màu đỏ
              } focus:border-blue-500 focus:outline-none text-gray-700`}
              {...register("name")} // Đăng ký input với react-hook-form
            />
            <p className="text-red-500 mt-1">{errors.name?.message}</p>{" "}
            {/* Hiển thị thông báo lỗi nếu có */}
          </div>
        </div>
        <div className="text-right">
          <button
            type="submit" // Nút submit form
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          >
            Thêm
          </button>
        </div>
        <Link to="/CategoryPostManagement">Quay Lại</Link>{" "}
        {/* Liên kết quay lại trang quản lý danh mục bài viết */}
      </form>
    </div>
  );
}

export default AddCategoryPost; // Xuất component AddCategoryPost để sử dụng ở các file khác
