import { createSlice } from "@reduxjs/toolkit";
import Swal from "sweetalert2";

// Khởi tạo trạng thái ban đầu cho slice giỏ hàng
const initialState = {
  // Kiểm tra xem có giỏ hàng trong localStorage không, nếu có thì lấy ra, nếu không thì gán giỏ hàng rỗng
  cart: localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart")) // Nếu có giỏ hàng trong localStorage, lấy dữ liệu và chuyển thành object
    : [], // Nếu không có, gán giỏ hàng là mảng rỗng
  isLoading: false, // Trạng thái đang tải dữ liệu
  error: null, // Trạng thái lỗi
};

// Tạo slice cho giỏ hàng
const cartSlice = createSlice({
  name: "cart", // Tên slice là 'cart'
  initialState, // Trạng thái ban đầu của slice
  reducers: {
    // Các reducer xử lý hành động với giỏ hàng
    // Hành động thêm sản phẩm vào giỏ hàng
    addToCart: (state, action) => {
      // Tìm sản phẩm có cùng ID và cùng size trong giỏ hàng
      const index = state.cart.findIndex(
        (item) =>
          item.product_id === action.payload.product_id && // So sánh theo product_id
          item.size === action.payload.size // So sánh theo size
      );

      if (index >= 0) {
        // Nếu tìm thấy sản phẩm cùng ID và cùng size, tăng số lượng của sản phẩm đó
        state.cart[index].quantity += 1;
      } else {
        // Nếu không tìm thấy, thêm sản phẩm mới vào giỏ hàng với số lượng ban đầu là 1
        state.cart.push({ ...action.payload, quantity: 1 });
        // Hiển thị thông báo thành công bằng SweetAlert
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Thêm thành công", // Tiêu đề thông báo
          showConfirmButton: false, // Không hiển thị nút xác nhận
          timer: 1500, // Thời gian hiển thị thông báo (1500ms)
        });
      }
      // Lưu giỏ hàng vào localStorage sau khi thay đổi
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },

    // Hành động tăng số lượng sản phẩm trong giỏ hàng
    incrementQuantity: (state, action) => {
      // Tách product_id và size từ action.payload
      const parts = action.payload.split("-");

      const productId = parts[0]; // Lấy product_id
      const size = parts[1]; // Lấy size

      // Tìm sản phẩm trong giỏ hàng dựa trên product_id và size
      const index = state.cart.findIndex(
        (item) => item.product_id === productId && item.size === size
      );

      if (index >= 0) {
        // Nếu tìm thấy, tăng số lượng sản phẩm
        state.cart[index].quantity += 1;
        // Lưu giỏ hàng vào localStorage
        localStorage.setItem("cart", JSON.stringify(state.cart));
      }
    },

    // Hành động giảm số lượng sản phẩm trong giỏ hàng
    decrementQuantity: (state, action) => {
      // Tách product_id và size từ action.payload
      const parts = action.payload.split("-");

      const productId = parts[0]; // Lấy product_id
      const size = parts[1]; // Lấy size

      // Tìm sản phẩm trong giỏ hàng dựa trên product_id và size
      const index = state.cart.findIndex(
        (item) => item.product_id === productId && item.size === size
      );

      if (index >= 0) {
        // Nếu số lượng sản phẩm lớn hơn 1, giảm số lượng đi 1
        if (state.cart[index].quantity > 1) {
          state.cart[index].quantity -= 1;
        }
        // Lưu giỏ hàng vào localStorage
        localStorage.setItem("cart", JSON.stringify(state.cart));
      }
    },

    // Hành động xóa sản phẩm khỏi giỏ hàng
    removeCart: (state, action) => {
      // Tách product_id và size từ action.payload
      const parts = action.payload.split("-");
      console.log(parts); // In ra mảng parts chứa product_id và size

      const productId = parts[0]; // Lấy product_id
      const size = parts[1]; // Lấy size

      // Tìm sản phẩm trong giỏ hàng dựa trên product_id và size
      const index = state.cart.findIndex(
        (item) => item.product_id === productId && item.size === size
      );

      if (index >= 0) {
        // Nếu tìm thấy sản phẩm, xóa sản phẩm khỏi giỏ hàng
        state.cart.splice(index, 1);
        // Lưu giỏ hàng vào localStorage sau khi thay đổi
        localStorage.setItem("cart", JSON.stringify(state.cart));
      }
    },
  },
});

// Xuất các action để sử dụng ngoài slice
export const { addToCart, incrementQuantity, decrementQuantity, removeCart } =
  cartSlice.actions;

export default cartSlice.reducer;

export const selectCart = (state) => state.cart.cart;
