import { useEffect } from "react"; // Import hook useEffect của React để xử lý các side-effect
import { useDispatch, useSelector } from "react-redux"; // Import useDispatch và useSelector từ Redux để tương tác với store Redux
import { getOtherById, selectSelectedOther } from "../../../redux/otherSlice"; // Import các action và selector từ slice khác trong Redux
import { useParams } from "react-router-dom"; // Import useParams từ react-router-dom để lấy tham số URL
import jsPDF from "jspdf"; // Import thư viện jsPDF để tạo file PDF
import html2canvas from "html2canvas"; // Import thư viện html2canvas để chụp ảnh màn hình HTML và chuyển thành hình ảnh

const OtherDetails = () => {
  const dispatch = useDispatch(); // Tạo đối tượng dispatch để gọi action từ Redux
  const { id } = useParams(); // Lấy tham số "id" từ URL

  useEffect(() => {
    // Sử dụng useEffect để gọi action getOtherById khi component được render lần đầu
    dispatch(getOtherById(id));
  }, [dispatch, id]); // Hook này sẽ được gọi lại nếu id thay đổi

  const other = useSelector(selectSelectedOther); // Lấy dữ liệu chi tiết đối tượng (other) từ Redux store

  if (!other) {
    return <div className="p-4">Loading...</div>; // Nếu chưa có dữ liệu (other), hiển thị Loading
  }

  // Tính tổng giá trị đơn hàng
  const totalPrice = other.cart
    ? other.cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
    : 0;

  // Hàm xuất hóa đơn dưới dạng PDF
  const exportPDF = () => {
    const input = document.getElementById("invoice"); // Lấy phần tử HTML có id="invoice" để chuyển thành PDF
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/jpeg", 1.0); // Chuyển canvas thành hình ảnh
      const pdf = new jsPDF("p", "mm", "a4"); // Khởi tạo đối tượng jsPDF (PDF kiểu dọc, đơn vị mm, khổ A4)
      const pdfWidth = pdf.internal.pageSize.getWidth(); // Lấy chiều rộng của trang PDF
      const pdfHeight = pdf.internal.pageSize.getHeight(); // Lấy chiều cao của trang PDF
      const imgWidth = canvas.width; // Lấy chiều rộng của ảnh canvas
      const imgHeight = canvas.height; // Lấy chiều cao của ảnh canvas
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight); // Tính tỷ lệ sao cho ảnh vừa vặn với trang PDF
      const imgX = (pdfWidth - imgWidth * ratio) / 2; // Tính tọa độ X của ảnh để căn giữa
      const imgY = 30; // Tọa độ Y của ảnh

      // Thêm hình ảnh vào PDF
      pdf.addImage(
        imgData,
        "JPEG",
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      );
      pdf.save(`invoice_${other._id}.pdf`); // Lưu PDF với tên hóa đơn là _id của đối tượng
    });
  };

  return (
    <div className="content-wrapper overflow-x-auto">
      <div className="content-header">
        <div
          className="bg-white p-6 rounded-lg shadow-md mx-auto"
          style={{ minWidth: "768px", maxWidth: "1024px" }}
        >
          {/* Định dạng cho hóa đơn */}
          <div className="invoice-container mb-5" id="invoice">
            <div className="invoice-wrap">
              <div className="invoice-inner">
                <div className="invoice-address pt-8 border-t-4 border-double border-black">
                  <table className="w-full">
                    <tbody>
                      <tr>
                        <td colSpan="2" className="text-center">
                          <div className="mce-content-body">
                            <p className="text-3xl font-bold mb-4">Hóa Đơn</p>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        {/* Địa chỉ người nhận hóa đơn */}
                        <td className="w-1/2">
                          <table>
                            <tbody>
                              <tr>
                                <td className="text-lg font-bold">
                                  Hóa đơn tới:
                                </td>
                                <td>
                                  <div className="client_info pl-5">
                                    <p className="text-lg">
                                      {/* Hiển thị thông tin người nhận hóa đơn */}
                                      <strong>{other.username}</strong>
                                      <br />
                                      {other.address}
                                      <br />
                                      {other.phone_number}
                                    </p>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                        {/* Thông tin về hóa đơn (số hóa đơn và ngày tạo hóa đơn) */}
                        <td className="w-1/2 text-right">
                          <table className="ml-auto">
                            <tbody className="text-lg">
                              <tr>
                                <td className="font-bold">Hóa đơn số:</td>
                                <td className="pl-5">{other._id}</td>
                              </tr>
                              <tr>
                                <td className="font-bold">Ngày:</td>
                                <td className="pl-5">
                                  {/* Định dạng ngày tháng năm */}
                                  {new Date(other.createdAt).toLocaleDateString(
                                    "vi-VN",
                                    {
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "numeric",
                                    }
                                  )}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Danh sách các sản phẩm trong đơn hàng */}
                <div id="items-list" className="mt-8">
                  <table className="table-auto w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="p-2 text-center">Tên Sản Phẩm</th>
                        <th className="p-2 text-center">Số Lượng</th>
                        <th className="p-2 text-center">Đơn Giá</th>
                        <th className="p-2 text-center">Size</th>
                        <th className="p-2 text-center">Thành Tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Lặp qua từng sản phẩm trong giỏ hàng và hiển thị thông tin */}
                      {other.cart &&
                        other.cart.map((item, index) => (
                          <tr key={index} className="border-t">
                            <td className="p-2">{item.name}</td>
                            <td className="p-2 text-center">{item.quantity}</td>
                            <td className="p-2 text-right">
                              {/* Định dạng tiền tệ cho đơn giá */}
                              {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format(item.price)}
                            </td>
                            <td className="p-2 text-center">{item.size}</td>
                            <td className="p-2 text-right">
                              {/* Tính thành tiền và định dạng tiền tệ */}
                              {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format(item.price * item.quantity)}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                    {/* Hiển thị tổng tiền */}
                    <tfoot>
                      <tr className="border-t-2 border-black">
                        <td colSpan="3"></td>
                        <td className="p-2 font-bold text-right">Tổng Tiền</td>
                        <td className="p-2 text-right font-bold">
                          {/* Định dạng tiền tệ cho tổng tiền */}
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(totalPrice)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Nút bấm để xuất PDF */}
          <button
            onClick={exportPDF} // Gọi hàm exportPDF khi bấm nút
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full"
          >
            Xuất PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtherDetails;
