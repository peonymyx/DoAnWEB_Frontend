import { useState } from "react";

// Hook `useSessionStorage` để lưu trữ giá trị vào sessionStorage với một key cụ thể.
const useSessionStorage = (key, initialValue) => {
  // Khởi tạo `storedValue` bằng cách sử dụng `useState`.
  // Giá trị khởi tạo của `storedValue` được xác định qua hàm callback.
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Lấy giá trị đã lưu trữ trong sessionStorage với key truyền vào.
      const item = sessionStorage.getItem(key);
      // Kiểm tra nếu `item` tồn tại trong sessionStorage thì parse giá trị từ JSON.
      // Nếu không có `item`, trả về `initialValue` (giá trị mặc định).
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // Xử lý lỗi khi có vấn đề trong quá trình lấy hoặc parse `item`.
      console.log(error);
      // Trả về `initialValue` trong trường hợp xảy ra lỗi.
      return initialValue;
    }
  });

  // Hàm `setValue` dùng để cập nhật `storedValue` và lưu vào sessionStorage.
  const setValue = (value) => {
    try {
      // Kiểm tra `value` có phải là một hàm không.
      // Nếu đúng, gọi hàm đó với tham số là `storedValue` hiện tại và lưu kết quả.
      // Nếu không, gán `value` trực tiếp.
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      // Cập nhật `storedValue` trong `useState` với `valueToStore`.
      setStoredValue(valueToStore);

      // Lưu `valueToStore` vào sessionStorage dưới dạng JSON string với `key`.
      sessionStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // Xử lý lỗi khi có vấn đề trong quá trình lưu `valueToStore` vào sessionStorage.
      console.log(error);
    }
  };

  // Trả về mảng gồm `storedValue` và `setValue`.
  // `storedValue` là giá trị hiện tại lấy từ sessionStorage hoặc `initialValue`.
  // `setValue` là hàm để cập nhật `storedValue` và lưu giá trị vào sessionStorage.
  return [storedValue, setValue];
};

export default useSessionStorage;
