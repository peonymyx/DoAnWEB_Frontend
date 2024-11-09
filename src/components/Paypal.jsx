import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { useEffect } from "react";
import { addOther } from "../redux/otherSlice";
import { useDispatch } from "react-redux";

const style = { layout: "vertical" };

// ButtonWrapper là một component hiển thị nút thanh toán PayPal và xử lý các logic liên quan đến thanh toán
// eslint-disable-next-line react/prop-types
const ButtonWrapper = ({ currency, showSpinner, amount, payload }) => {
  // Lấy các trạng thái và phương thức từ PayPalScriptReducer, điều này giúp quản lý trạng thái của PayPal Buttons
  const [{ isPending, options }, dispatch] = usePayPalScriptReducer();

  // In ra payload để kiểm tra giá trị
  console.log(payload);

  // useEffect này sẽ cập nhật lại các tùy chọn PayPal khi currency, amount, hoặc payload thay đổi
  useEffect(() => {
    // Dispatch hành động resetOptions để cập nhật lại các tùy chọn (options) của PayPal
    dispatch({
      type: "resetOptions", // Hành động 'resetOptions' sẽ được gọi
      value: {
        ...options, // Giữ lại các giá trị cũ của options
        currency, // Cập nhật lại tiền tệ (currency)
      },
    });
  }, [currency, amount, payload]); // useEffect này chạy mỗi khi currency, amount hoặc payload thay đổi

  // Lấy dispatch từ Redux để gửi hành động đến store.
  const dispatchs = useDispatch();

  return (
    <>
      {/* Nếu showSpinner là true và isPending là true (chưa xử lý xong), hiển thị spinner (vòng tròn quay) */}
      {showSpinner && isPending && <div className="spinner" />}
      {/* Hiển thị nút PayPal */}
      <PayPalButtons
        style={style} // Thiết lập kiểu dáng cho nút
        disabled={false} // Nút không bị vô hiệu hóa
        forceReRender={[style, currency, amount]} // Buộc PayPal Buttons re-render khi style, currency hoặc amount thay đổi
        fundingSource={undefined} // Không chỉ định nguồn tài trợ cụ thể
        createOrder={(data, actions) => {
          // Hàm này sẽ được gọi để tạo đơn hàng PayPal
          return actions.order
            .create({
              purchase_units: [
                {
                  amount: {
                    value: amount, // Số tiền cần thanh toán
                    currency_code: currency, // Mã tiền tệ
                  },
                },
              ],
            })
            .then((orderID) => {
              // Trả về orderID sau khi tạo đơn hàng thành công
              return orderID;
            });
        }}
        onApprove={(data, actions) => {
          // Hàm này được gọi khi người dùng chấp nhận thanh toán
          actions.order.capture().then(async (details) => {
            // Sau khi thanh toán thành công, thực hiện hành động sau khi giao dịch hoàn thành
            dispatchs(
              await addOther({
                ...payload, // Truyền dữ liệu payload vào Redux action
              })
            );
            // Hiển thị thông báo thành công
            alert(
              "Chúc mừng bạn đã thanh toán thành công" +
                details.payer.name.given_name
            );
            // Xóa hết dữ liệu trong localStorage sau khi thanh toán thành công
            localStorage.clear();
          });
        }}
      />
    </>
  );
};

// Paypal là component chính, quản lý việc cung cấp các tùy chọn PayPal và truyền dữ liệu cho ButtonWrapper.
// eslint-disable-next-line react/prop-types
export default function Paypal({ amount, payload }) {
  return (
    <div style={{ maxWidth: "750px", minHeight: "200px" }}>
      {/* Cung cấp cấu hình cho PayPal (clientId, components, currency) thông qua PayPalScriptProvider */}
      <PayPalScriptProvider
        options={{ clientId: "test", components: "buttons", currency: "USD" }}
      >
        {/* Truyền các prop (payload, currency, amount, showSpinner) vào ButtonWrapper */}
        <ButtonWrapper
          payload={payload} // Dữ liệu payload sẽ được truyền vào ButtonWrapper
          currency={"USD"} // Tiền tệ là USD
          amount={amount} // Số tiền cần thanh toán
          showSpinner={false} // Không hiển thị spinner
        />
      </PayPalScriptProvider>
    </div>
  );
}
