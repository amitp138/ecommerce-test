import { create } from "zustand";

const UserStore = (set, get) => ({
  user: {
    username: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    orders: [],
  },

  setUser: (data) => {
    console.log(data);
    set((UserStore) => ({
      user: {
        username: data.username,
        name: data.name,
        email: data.email,
        phone: data.number,
      },
    }));
  },
  updateUser: (data) => {
    console.log(data);
    set((UserStore) => ({
      user: {
        orders: data ?? [],
      },
    }));
  },
});

const CartStore = (set, get) => ({
  Cart: [],
  CartItemsQuantity: 0,
  CartTotalPrice: 0,
  ADD_TO_CART: (data) => {
    const cart = get().Cart;
    const cartItem = cart.find((item) => item.id === data.id);
    if (cartItem) {
      const updatedCart = cart.map((item) =>
        item.id === data.id ? { ...item, quantity: item.quantity + 1 } : item
      );
      set((CartStore) => ({
        Cart: updatedCart,
        CartItemsQuantity: CartStore.CartItemsQuantity + 1,
        CartTotalPrice: CartStore.CartTotalPrice + data.price,
      }));
    } else {
      const updatedCart = [...cart, { ...data, quantity: 1 }];

      set((CartStore) => ({
        Cart: updatedCart,
        CartItemsQuantity: CartStore.CartItemsQuantity + 1,
        CartTotalPrice: CartStore.CartTotalPrice + data.price,
      }));
    }
  },
  REMOVE_FROM_CART: (data) => {
    const cart = get().Cart;
    const cartItem = cart.find((item) => item.id === data.id);
    if (cartItem.quantity > 1) {
      const updatedCart = cart.map((item) =>
        item.id === data.id ? { ...item, quantity: item.quantity - 1 } : item
      );
      set((CartStore) => ({
        Cart: updatedCart,
        CartItemsQuantity: CartStore.CartItemsQuantity - 1,
        CartTotalPrice: CartStore.CartTotalPrice - data.price,
      }));
    } else {
      set((CartStore) => ({
        Cart: CartStore.Cart.filter((citem) => citem.id !== data.id),
        CartItemsQuantity: CartStore.CartItemsQuantity - 1,
        CartTotalPrice: CartStore.CartTotalPrice - data.price,
      }));
    }
  },
  REMOVE_ITEM: (data) => {
    set((CartStore) => ({
      Cart: CartStore.Cart.filter((citem) => citem.id !== data.id),
      CartItemsQuantity: CartStore.CartItemsQuantity - data.quantity,
      CartTotalPrice: CartStore.CartTotalPrice - data.price * data.quantity,
    }));
  },
  CLEAR_CART: () => {
    set((CartStore) => ({
      Cart: [],
      CartItemsQuantity: 0,
      CartTotalPrice: 0,
    }));
  },
});
export const useCartStore = create(CartStore);
export const useUserStore = create(UserStore);
