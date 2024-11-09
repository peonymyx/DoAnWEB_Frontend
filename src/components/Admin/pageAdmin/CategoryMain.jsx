import {
  PencilSquareIcon, // Biểu tượng bút chì dùng để chỉnh sửa
  PlusIcon, // Biểu tượng dấu cộng dùng để thêm danh mục
  TrashIcon, // Biểu tượng thùng rác dùng để xóa danh mục
} from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,
  Typography,
  CardBody,
  Button,
} from "@material-tailwind/react";
import Swal from "sweetalert2"; // Thư viện thông báo SweetAlert2
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCategory, // Hàm xóa danh mục
  getCategory, // Hàm lấy danh sách danh mục
  updateCategory, // Hàm cập nhật danh mục
} from "../../../redux/categorySlice";
import "../cruds/loading.css"; // Tệp CSS cho hiệu ứng loading
import { Link } from "react-router-dom";

const TABLE_HEAD = [
  "Mã ID", // Tiêu đề cột cho mã danh mục
  "Tên Danh Mục", // Tiêu đề cột cho tên danh mục
  "Slug", // Tiêu đề cột cho slug của danh mục
  "Ngày Tạo", // Tiêu đề cột cho ngày tạo danh mục
  "Ngày Sửa", // Tiêu đề cột cho ngày cập nhật danh mục
  "", // Cột trống để chứa các nút hành động
];

const ITEMS_PER_PAGE = 5; // Số lượng mục hiển thị mỗi trang

const CategoryMain = () => {
  const category = useSelector((state) => state.category.category); // Lấy danh sách danh mục từ Redux
  const isLoading = useSelector((state) => state.category.isLoading); // Kiểm tra trạng thái đang tải
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState(""); // State cho từ khóa tìm kiếm
  const [currentPage, setCurrentPage] = useState(1); // State cho trang hiện tại

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Đặt lại trang về đầu khi tìm kiếm
  };

  useEffect(() => {
    dispatch(getCategory()); // Gọi hàm lấy danh mục khi component tải
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteCategory(id)); // Gọi hàm xóa danh mục khi nhấn nút Xóa
  };

  const filteredCategory = category.filter(
    (item) =>
      item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())
  ); // Lọc danh mục theo từ khóa tìm kiếm
  const totalPages = Math.ceil(filteredCategory.length / ITEMS_PER_PAGE); // Tính tổng số trang
  const paginatedCategory = filteredCategory.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  ); // Lấy dữ liệu danh mục của trang hiện tại

  const handlePageChange = (page) => {
    setCurrentPage(page); // Chuyển trang khi nhấn nút phân trang
  };

  return (
    <div className="content-wrapper relative min-h-screen">
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
      <div className="flex">
        <Card className="w-full shadow-none">
          <CardHeader floated={false} shadow={false} className="rounded-none">
            <div className="mb-3 mt-3 flex flex-col justify-between gap-8 md:flex-row md:items-center">
              <div className="font-bold text-3xl">
                <h1>Quản Lý Danh Mục</h1>
              </div>
              <div className="flex w-full shrink-0 gap-2 md:w-max mr-3">
                <div className="flex items-center gap-5 w-[350px] h-[40px] border border-gray-200 rounded-lg py-4 px-4">
                  <input
                    type="text"
                    className="w-full outline-none bg-transparent text-xl"
                    placeholder="Nhập tên tìm kiếm..."
                    value={searchTerm}
                    onChange={handleSearch}
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
                <div className="h-14 ml-8">
                  <Link to="/addCategory">
                    <Button className="flex items-center p-4 justify-center text-xl gap-1 rounded-md h-11 bg-blue-500 w-29 hover:bg-blue-600">
                      <PlusIcon className="h-6 w-6" />
                      Thêm
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardBody className="px-2 container-fluid overflow-x-auto">
            <table className="w-full min-w-max table-auto text-left">
              <thead>
                <tr className="bg-blue-800 text-white">
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
                {paginatedCategory.length > 0 &&
                  paginatedCategory.map(
                    ({ _id, name, slug, createdAt, updatedAt }, index) => {
                      const isLast = index === paginatedCategory.length - 1;
                      const classes = isLast
                        ? "px-8 py-4 text-center"
                        : "px-8 py-4 border-b border-blue-gray-50 text-center";

                      return (
                        <tr key={_id}>
                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal text-xl"
                            >
                              {_id}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal text-xl"
                            >
                              {name}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal text-xl"
                            >
                              {slug}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal text-xl"
                            >
                              {new Date(createdAt).toLocaleDateString("en-GB")}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal text-xl"
                            >
                              {new Date(updatedAt).toLocaleDateString("en-GB")}
                            </Typography>
                          </td>
                          <td className={`${classes} text-center`}>
                            <Button
                              onClick={() => {
                                Swal.fire({
                                  title: "Cập nhật danh mục",
                                  html: `
                                    <input id="slug" class="swal2-input" placeholder="Slug" value="${slug}">
                                    <br />
                                    <input id="name" class="swal2-input" placeholder="Tên Danh Mục" type="text" value="${name}">
                                  `,
                                  showCancelButton: true,
                                  confirmButtonText: "Cập Nhật",
                                  cancelButtonText: "Hủy",
                                  customClass: {
                                    confirmButton:
                                      "bg-blue-500 hover:bg-blue-600 text-xl text-white font-bold py-2 px-4 rounded",
                                    cancelButton:
                                      "bg-red-500 hover:bg-red-600 text-xl text-white font-bold py-2 px-4 rounded ml-2",
                                  },
                                  preConfirm: () => {
                                    const slug =
                                      Swal.getPopup().querySelector(
                                        "#slug"
                                      ).value;
                                    const name =
                                      Swal.getPopup().querySelector(
                                        "#name"
                                      ).value;
                                    const id = _id;
                                    const data = { slug, name, id };
                                    dispatch(updateCategory({ data }));
                                  },
                                });
                              }}
                              className="inline-flex text-lg items-center gap-2 justify-center px-12 py-4 text-white bg-blue-500 rounded-lg h-[50px] w-[50px] mr-2"
                            >
                              <span>
                                <PencilSquareIcon className="h-4 w-4" />
                              </span>
                              <span>Sửa</span>
                            </Button>
                            <Button
                              onClick={() => handleDelete(_id)}
                              className="inline-flex text-lg items-center gap-2 justify-center px-12 py-4 text-white bg-red-500 rounded-lg h-[50px] w-[50px]"
                            >
                              <span>
                                <TrashIcon className="h-4 w-4" />
                              </span>
                              <span>Xóa</span>
                            </Button>
                          </td>
                        </tr>
                      );
                    }
                  )}
              </tbody>
            </table>
            {/* Phân trang */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-4">
                {Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className={`mx-1 px-4 py-2 rounded ${
                      index + 1 === currentPage
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default CategoryMain;
