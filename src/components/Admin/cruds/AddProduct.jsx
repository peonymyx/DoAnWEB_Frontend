import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import "./loading.css";
import { addProduct } from "../../../redux/productSlice";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCategory } from "../../../redux/categorySlice";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const schema = yup.object().shape({
  name: yup.string().required("Vui lòng nhập tên"),
  price: yup.string().required("Vui lòng nhập giá"),
});

const AddProduct = () => {
  const [imageUpload, setImageUpload] = useState("");
  const [description, setDescription] = useState("");
  const [selectedSize, setSelectedSize] = useState([]);
  const isLoading = useSelector((state) => state.product.isLoading);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const dispatch = useDispatch();
  const user = JSON.parse(sessionStorage.getItem("user"));
  const category = useSelector((state) => state.category.category);
  const navigate = useNavigate();

  useEffect(() => {
    if (user.role !== "admin") {
      navigate("/login");
    }
  }, [user.role, navigate]);

  useEffect(() => {
    dispatch(getCategory());
  }, [dispatch]);

  const handleUploadImage = async (e) => {
    setImageUpload(e.target.files[0]);
  };

  const handleAddSize = (size) => {
    setSelectedSize((prevSelectedSize) =>
      prevSelectedSize.includes(size)
        ? prevSelectedSize.filter((s) => s !== size)
        : [...prevSelectedSize, size]
    );
  };

  const handleUploadToImgBB = async (image) => {
    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await fetch(
        "https://api.imgbb.com/1/upload?key=cfe71e9e26a59994e591b6744b110c0f",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      return data.data.url;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  const handleAddProduct = async (data) => {
    const { name, address, category, price } = data;
    console.log("imageUpload", imageUpload);
    const imageUrl = await handleUploadToImgBB(imageUpload);
    if (!imageUrl) {
      console.error("Failed to upload image");
      return;
    }
    console.log("imageUrl", imageUrl);

    if (!imageUrl) {
      console.error("Failed to upload image");
      return;
    }
    await dispatch(
      addProduct({
        name,
        size: selectedSize,
        address,
        category,
        description: description,
        price,
        image: imageUrl,
      })
    );
  };

  return (
    <div className="flex h-[100vh]">
      <div className="container min-h-screen mx-auto p-4">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-xl">
          <h1 className="font-bold text-3xl text-center mb-6">Thêm Sản Phẩm</h1>
          {isLoading && (
            <div className="loading-overlay">
              <div className="loading-spinner"></div>
            </div>
          )}
          <form
            onSubmit={handleSubmit(handleAddProduct)}
            className="max-w-md mx-auto"
            encType="multipart/form-data"
          >
            <div className="mb-4">
              <label
                htmlFor="name"
                className="mb-3 block font-bold text-[#07074D] text-xl"
              >
                Tên sản phẩm:
              </label>
              <input
                name="name"
                type="text"
                id="name"
                placeholder="Hãy nhập tên sản phẩm"
                className="w-full rounded-md border text-xl border-[#e0e0e0] bg-white py-3 px-6 font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                {...register("name")}
              />
              <p className="text-red-500 mt-1">{errors.name?.message}</p>
            </div>
            <div className="mb-4">
              <label
                htmlFor="price"
                className="mb-3 block font-bold text-[#07074D] text-xl"
              >
                Giá sản phẩm:
              </label>
              <input
                name="price"
                type="text"
                id="price"
                placeholder="Hãy nhập giá sản phẩm"
                className="w-full rounded-md border text-xl border-[#e0e0e0] bg-white py-3 px-6 font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                {...register("price")}
              />
              <p className="text-red-500 mt-1">{errors.price?.message}</p>
            </div>
            <div className="flex gap-2 items-center mt-2 mb-4">
              <label
                htmlFor="size"
                className="block font-bold text-[#07074D] text-xl"
              >
                Chọn Size:
              </label>
              {selectedSize.map((size) => (
                <div
                  key={size}
                  className="border px-4 py-2 cursor-pointer size-item active border-primary"
                >
                  {size}
                </div>
              ))}
            </div>
            <div className="flex gap-2 items-center mt-2 text-xl">
              <button
                type="button"
                onClick={() => handleAddSize("S")}
                className={`border px-4 py-2 cursor-pointer size-item ${
                  selectedSize.includes("S") ? "bg-blue-500 text-white" : ""
                }`}
              >
                S
              </button>
              <button
                type="button"
                onClick={() => handleAddSize("M")}
                className={`border px-4 py-2 cursor-pointer size-item ${
                  selectedSize.includes("M") ? "bg-blue-500 text-white" : ""
                }`}
              >
                M
              </button>
              <button
                type="button"
                onClick={() => handleAddSize("L")}
                className={`border px-4 py-2 cursor-pointer size-item ${
                  selectedSize.includes("L") ? "bg-blue-500 text-white" : ""
                }`}
              >
                L
              </button>
              <button
                type="button"
                onClick={() => handleAddSize("XL")}
                className={`border px-4 py-2 cursor-pointer size-item ${
                  selectedSize.includes("XL") ? "bg-blue-500 text-white" : ""
                }`}
              >
                XL
              </button>
            </div>
            <div className="my-4">
              <label
                htmlFor="category"
                className="mb-3 block font-bold text-[#07074D] text-xl"
              >
                Danh mục
              </label>
              <select
                className="w-full rounded-md border text-xl border-[#e0e0e0] bg-white py-3 px-6 font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                name="category"
                {...register("category")}
              >
                {category.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label
                htmlFor="image"
                className="mb-3 block font-bold text-[#07074D] text-xl"
              >
                Hình ảnh:
              </label>
              <input
                {...register("image")}
                type="file"
                onChange={handleUploadImage}
                className="text-xl"
              />
              <p className="text-red-500 mt-1">{errors.file?.message}</p>
            </div>
            <div className="mb-4">
              <label
                htmlFor="description"
                className="mb-3 block font-bold text-[#07074D] text-xl"
              >
                Mô tả:
              </label>
              <ReactQuill
                theme="snow"
                value={description}
                onChange={setDescription}
                modules={addProduct.modules}
                formats={addProduct.formats}
                placeholder="Write something..."
              />
              <p className="text-red-500 mt-1">{errors.description?.message}</p>
            </div>
            <div className="flex justify-between">
              <Link to="/ProductManagement" className="mt-3 text-lg py-3 px-6">
                Quay Lại
              </Link>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-lg text-white font-bold py-3 px-6 mt-3 rounded focus:outline-none focus:shadow-outline"
              >
                Thêm sản phẩm
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
