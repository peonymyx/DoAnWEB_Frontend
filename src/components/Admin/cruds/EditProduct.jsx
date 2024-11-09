import { yupResolver } from "@hookform/resolvers/yup"; // Sử dụng yupResolver để tích hợp yup cho xác thực trong react-hook-form
import * as yup from "yup"; // Import yup để tạo các quy tắc xác thực
import { useForm } from "react-hook-form"; // Import useForm để quản lý form và xử lý sự kiện
import { useDispatch, useSelector } from "react-redux"; // Import các hook của redux để quản lý và truy cập trạng thái trong store
import { getProductById, updateProduct } from "../../../redux/productSlice"; // Import các action để lấy sản phẩm theo ID và cập nhật sản phẩm
import { useEffect, useState } from "react"; // Import useEffect và useState để quản lý vòng đời và trạng thái
import { useNavigate, useParams } from "react-router-dom"; // Import các hook của react-router-dom để điều hướng và lấy tham số URL
import { getCategory } from "../../../redux/categorySlice"; // Import action để lấy danh mục
import "./loading.css"; // Import file CSS cho loading
import Swal from "sweetalert2"; // Import thư viện SweetAlert2 để hiển thị thông báo đẹp

// Xác định schema xác thực cho form sử dụng yup
const schema = yup.object().shape({
  name: yup.string().required("Vui lòng nhập tên"), // Tên là trường bắt buộc
});

const EditProduct = () => {
  const category = useSelector((state) => state.category.category); // Lấy danh mục từ redux store
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema), // Cấu hình yup resolver cho useForm
  });
  const dispatch = useDispatch(); // Khởi tạo dispatch để gửi action
  const navigate = useNavigate(); // Sử dụng navigate để điều hướng
  const product = useSelector((state) => state.product.products); // Lấy sản phẩm từ redux store
  const isLoading = useSelector((state) => state.product.isLoading); // Kiểm tra trạng thái loading
  const [selectedSize, setSelectedSize] = useState([]); // Khởi tạo trạng thái cho các size đã chọn
  const [imageUpload, setImageUpload] = useState(""); // Trạng thái để lưu ảnh được tải lên
  const { id } = useParams(); // Lấy ID sản phẩm từ tham số URL

  useEffect(() => {
    dispatch(getProductById(id)); // Gửi action để lấy sản phẩm theo ID
    dispatch(getCategory()); // Gửi action để lấy danh mục
  }, [dispatch, id]);

  useEffect(() => {
    if (product && typeof product.size === "string") {
      setSelectedSize(product.size); // Chia chuỗi size thành mảng và lưu vào selectedSize
    }
  }, [product]);

  const handleToggleSize = (size) => {
    if (selectedSize.includes(size)) {
      setSelectedSize(selectedSize.filter((s) => s !== size)); // Bỏ size nếu đã chọn
    } else {
      setSelectedSize([...selectedSize, size]); // Thêm size vào danh sách đã chọn
    }
  };

  const handleSelectImage = async (e) => {
    setImageUpload(e.target.files[0]); // Cập nhật trạng thái với ảnh được tải lên
  };

  const handleEditProduct = (data) => {
    const { name, description, category, price } = data;
    const updatedProduct = {
      id,
      name: name !== undefined ? name : product.name, // Kiểm tra tên trước khi cập nhật
      description:
        description !== undefined ? description : product.description, // Kiểm tra mô tả
      size: selectedSize.length > 0 ? selectedSize.join(",") : product.size, // Kiểm tra và cập nhật size
      category: category !== undefined ? category : product.category, // Kiểm tra danh mục
      price: price !== undefined ? price : product.price, // Kiểm tra giá
      image: imageUpload ? imageUpload : product.image, // Kiểm tra ảnh
    };

    console.log("Updated Product Data:", updatedProduct);

    dispatch(updateProduct(updatedProduct)).then(() => {
      Swal.fire({
        title: "Success",
        text: "Product updated successfully",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/ProductManagement"); // Điều hướng về trang quản lý sản phẩm sau khi cập nhật
      });
    });
  };

  return (
    <div className="flex h-[100vh]">
      <div className="container flex justify-center overflow-y-scroll p-4">
        <div className="h-max w-full max-w-[60rem] p-4 shadow-xl shadow-blue-gray-900/5">
          <h1 className="font-bold text-3xl text-center mb-9">
            Cập nhật Sản Phẩm
          </h1>
          {isLoading && (
            <div className="loading-overlay">
              <div className="loading-spinner"></div>{" "}
              {/* Hiển thị loading spinner khi đang tải */}
            </div>
          )}
          <form
            onSubmit={handleSubmit(handleEditProduct)}
            className="w-full max-w-[60rem]"
            encType="multipart/form-data"
          >
            {/* Nhập tên sản phẩm */}
            <div className="mb-4">
              <label
                htmlFor="name"
                className="text-lg text-gray-600 font-semibold mb-3"
              >
                Tên sản phẩm:
              </label>
              <input
                name="name"
                type="text"
                placeholder="Hãy nhập tên sản phẩm"
                className="w-full border border-gray-300 rounded-lg py-2 px-3 outline-none bg-transparent focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                defaultValue={product?.name}
                {...register("name")}
              />
              <p className="text-red-500 mt-1">{errors.name?.message}</p>
            </div>
            {/* Nhập giá */}
            <div className="mb-4">
              <label
                htmlFor="price"
                className="text-lg text-gray-600 font-semibold mb-3"
              >
                Giá
              </label>
              <input
                name="price"
                type="text"
                placeholder="Hãy nhập giá"
                className="w-full border border-gray-300 rounded-lg py-2 px-3 outline-none bg-transparent focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                defaultValue={product?.price}
                {...register("price")}
              />
              <p className="text-red-500 mt-1">{errors.price?.message}</p>
            </div>
            {/* Chọn size */}
            <div className="mb-4">
              <label
                htmlFor="size"
                className="text-lg text-gray-60 mb-30 font-semibold mb-3"
              >
                Chọn Size:
              </label>
              <div className="flex flex-wrap gap-2 mt-2">
                {["S", "M", "L", "XL"].map((size) => (
                  <div
                    key={size}
                    className={`border p-3 cursor-pointer size-item ${
                      selectedSize.includes(size) ? "border-primary" : ""
                    }`}
                    onClick={() => handleToggleSize(size)}
                  >
                    {size}
                  </div>
                ))}
              </div>
            </div>
            {/* Chọn danh mục */}
            <div className="mb-4">
              <label
                htmlFor="category"
                className="text-lg text-gray-600 font-semibold mb-3"
              >
                Danh mục
              </label>
              <select
                name="category"
                className="w-full border border-gray-300 rounded-lg py-2 px-3 outline-none bg-transparent focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                defaultValue={product?.category}
                {...register("category")}
              >
                {category.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            {/* Tải lên hình ảnh */}
            <div className="mb-4">
              <label
                htmlFor="image"
                className="text-lg text-gray-600 font-semibold mb-4"
              >
                Hình ảnh:
              </label>
              {product?.image && (
                <img
                  src={product.image}
                  alt="Product"
                  className="w-[200px] h-[200px] p-2 mt-4"
                />
              )}
              <input
                type="file"
                {...register("image")}
                onChange={handleSelectImage}
                className="mt-4"
              />
              <p className="text-red-500 mt-1">{errors.image?.message}</p>
            </div>
            {/* Nhập mô tả */}
            <div className="mb-4">
              <label
                htmlFor="description"
                className="text-lg text-gray-600 font-semibold mb-3"
              >
                Mô tả
              </label>
              <textarea
                name="description"
                placeholder="Nhập mô tả"
                className="w-full border border-gray-300 rounded-lg py-2 px-3 outline-none bg-transparent focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                defaultValue={product?.description}
                {...register("description")}
              />
              <p className="text-red-500 mt-1">{errors.description?.message}</p>
            </div>
            {/* Nút submit */}
            <button
              type="submit"
              className="w-full bg-primary py-2 px-4 text-white rounded-md hover:bg-blue-600 transition-colors mt-4"
            >
              Cập nhật sản phẩm
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
