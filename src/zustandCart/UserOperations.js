import { create } from "zustand";
import { auth, db } from "../Firebase";
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

const UserStore = (set, get) => ({
  user: {
    uid: "",
    username: "",
    name: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      pincode: "",
    },
    orders: [],
    imageSrc: "",
    wallet: {
      cardNumber: "",
      expiry: "",
      cvv: "",
    },
  },

  setUser: (data) => {
    console.log(data);
    set((UserStore) => ({
      user: {
        uid: data.id,
        username: data.username,
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.Address ?? UserStore.user.address,
        orders: data.orders ?? UserStore.user.orders,
        imageSrc: data.imageSrc ?? UserStore.user.imageSrc,
        wallet: data.Wallet ?? UserStore.user.wallet,
      },
    }));
  },
  updateAddress: (data) => {
    set((UserStore) => ({
      user: {
        ...UserStore.user,
        address: {
          street: data?.street,
          city: data?.city,
          state: data?.state,
          pincode: data?.pincode,
        },
      },
    }));
  },
  updateWallet: (data) => {
    set((UserStore) => ({
      user: {
        ...UserStore.user,
        wallet: {
          cardNumber: data?.cardNumber,
          expiry: data?.expiry,
          cvv: data?.cvv,
        },
      },
    }));
  },
  updateOrder: async (data) => {
    console.log(data);
    try {
      const collectionRef = collection(db, "users");
      const q = query(collectionRef, where("id", "==", auth.currentUser.uid));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const docRef = doc(db, "users", querySnapshot.docs[0].id);
        await updateDoc(docRef, {
          orders: arrayUnion(data),
        });
      } else {
        console.log("Document not found!");
      }
    } catch (error) {
      console.error("Error getting document:", error);
    }
    set((UserStore) => ({
      user: {
        ...UserStore.user,
        orders: [...UserStore.user.orders, data] ?? [],
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
