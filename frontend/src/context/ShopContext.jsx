import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = '₹';
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  // ✅ Add to Cart
  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error('Select Product Size');
      return;
    }

    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }

    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          `${backendUrl}/api/cart/add`,
          { itemId, size },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        await getUserCart(token);
      } catch (error) {
        console.error(error);
        toast.error(error.message);
      }
    }
  };

  // ✅ Update Quantity
  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId][size] = quantity;
    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          `${backendUrl}/api/cart/update`,
          { itemId, size, quantity },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        await getUserCart(token);
      } catch (error) {
        console.error(error);
        toast.error(error.message);
      }
    }
  };

  // ✅ Get Cart Count
  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item];
          }
        } catch (error) {
          console.error(error);
        }
      }
    }
    return totalCount;
  };

  // ✅ Get Cart Amount
  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product.id === Number(items));
      if (!itemInfo) continue;
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalAmount += itemInfo.price * cartItems[items][item];
          }
        } catch (error) {
          console.error(error);
        }
      }
    }
    return totalAmount;
  };

  // ✅ Fetch Products
  const getProductsData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.success) {
        setProducts(response.data.products.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  // ✅ Fetch User Cart
  const getUserCart = async (userToken) => {
    try {
      const response = await axios.get(`${backendUrl}/api/cart/get`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      if (response.data.success) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  // ✅ Load products on mount
  useEffect(() => {
    getProductsData();
  }, []);

  // ✅ Load user cart when token changes
  useEffect(() => {
    const localToken = localStorage.getItem('token');
    if (!token && localToken) {
      setToken(localToken);
      getUserCart(localToken);
    } else if (token) {
      getUserCart(token);
    }
  }, [token]);

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    setCartItems,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    setToken,
    token
  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
