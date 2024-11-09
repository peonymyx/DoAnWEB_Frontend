import { useEffect, useState } from "react"; // Import các hook cần thiết từ React
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Input,
} from "@material-tailwind/react"; // Import các component từ Material Tailwind
import SendIcon from "@mui/icons-material/Send"; // Import icon gửi tin nhắn từ MUI
import io from "socket.io-client"; // Import socket.io-client để kết nối socket

// Tạo kết nối socket với server tại localhost cổng 3000
const socket = io("https://doanweb-api.onrender.com");

// eslint-disable-next-line react/prop-types
const Message = ({ role }) => {
  // Khai báo state `message` để lưu trữ nội dung tin nhắn hiện tại
  const [message, setMessage] = useState("");
  // Khai báo state `messages` để lưu trữ tất cả các tin nhắn, khởi tạo từ localStorage hoặc mảng rỗng
  const [messages, setMessages] = useState(
    JSON.parse(localStorage.getItem("lastMessage")) || []
  );

  useEffect(() => {
    // Lắng nghe sự kiện "message" từ server, mỗi khi nhận tin nhắn mới sẽ cập nhật `messages`
    socket.on("message", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]); // Thêm tin nhắn mới vào danh sách tin nhắn
      // Lưu trữ tin nhắn vào localStorage
      localStorage.setItem(
        "lastMessage",
        JSON.stringify([...messages, newMessage])
      );
    });

    // Dọn dẹp kết nối khi component bị huỷ, ngừng lắng nghe sự kiện "message"
    return () => socket.off("message");
  }, [messages]);

  // Hàm gửi tin nhắn
  const sendMessage = () => {
    if (message.trim()) {
      // Kiểm tra xem tin nhắn không rỗng
      const newMessage = {
        text: message, // Nội dung tin nhắn
        role: role, // Vai trò của người gửi (admin/user)
        timestamp: Date.now(), // Thời gian gửi tin nhắn
      };

      socket.emit("message", newMessage); // Gửi tin nhắn qua socket đến server
      setMessage(""); // Xóa nội dung input sau khi gửi
    }
  };

  return (
    <div className="flex h-[760px] sm:h-[580px] justify-center items-center">
      {/* Card chính chứa toàn bộ giao diện */}
      <Card className="w-full sm:w-[700px] md:w-[900px] lg:w-[1100px] shadow-lg">
        <CardHeader className="content-header bg-cyan-600 text-white">
          <h1 className="font-bold text-3xl text-center p-4">
            Tư Vấn Trực Tiếp
          </h1>
        </CardHeader>
        <CardBody className="flex flex-col md:flex-row">
          {/* Sidebar hiển thị thông tin người dùng */}
          <div className="list-user w-full md:w-64 bg-slate-400 rounded-r-lg p-4 mb-5 md:mb-0">
            <p className="text-white text-2xl font-semibold">Người Dùng</p>
            <p className="text-lg">
              {/* Hiển thị username của tin nhắn gần nhất */}
              {localStorage.getItem("lastMessage")
                ? JSON.parse(localStorage.getItem("lastMessage"))[0]?.username
                : ""}
            </p>
          </div>
          {/* Khu vực hiển thị tin nhắn */}
          <div className="message-box flex-grow ml-0 md:ml-4">
            <div className="chat-window h-96 max-h-96 overflow-y-auto bg-white rounded-lg shadow-lg p-4">
              {/* Duyệt qua mảng `messages` để hiển thị từng tin nhắn */}
              {messages.map((item, index) => {
                const formattedTime = new Date(item.timestamp).toLocaleString(); // Định dạng thời gian gửi tin nhắn
                if (item.role === "user") {
                  // Kiểm tra vai trò của người gửi
                  return (
                    <div key={index} className="flex justify-start mb-2">
                      <div className="bg-slate-300 text-black rounded-md p-2 text-xl">
                        {item.text}
                      </div>
                    </div>
                  );
                } else if (item.role === "admin") {
                  // Kiểm tra tin nhắn của admin
                  return (
                    <div key={index} className="flex justify-end mb-2">
                      <div className="bg-blue-300 text-black rounded-md p-2 text-xl">
                        {item.text}
                        <br />
                        <small className="text-gray-500">{formattedTime}</small>
                      </div>
                    </div>
                  );
                } else {
                  // Tin nhắn khác, hiển thị như tin nhắn của admin
                  return (
                    <div key={index} className="flex justify-end mb-2">
                      <div className="bg-blue-300 text-black rounded-md p-2 text-xl">
                        {item.text}
                        <br />
                        <small className="text-gray-500">{formattedTime}</small>
                      </div>
                    </div>
                  );
                }
              })}
            </div>
            {/* Ô nhập tin nhắn và nút gửi */}
            <div className="chat-input flex mt-4">
              <Input
                onChange={(e) => setMessage(e.target.value)} // Cập nhật state `message` khi nhập tin nhắn
                type="text"
                value={message} // Giá trị hiện tại của `message`
                placeholder="Enter your message"
                className="flex-grow rounded-lg py-2 px-4 text-xl outline-none focus:border-cyan-500"
              />
              <Button
                onClick={sendMessage} // Gọi hàm `sendMessage` khi nhấn nút gửi
                className="bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 ml-2"
              >
                <SendIcon /> {/* Icon gửi tin nhắn */}
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Message; // Xuất component `Message` ra để sử dụng ở nơi khác
