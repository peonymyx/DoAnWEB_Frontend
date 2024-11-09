import { TrashIcon } from "@heroicons/react/24/solid";
import {
  CardBody,
  Button,
  Card,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../cruds/loading.css";
import { getComment, deleteCommentByAuthor } from "../../../redux/commentSlice";
import Swal from "sweetalert2";

// Định nghĩa tiêu đề bảng
const TABLE_HEAD = [
  "Mã ID",
  "Tên",
  "Nội dung",
  "Tên Sản phẩm",
  "Ngày đăng",
  "", // Cột rỗng để chứa nút hành động (xóa)
];

// Số lượng bình luận hiển thị mỗi trang
const ITEMS_PER_PAGE = 5;

const CommentManagement = () => {
  // Khai báo các biến cần thiết
  const dispatch = useDispatch(); // Khởi tạo dispatch để gọi action
  const isLoading = useSelector((state) => state.user.isLoading); // Kiểm tra trạng thái tải dữ liệu
  const comment = useSelector((state) => state.comment.comment); // Lấy danh sách bình luận từ store
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại

  useEffect(() => {
    dispatch(getComment()); // Gọi action getComment khi component mount
  }, [dispatch]);

  // Hàm xử lý xóa bình luận
  const handleDelete = (id) => {
    return () => {
      // Hiển thị hộp thoại xác nhận trước khi xóa
      Swal.fire({
        title: "Bạn có chắc chắn muốn xóa bình luận này?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
      }).then((result) => {
        if (result.isConfirmed) {
          dispatch(deleteCommentByAuthor(id)); // Gọi action xóa bình luận
        }
      });
    };
  };

  // Tính tổng số trang
  const totalPages = Math.ceil(comment.length / ITEMS_PER_PAGE);
  // Tách danh sách bình luận theo trang
  const paginatedComments = comment.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Hàm thay đổi trang
  const handlePageChange = (page) => {
    setCurrentPage(page); // Thay đổi trang hiện tại
  };

  return (
    <div className="relative min-h-screen">
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>{" "}
          {/* Hiển thị loading spinner khi đang tải */}
        </div>
      )}
      <div className="flex">
        <Card className="w-full shadow-none">
          <CardHeader floated={false} shadow={false} className="rounded-none">
            <div className="mb-3 mt-3 flex flex-col justify-center gap-8 md:flex-row md:items-center">
              <div className="font-bold text-3xl">
                <h1>Quản Lý Bình Luận</h1> {/* Tiêu đề trang */}
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
                        {head} {/* Hiển thị tiêu đề cột */}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedComments.length > 0 &&
                  paginatedComments.map(
                    (
                      { _id, createdAt, user_id, product_id, content },
                      index
                    ) => {
                      // Kiểm tra nếu là dòng cuối cùng trong bảng để thêm border
                      const isLast = index === paginatedComments.length - 1;
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
                              {_id} {/* Hiển thị mã ID bình luận */}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal text-xl"
                            >
                              {user_id?.username}{" "}
                              {/* Hiển thị tên người dùng */}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal text-xl"
                            >
                              {content} {/* Hiển thị nội dung bình luận */}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal text-xl"
                            >
                              {product_id?.name} {/* Hiển thị tên sản phẩm */}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal text-xl"
                            >
                              {new Date(createdAt).toLocaleDateString("en-GB")}{" "}
                              {/* Hiển thị ngày đăng */}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Button
                              className="inline-flex items-center gap-2 justify-center px-8 py-4 text-white bg-red-500 rounded-lg h-[50px] w-[70px]"
                              onClick={handleDelete(_id)} // Gọi hàm xóa bình luận khi nhấn nút
                            >
                              <span>
                                <TrashIcon className="h-5 w-5" />{" "}
                                {/* Biểu tượng thùng rác */}
                              </span>
                              <span>Xóa</span> {/* Nút xóa */}
                            </Button>
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
                onClick={() => handlePageChange(page)} // Gọi hàm thay đổi trang khi nhấn
                className={`mx-1 px-3 py-1 rounded ${
                  currentPage === page
                    ? "bg-blue-500 text-white" // Trang hiện tại sẽ có màu nền khác
                    : "bg-gray-200"
                }`}
              >
                {page} {/* Hiển thị số trang */}
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CommentManagement;
