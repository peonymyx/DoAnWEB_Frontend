import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";

const Message = () => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const auth = useSelector((state) => state.auth.currentUser);
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const chatBoxRef = useRef(null);

  // Khởi tạo kết nối socket
  useEffect(() => {
    // Kiểm tra nếu người dùng đã đăng nhập (có tên đăng nhập)
    if (auth?.username) {
      // Tạo kết nối mới với server socket, truyền tên người dùng vào query
      const newSocket = io("https://doanweb-api.onrender.com", {
        query: { username: auth.username },
      });

      // Lắng nghe sự kiện "connect" khi kết nối thành công
      newSocket.on("connect", () => {
        setIsConnected(true); // Đánh dấu trạng thái kết nối thành công
        console.log("Connected to socket server"); // In ra thông báo khi kết nối thành công
      });

      // Lắng nghe sự kiện "disconnect" khi mất kết nối
      newSocket.on("disconnect", () => {
        setIsConnected(false); // Đánh dấu trạng thái mất kết nối
        console.log("Disconnected from socket server"); // In ra thông báo khi mất kết nối
      });

      // Lưu socket vào state để sử dụng sau
      setSocket(newSocket);

      // Tải các tin nhắn đã lưu từ localStorage (nếu có)
      const savedMessages = localStorage.getItem(`messages_${auth.username}`);
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages)); // Chuyển đổi và thiết lập tin nhắn đã lưu
      }

      // Trả về hàm đóng kết nối khi component bị hủy
      return () => {
        newSocket.close(); // Đóng kết nối khi không còn cần thiết
      };
    }
  }, [auth?.username]); // Chạy lại khi username thay đổi

  // Xử lý tin nhắn đến
  useEffect(() => {
    // Kiểm tra nếu không có socket thì không làm gì cả
    if (!socket) return;

    // Hàm xử lý tin nhắn mới nhận được
    const messageHandler = (newMessage) => {
      console.log("Received message:", newMessage); // Log tin nhắn nhận được để kiểm tra

      // Cập nhật state messages với tin nhắn mới nếu chưa có
      setMessages((prevMessages) => {
        // Kiểm tra xem tin nhắn đã tồn tại trong danh sách chưa để tránh trùng lặp
        const messageExists = prevMessages.some(
          (msg) =>
            msg.id === newMessage.id ||
            (msg.text === newMessage.text &&
              msg.timestamp === newMessage.timestamp)
        );

        // Nếu tin nhắn đã tồn tại thì không thay đổi
        if (messageExists) return prevMessages;
        // Nếu chưa có thì thêm vào danh sách tin nhắn
        return [...prevMessages, newMessage];
      });
    };

    // Lắng nghe sự kiện "message" từ server
    socket.on("message", messageHandler);

    // Trả về hàm hủy sự kiện khi component bị hủy
    return () => {
      socket.off("message", messageHandler); // Hủy lắng nghe sự kiện "message"
    };
  }, [socket]); // Chạy lại khi socket thay đổi

  // Lưu tin nhắn vào localStorage
  useEffect(() => {
    // Kiểm tra nếu có username và danh sách tin nhắn không rỗng
    if (auth?.username && messages.length > 0) {
      // Lưu tin nhắn vào localStorage để giữ lại khi tải lại trang
      localStorage.setItem(
        `messages_${auth.username}`,
        JSON.stringify(messages)
      );
    }
  }, [messages, auth?.username]); // Chạy lại khi messages hoặc username thay đổi

  // Cuộn đến cuối khi có tin nhắn mới
  useEffect(() => {
    // Kiểm tra nếu có ref tới vị trí cuối danh sách tin nhắn
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); // Cuộn mượt tới cuối
  }, [messages]); // Chạy lại khi messages thay đổi

  // Hàm gửi tin nhắn
  const sendMessage = () => {
    // Kiểm tra nếu tin nhắn rỗng, không có socket hoặc chưa kết nối thì không gửi
    if (!message.trim() || !socket || !isConnected) return;

    // Tạo một đối tượng tin nhắn mới
    const newMessage = {
      id: Date.now().toString(), // ID là thời gian hiện tại để đảm bảo duy nhất
      text: message.trim(), // Nội dung tin nhắn
      role: "user", // Vai trò người dùng
      username: auth.username, // Tên người dùng
      timestamp: new Date().toISOString(), // Thời gian gửi tin nhắn
    };

    // Gửi tin nhắn tới server thông qua socket
    socket.emit("message", newMessage);
    setMessage(""); // Làm trống ô nhập tin nhắn
  };

  // Hàm xử lý khi nhấn phím Enter
  const handleKeyPress = (e) => {
    // Nếu nhấn Enter và không giữ Shift, gọi hàm gửi tin nhắn
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Ngừng hành động mặc định của Enter
      sendMessage(); // Gửi tin nhắn
    }
  };

  // Hàm để chuyển đổi hiển thị hộp chat (ẩn hoặc hiện)
  const toggleChat = () => {
    const chatBox = document.getElementById("chatBox");
    chatBox.classList.toggle("hidden"); // Thêm hoặc bỏ class "hidden" để ẩn/hiện hộp chat
  };

  if (!auth) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Toggle Button */}
      <button
        onClick={toggleChat}
        className="w-14 h-14 bg-blue-500 rounded-full text-white shadow-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
        aria-label="Toggle chat"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
      </button>

      {/* Chat Box */}
      <div
        id="chatBox"
        className="fixed bottom-20 right-0 w-full sm:w-96 h-[500px] bg-white rounded-lg shadow-xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="bg-blue-400 text-white p-4 flex justify-between items-center">
          <p className="text-xl font-bold">Chat</p>
          <button
            onClick={toggleChat}
            className="text-white hover:text-gray-200"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div ref={chatBoxRef} className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, index) => (
            <div
              key={msg.id || index}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                <p className="text-sm break-words">{msg.text}</p>
                <span className="text-xs opacity-75 mt-1 block">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t p-4">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập tin nhắn..."
              className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={sendMessage}
              disabled={!isConnected}
              className="bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
          {!isConnected && (
            <p className="text-red-500 text-sm mt-2">Đang kết nối lại...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
