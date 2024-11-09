import { useEffect, useState } from "react"; // Import các hook của React để quản lý hiệu ứng và trạng thái
import {
  Card,
  CardHeader,
  Typography,
  CardBody,
  Button,
} from "@material-tailwind/react"; // Import các component từ thư viện Material Tailwind
import { PencilSquareIcon } from "@heroicons/react/24/solid"; // Import icon chỉnh sửa
import { useDispatch, useSelector } from "react-redux"; // Import các hook của Redux để dispatch action và lấy state
import { getUsers, updateRoleUser } from "../../../redux/userSlice"; // Import action để lấy danh sách user và cập nhật quyền
import Swal from "sweetalert2"; // Import thư viện Sweetalert2 để hiển thị popup thông báo

// Khai báo tiêu đề cho các cột trong bảng
const TABLE_HEAD = [
  "Tên",
  "Số Điện Thoại",
  "Giới Tính",
  "Ngày Sinh",
  "Ngày Sửa",
  "Vai Trò",
  "",
];

const ITEMS_PER_PAGE = 5; // Số lượng phần tử hiển thị trên mỗi trang

const AccountManagement = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.users || []); // Lấy danh sách người dùng từ Redux store
  const isLoading = useSelector((state) => state.user.isLoading); // Kiểm tra xem có đang tải dữ liệu hay không
  const auth = useSelector((state) => state.auth.currentUser); // Lấy thông tin người dùng hiện tại
  const [searchTerm, setSearchTerm] = useState(""); // Khai báo trạng thái cho từ khóa tìm kiếm
  const [currentPage, setCurrentPage] = useState(1); // Khai báo trạng thái cho trang hiện tại

  // Xử lý khi tìm kiếm, cập nhật từ khóa và đặt lại trang hiện tại về 1
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset trang về đầu khi tìm kiếm
  };

  // Lọc người dùng theo từ khóa tìm kiếm
  const filteredUser = users.filter((v) =>
    v.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Tính số trang và cắt dữ liệu người dùng theo trang hiện tại
  const totalPages = Math.ceil(filteredUser.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUser.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Gọi API lấy dữ liệu người dùng khi component được render lần đầu
  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  // Hàm cập nhật quyền người dùng với popup lựa chọn vai trò
  const handlePermission = (id) => {
    return () => {
      Swal.fire({
        title: "Cập nhật quyền",
        input: "select",
        inputOptions: {
          user: "user",
          admin: "admin",
          nhanvien: "nhanvien",
        },
        inputPlaceholder: "Chọn quyền",
        showCancelButton: true,
        confirmButtonText: "Lưu",
        cancelButtonText: "Hủy",
      }).then((result) => {
        if (result.isConfirmed) {
          const data = {
            id: id,
            role: result.value,
          };
          dispatch(updateRoleUser(data));
        }
      });
    };
  };

  // Chuyển trang và cập nhật trạng thái trang hiện tại
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Kiểm tra nếu người dùng hiện tại không phải là admin thì không hiển thị component này
  if (auth.role !== "admin") {
    return null;
  }

  return (
    <div className="relative min-h-screen">
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
                <h1>Quản Lý Tài Khoản</h1> {/* Tiêu đề của trang */}
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
                    {/* Icon tìm kiếm */}
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
                {paginatedUsers.map(
                  (
                    { _id, username, phone, gender, age, updatedAt, role },
                    index
                  ) => {
                    const isLast = index === paginatedUsers.length - 1;
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
                            {username}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal text-xl"
                          >
                            {phone}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal text-xl"
                          >
                            {gender}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal text-xl"
                          >
                            {new Date(age).toLocaleDateString("en-GB")}
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
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal text-xl"
                          >
                            {role}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Button
                            className="inline-flex items-center gap-2 justify-center text-white bg-blue-500 outline rounded-lg h-[50px] w-[120px]"
                            onClick={handlePermission(_id)}
                          >
                            <span>
                              <PencilSquareIcon className="h-4 w-4" />
                            </span>
                            <span className="text-lg">Phân Quyền</span>
                          </Button>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </CardBody>
          {/* Thanh phân trang */}
          <div className="sticky bottom-0 right-0 flex justify-end p-4 bg-white">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
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

export default AccountManagement;
