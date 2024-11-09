import { useEffect, useState } from "react"; // Import useEffect và useState từ React để quản lý trạng thái và thực thi logic khi component được render
import { useDispatch, useSelector } from "react-redux"; // Import hook useDispatch và useSelector từ Redux để quản lý state toàn cục
import { deleteProduct, getProduct } from "../../../redux/productSlice"; // Import các action từ Redux để lấy và xóa sản phẩm
import { Link } from "react-router-dom"; // Import Link từ react-router-dom để tạo liên kết điều hướng giữa các trang
import {
  Card,
  CardHeader,
  Typography,
  CardBody,
  Button,
} from "@material-tailwind/react"; // Import các thành phần UI từ Material Tailwind để xây dựng giao diện
import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/solid"; // Import các biểu tượng (icon) từ Heroicons
import "../cruds/loading.css"; // Import file CSS cho hiệu ứng loading

// Định nghĩa các tiêu đề cho bảng dữ liệu sản phẩm
const TABLE_HEAD = [
  "Hình Ảnh",
  "Tên",
  "Giá",
  "Size",
  "Ngày Tạo",
  "Ngày Sửa",
  "Hành Động",
  "Mô Tả",
];

// Số lượng sản phẩm hiển thị trên mỗi trang
const ITEMS_PER_PAGE = 5;

// Hàm định dạng giá sản phẩm thành định dạng tiền tệ
const formatPrice = (price) => {
  if (price === undefined || price === null) {
    return "";
  }
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VNĐ"; // Chuyển giá thành dạng "1.000.000 VNĐ"
};

const Product = () => {
  const dispatch = useDispatch(); // Tạo đối tượng dispatch để gửi action tới Redux store
  const product = useSelector((state) => state.product.products); // Lấy danh sách sản phẩm từ Redux store
  const loading = useSelector((state) => state.product.isLoading); // Lấy trạng thái loading từ Redux store
  const isLoading = useSelector((state) => state.product.isLoading); // Đánh dấu khi dữ liệu đang được tải
  const [searchTerm, setSearchTerm] = useState(""); // State để lưu từ khóa tìm kiếm
  const [currentPage, setCurrentPage] = useState(1); // State để lưu trang hiện tại

  // Hàm xử lý tìm kiếm khi người dùng nhập từ khóa vào ô tìm kiếm
  const handleSearch = (e) => {
    setSearchTerm(e.target.value); // Cập nhật từ khóa tìm kiếm
    setCurrentPage(1); // Đặt lại trang hiện tại về 1 khi tìm kiếm
  };

  useEffect(() => {
    dispatch(getProduct()); // Gọi action getProduct khi component được render lần đầu
  }, [dispatch]);

  console.log("Product từ Redux:", product); // In danh sách sản phẩm ra console để kiểm tra

  // Lọc các sản phẩm dựa trên từ khóa tìm kiếm (tên sản phẩm)
  const filteredProduct = Array.isArray(product)
    ? product.filter(
        (v) => v.name.toLowerCase().includes(searchTerm.toLowerCase()) // Kiểm tra xem tên sản phẩm có chứa từ khóa tìm kiếm không
      )
    : [];

  console.log("filtered", filteredProduct); // In ra các sản phẩm đã lọc

  // Hàm xử lý xóa sản phẩm khi nhấn nút xóa
  const handleDelete = (id) => async () => {
    await dispatch(deleteProduct(id)); // Gọi action xóa sản phẩm với id tương ứng

    // Thêm thời gian chờ 2 giây (2000 milliseconds) trước khi reload lại trang
    setTimeout(() => {
      window.location.reload(); // Reload trang sau khi xóa sản phẩm
    }, 2000);
  };

  // Tính tổng số trang cần phân trang
  const totalPages = Math.ceil(filteredProduct.length / ITEMS_PER_PAGE);

  // Lọc các sản phẩm hiển thị trên trang hiện tại
  const paginatedProduct = filteredProduct.slice(
    (currentPage - 1) * ITEMS_PER_PAGE, // Tính chỉ số bắt đầu của sản phẩm
    currentPage * ITEMS_PER_PAGE // Tính chỉ số kết thúc của sản phẩm
  );

  // Hàm thay đổi trang
  const handlePageChange = (page) => {
    setCurrentPage(page); // Cập nhật trang hiện tại
  };

  return (
    <div className="content-wrapper relative min-h-screen">
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>{" "}
          {/* Hiển thị spinner khi đang tải dữ liệu */}
        </div>
      )}

      <div className="flex">
        <Card className="w-full shadow-none">
          <CardHeader
            floated={false}
            shadow={false}
            className="content-header rounded-none"
          >
            <div className="mb-3 mt-3 flex flex-col justify-between gap-8 md:flex-row md:items-center">
              <div className="font-bold text-3xl">
                <h1>Quản Lý Sản Phẩm</h1> {/* Tiêu đề của trang */}
              </div>
              <div className="flex w-full shrink-0 gap-2 md:w-max mr-3">
                {/* Tạo ô tìm kiếm */}
                <div className="flex items-center gap-5 w-[350px] h-[40px] border border-gray-200 rounded-lg py-4 px-4">
                  <input
                    type="text"
                    className="w-full outline-none bg-transparent text-xl"
                    placeholder="Tìm kiếm..."
                    value={searchTerm} // Liên kết với state searchTerm
                    onChange={handleSearch} // Gọi hàm tìm kiếm khi người dùng thay đổi input
                  />
                  <span className="flex-shrink-0 text-gray-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </span>
                </div>
                {/* Nút thêm sản phẩm */}
                <div className="h-14 ml-8">
                  <Link to="/AddProduct">
                    <Button className="flex items-center p-4 justify-center text-xl gap-1 rounded-md h-11 bg-blue-500 w-29 hover:bg-blue-600">
                      <PlusIcon className="h-6 w-6 " />
                      Thêm {/* Nút Thêm sản phẩm */}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardBody className="px-2 container-fluid overflow-x-auto">
            {/* Bảng hiển thị sản phẩm */}
            <table className="w-full min-w-max table-auto text-left">
              <thead>
                <tr className=" bg-blue-800 text-white">
                  {/* In ra các tiêu đề cột trong bảng */}
                  {TABLE_HEAD.map((head) => (
                    <th
                      key={head}
                      className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 text-center"
                    >
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal leading-none text-xl"
                      >
                        {head}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Lặp qua các sản phẩm đã phân trang và hiển thị thông tin */}
                {!loading &&
                  paginatedProduct.length > 0 &&
                  paginatedProduct.map((row) => (
                    <tr key={row._id}>
                      <td className="w-[100px] h-[90px]">
                        {/* Hiển thị hình ảnh sản phẩm */}
                        <img src={row.image} alt={row.name} />
                      </td>
                      <td className="border-dashed border-t font-semibold border-blue-gray-200 w-[350px] p-4">
                        {/* Hiển thị tên sản phẩm */}
                        <div className="flex items-center ">
                          <div>
                            <Typography color="blueGray" variant="body2">
                              {row.name}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className="border-dashed border-t border-blue-gray-200 px-10 py-4">
                        {/* Hiển thị giá sản phẩm */}
                        <Typography color="blueGray" variant="body2">
                          {formatPrice(row.price)}
                        </Typography>
                      </td>
                      <td className="border-dashed border-t border-blue-gray-200 px-10 py-4">
                        {/* Hiển thị kích thước sản phẩm */}
                        <Typography color="blueGray" variant="body2">
                          {row.size}
                        </Typography>
                      </td>
                      <td className="border-dashed border-t border-blue-gray-200 px-10 py-4">
                        {/* Hiển thị ngày tạo sản phẩm */}
                        <Typography color="blueGray" variant="body2">
                          {new Date(row.createdAt).toLocaleDateString("en-GB")}
                        </Typography>
                      </td>
                      <td className="border-dashed border-t border-blue-gray-200 px-10 py-4">
                        {/* Hiển thị ngày cập nhật sản phẩm */}
                        <Typography color="blueGray" variant="body2">
                          {new Date(row.updatedAt).toLocaleDateString("en-GB")}
                        </Typography>
                      </td>
                      <td className="border-dashed border-t border-blue-gray-200 px-10">
                        {/* Các nút hành động: Sửa và Xóa */}
                        <div className="flex items-center gap-2">
                          <Link to={`/EditProduct/${row._id}`}>
                            <Button className="inline-flex items-center gap-2 justify-center px-8 text-white bg-blue-500 rounded-lg h-[50px] w-[70px] mr-2">
                              <span>
                                <PencilIcon className="h-4 w-4" />
                              </span>
                              <span>Sửa</span>
                            </Button>
                          </Link>
                          <Button
                            className="inline-flex items-center gap-2 justify-center px-8 text-white bg-red-500 rounded-lg h-[50px] w-[70px]"
                            buttonType="link"
                            size="regular"
                            rounded={false}
                            block={false}
                            iconOnly={false}
                            ripple="dark"
                            onClick={handleDelete(row._id)} // Gọi hàm xóa sản phẩm khi nhấn nút xóa
                          >
                            <span>
                              <TrashIcon className="h-4 w-4" />
                            </span>
                            <span>Xóa</span>
                          </Button>
                        </div>
                      </td>
                      <td className="border-dashed border-t border-blue-gray-200 px-10 p-4 w-[1500px]">
                        {/* Hiển thị mô tả sản phẩm */}
                        <Typography color="blueGray" variant="body2">
                          {row.description}
                        </Typography>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </CardBody>
          {/* Phân trang */}
          <div className="sticky bottom-0 right-0 flex justify-end p-4 bg-white">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)} // Thay đổi trang khi nhấn nút phân trang
                className={`mx-1 px-3 py-1 rounded ${
                  currentPage === page
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Product; // Xuất component Product để sử dụng
