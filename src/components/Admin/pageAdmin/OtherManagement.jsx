import { Link } from "react-router-dom"; // Import Link từ react-router-dom để tạo các liên kết điều hướng
import Swal from "sweetalert2"; // Import thư viện SweetAlert2 để hiển thị các popup thông báo
import {
  CardBody,
  Card,
  CardHeader,
  Typography,
} from "@material-tailwind/react"; // Import các thành phần giao diện từ thư viện Material Tailwind
import { useEffect, useState } from "react"; // Import hook useEffect và useState từ React
import { useDispatch, useSelector } from "react-redux"; // Import hook useDispatch và useSelector từ Redux để tương tác với store
import { getOther, updateStatusOder } from "../../../redux/otherSlice"; // Import các action từ Redux để lấy dữ liệu và cập nhật trạng thái đơn hàng
import "../cruds/loading.css"; // Import file CSS để hiển thị loading
import { CSVLink } from "react-csv"; // Import CSVLink từ thư viện react-csv để xuất dữ liệu ra file CSV

// Định nghĩa các tiêu đề của bảng
const TABLE_HEAD = [
  "ID",
  "Thời gian đặt",
  "Tên người nhận",
  "Số điện thoại",
  "Địa chỉ",
  "Trạng thái",
  "Ghi chú",
  "",
  "",
];

// Số lượng đơn hàng hiển thị trên mỗi trang
const ITEMS_PER_PAGE = 5;

const OtherManagement = () => {
  const dispatch = useDispatch(); // Tạo đối tượng dispatch để gửi action tới Redux store
  const other = useSelector((state) => state.other.other); // Lấy dữ liệu đơn hàng từ Redux store
  console.log("other", other); // In dữ liệu đơn hàng ra console

  // Chuyển đổi dữ liệu từ Redux thành dữ liệu cho file CSV
  const csvData = other.map((item) => ({
    _id: item._id,
    username: item.username,
    phone_number: item.phone_number,
    address: item.address,
    note: item.note,
    status: item.status,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    cart: JSON.stringify(
      item.cart.map((cartItem) => ({
        name: cartItem.name,
        quantity: cartItem.quantity,
        price: cartItem.price,
      }))
    ),
  }));

  // State để lưu trữ từ khóa tìm kiếm và trang hiện tại
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Gọi action getOther để lấy tất cả đơn hàng khi component được render lần đầu
  useEffect(() => {
    dispatch(getOther());
  }, [dispatch]);

  // Hàm xử lý tìm kiếm
  const handleSearch = (e) => {
    setSearchTerm(e.target.value); // Cập nhật từ khóa tìm kiếm
    setCurrentPage(1); // Đặt lại trang hiện tại về 1 sau khi tìm kiếm
  };

  // Hàm xử lý cập nhật trạng thái đơn hàng
  const handleUpdateStatus = (id) => {
    Swal.fire({
      title: "Cập nhật trạng thái", // Tiêu đề của popup
      input: "select", // Loại input là select (chọn trạng thái)
      inputOptions: {
        "Chưa xử lý": "Chưa xử lý",
        "Đang xử lý": "Đang xử lý",
        "Đã hoàn thành": "Đã hoàn thành",
      },
      inputPlaceholder: "Chọn trạng thái", // Placeholder khi không có lựa chọn
      showCancelButton: true, // Hiển thị nút hủy
      confirmButtonText: "Lưu", // Nút xác nhận
      cancelButtonText: "Hủy", // Nút hủy
    }).then((result) => {
      if (result.isConfirmed) {
        const data = {
          id: id,
          status: result.value, // Lấy giá trị trạng thái người dùng chọn
        };
        dispatch(updateStatusOder(data)); // Gửi action cập nhật trạng thái đơn hàng
      }
    });
  };

  // Lọc danh sách đơn hàng theo từ khóa tìm kiếm (theo tên người nhận hoặc số điện thoại)
  const filteredOther = Array.isArray(other)
    ? other.filter(
        (item) =>
          item.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.phone_number.includes(searchTerm)
      )
    : [];

  // Tính số trang cần thiết cho phân trang
  const totalPages = Math.ceil(filteredOther.length / ITEMS_PER_PAGE);

  // Lọc các đơn hàng trong phạm vi trang hiện tại
  const paginatedOther = filteredOther.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Hàm thay đổi trang
  const handlePageChange = (page) => {
    setCurrentPage(page); // Cập nhật trang hiện tại
  };

  return (
    <div className="flex">
      <Card className="w-full shadow-none">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-3 mt-3 flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div className="font-bold text-3xl">
              <h1>Quản Lý Đơn hàng</h1>
            </div>
            <div className="flex w-full shrink-0 gap-2 md:w-max mr-3">
              {/* Phần input tìm kiếm */}
              <div className="flex items-center gap-5 w-[350px] h-[40px] border border-gray-200 rounded-lg py-4 px-4">
                <input
                  type="text"
                  className="w-full outline-none bg-transparent text-xl"
                  placeholder="Nhập tên tìm kiếm..."
                  value={searchTerm}
                  onChange={handleSearch} // Gọi hàm tìm kiếm khi người dùng nhập
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
            </div>
            {/* Nút xuất dữ liệu ra file CSV */}
            <CSVLink
              id="test-table-xls-button"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full"
              data={csvData}
              filename="hoa-don.csv"
            >
              Xuất Excel
            </CSVLink>
          </div>
        </CardHeader>
        <CardBody className="px-2 container-fluid overflow-x-auto">
          <table
            id="otherTable"
            className="w-full min-w-max table-auto text-left"
          >
            <thead>
              <tr className="bg-blue-800 text-white">
                {/* Hiển thị tiêu đề của bảng */}
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
              {/* Lặp qua các đơn hàng đã phân trang và hiển thị dữ liệu */}
              {paginatedOther.map(
                (
                  {
                    _id,
                    createdAt,
                    username,
                    phone_number,
                    address,
                    note,
                    status,
                  },
                  index
                ) => {
                  const isLast = index === paginatedOther.length - 1;
                  const classes = isLast
                    ? "px-8 py-4 text-center"
                    : "px-8 py-4 border-b border-blue-gray-50 text-center";

                  return (
                    <tr key={_id}>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-bold text-xl"
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
                          {new Date(createdAt).toLocaleDateString("en-GB")}{" "}
                          {/* Hiển thị ngày tháng */}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal text-xl"
                        >
                          {username}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal text-xl"
                        >
                          {phone_number}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal text-xl"
                        >
                          {address}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal text-xl"
                        >
                          {status}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal text-xl w-[160px]"
                        >
                          {note}
                        </Typography>
                      </td>
                      {/* Các nút cập nhật trạng thái và chi tiết */}
                      <td className={classes}>
                        <button
                          className="mr-3 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-full"
                          onClick={() => handleUpdateStatus(_id)} // Gọi hàm cập nhật trạng thái
                        >
                          Cập nhật
                        </button>
                        <Link to={`/otherdetails/${_id}`}>
                          <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full">
                            Chi tiết
                          </button>
                        </Link>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </CardBody>
        {/* Phần phân trang */}
        <div className="sticky bottom-0 right-0 flex justify-end p-4 bg-white">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`mx-1 px-3 py-1 rounded ${
                currentPage === page ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default OtherManagement; // Xuất component ra để sử dụng
