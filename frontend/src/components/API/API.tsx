/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  reviewItems,
  ordersItems,
  shippingDetails,
  orderProducts,
  cartItems,
} from "../Interface/Interface";

const URL = "https://modx-production.up.railway.app/";

// eslint-disable-next-line @typescript-eslint/no-explicit-any

const createFetchString = (
  selectedCategories: string[],
  minPrice: string,
  maxPrice: string,
  selectedRating: number | null,
  sortType: string,
  selectedSort: string,
  search: string
) => {
  const queryParams = [];

  if (selectedCategories.length > 0) {
    queryParams.push(`category=${selectedCategories.join(",")}`);
  }
  if (minPrice !== "") {
    queryParams.push(`min_price=${minPrice}`);
  }
  if (maxPrice !== "") {
    queryParams.push(`max_price=${maxPrice}`);
  }
  if (selectedRating !== null) {
    queryParams.push(`rating=${selectedRating}`);
  }
  if (sortType !== "ASC") {
    queryParams.push(`price_sort=${sortType}`);
  }
  if (selectedSort !== "") {
    queryParams.push(`sort=${selectedSort}`);
  }
  if (search != "") {
    queryParams.push(`search=${search}`);
  }

  let fetchString = URL + "v1/product/all";
  if (queryParams.length > 0) {
    fetchString += "?" + queryParams.join("&");
  }
  return fetchString;
};

const checkToken = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return "can't find token";
  }
  return token;
};

export const GetProductsData = async (
  selectedCategories: string[],
  minPrice: string,
  maxPrice: string,
  selectedRating: number | null,
  sortType: string,
  selectedSort: string,
  search: string
) => {
  const response = await fetch(
    createFetchString(
      selectedCategories,
      minPrice,
      maxPrice,
      selectedRating,
      sortType,
      selectedSort,
      search
    ),
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();
  return data;
};

export const HandleReviewClick = async (
  id: number,
  order_products: reviewItems[]
) => {
  const token = checkToken();
  if (!token) {
    return "can't find token";
  }

  const reviewData = order_products.filter((product) => product.id === id);

  await fetch(URL + "v1/product/review", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reviewData[0]),
  }).then(async (res) => {
    if (res.ok) {
      await res.json().then((data) => {
        console.log(data);
        alert("Review Success");
      });
    }
  });
};

export const HandleGetOrder = async (order_id: number) => {
  const token = checkToken();
  if (!token) {
    return "can't find token";
  }

  let orderProducts: reviewItems[] = [];

  await fetch(URL + `v1/order/${order_id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then(async (res) => {
    if (res.ok) {
      await res.json().then((data) => {
        console.log(data);
        orderProducts = data;
      });
    }
  });

  return orderProducts;
};

export const HandleGetOrderList = async () => {
  const token = checkToken();
  if (!token) {
    return "can't find token";
  }

  let orderList: ordersItems[] = [];

  await fetch(URL + "v1/order/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then(async (res) => {
    if (res.ok) {
      await res.json().then((data) => {
        console.log(data);
        orderList = data;
      });
    } else {
      orderList = [];
    }
    console.log(res.status);
  });

  return orderList;
};

export const HandleGetUserData = async () => {
  const token = checkToken();
  if (!token) {
    return "can't find token";
  }

  const userData = await fetch(URL + "v1/users/details", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(async (res) => {
    if (res.ok) {
      const data = await res.json();
      return data;
    }

    if (res.status === 403) {
      window.location.href = "/Login";
    }

    return null;
  });

  const shippingData = await fetch(URL + "v1/users/shipping", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(async (res) => {
    if (res.ok) {
      const data = await res.json();
      return data;
    }

    if (res.status === 403) {
      window.location.href = "/Login";
    }

    return null;
  });

  return { userData, shippingData };
};

export const HandleUpdateShipping = async (shippingData: shippingDetails) => {
  const token = checkToken();
  if (!token) {
    return "can't find token";
  }

  await fetch(URL + "v1/users/shipping", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(shippingData),
  }).then(async (res) => {
    if (res.ok) {
      await res.json().then((data) => {
        console.log(data);
      });
    }
  });
};

export const HandleDeleteAccount = async () => {
  const token = checkToken();
  if (!token) {
    return "can't find token";
  }

  await fetch(URL + "v1/users/delete-account", {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(async (res) => {
    if (res.ok) {
      await res.json().then((data) => {
        console.log(data);
        localStorage.removeItem("token");
        window.location.href = "/";
      });
    }
  });
};

export const HandleCheckout = async (
  orderProducts: orderProducts[],
  total: number,
  OmiseCard: any
) => {
  const token = checkToken();
  if (!token) {
    return "can't find token";
  }
  const res = await fetch(URL + "v1/order/create", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      order_products: orderProducts,
    }),
  }).then(async (res) => {
    console.log(res);
    return await res.json();
  });

  await OmiseHandler(res.order_id, total, OmiseCard);
};

export const OmiseHandler = async (
  order_id: number,
  total: number,
  OmiseCard: any
) => {
  console.log("order_id", order_id);
  OmiseCard.configure({
    publicKey: "pkey_test_5xh7smyrjtw4ythtq7n",
    currency: "thb",
    frameLabel: "ModX",
    submitLabel: "PAY NOW",
    buttonLabel: "Pay with Omise",

    defaultPaymentMethod: "credit_card",
    otherPaymentMethods: [],
  });

  await OmiseCard.open({
    amount: total * 100,
    submitFormTarget: "#checkout-form",
    onCreateTokenSuccess: async (nonce: string) => {
      await fetch(URL + "v1/payment/charge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: nonce,
          order_id: order_id,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "success") {
            alert("Payment Success");
          }
          console.log(data);
        });
    },
    onFormClosed: () => {},
  });
};

export const HandleGetShippingAddress = async () => {
  const token = checkToken();
  if (!token) {
    return "can't find token";
  }
  const shippingData = await fetch(URL + "v1/users/shipping", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(async (res) => {
    if (res.ok) {
      const data = await res.json();
      return data;
    }

    if (res.status === 403) {
      window.location.href = "/Login";
    }
  });

  return shippingData;
};

export const HandleGetCartProducts = async () => {
  const token = checkToken();
  if (!token) {
    return "can't find token";
  }

  const cartData = await fetch(URL + "v1/cart/all", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(async (res) => {
    if (res.ok) {
      const data = await res.json();
      return data;
    }

    if (res.status === 403) {
      window.location.href = "/Login";
    }
  });

  return cartData.products;
};

export const HandleDeleteCart = async (
  CartProducts: cartItems[],
  selectedItemIndices: number[]
) => {
  const token = checkToken();
  if (!token) {
    return "can't find token";
  }
  const newCartProducts = CartProducts.filter(
    (product) => !selectedItemIndices.includes(product.id)
  );

  console.log(newCartProducts);

  await fetch(URL + "v1/cart/delete", {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      cart_id: selectedItemIndices,
    }),
  })
    .then((res) => {
      console.log(res);
      if (res.status === 403) {
        window.location.href = "/Login";
      }
      return res.json();
    })
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.log(err);
    });

  return newCartProducts;
};

export const HandleLogin = async (username: string, password: string) => {
  await fetch(URL + "v1/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  }).then(async (res) => {
    if (res.ok) {
      await res.json().then((data) => {
        localStorage.setItem("token", data.token);
        console.log(data);
      });
      window.location.href = "/AllProducts";
    }
    throw new Error("Username or password is incorrect");
  });
};

export const HandleResgister = async (
  username: string,
  password: string,
  confirmPassword: string,
  email: string
) => {
  if (!username || !password || !confirmPassword || !email) {
    alert("All fields are required");
    return;
  }

  console.log(password, confirmPassword);
  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  await fetch(URL + "v1/users/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password, email }),
  }).then(async (res) => {
    if (res.ok) {
      await res.json().then((data) => {
        localStorage.setItem("token", data.token);
        console.log(data);
      });
      window.location.href = "/AllProducts";
    }
    throw new Error("Username already exists");
  });
};

export const HandleGetProduct = async (item_id: number) => {
  const res = await fetch(URL + `v1/product/get/${item_id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then(async (res) => {
    if (res.status === 200) {
      const data = await res.json();
      return data;
    } else {
      return null;
    }
  });

  return res;
};

export const HandleAddToCart = async (
  product_id: number,
  quantity: number,
  options: {
    option_1: string;
    option_2: string;
  }
) => {
  const data = {
    product_id: product_id,
    quantity: quantity,
    options: options,
  };

  const token = checkToken();
  if (!token) {
    return "can't find token";
  }

  await fetch(URL + "v1/cart/add", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then(
    (res) => {
      if (res.status === 403) {
        window.location.href = "/Login";
      }
    },
    (err) => {
      console.log(err);
    }
  );
};

export const HandleGetWishList = async () => {
  const token = checkToken();
  if (!token) {
    return "can't find token";
  }

  const res = await fetch(URL + "v1/wishlist/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then(async (res) => {
    if (res.ok) {
      const data = await res.json();
      return data.products;
    }

    if (res.status === 403) {
      window.location.href = "/Login";
    }
  });

  return res;
};

export const HandleDeleteWishList = async (id: number) => {
  const token = checkToken();
  if (!token) {
    return "can't find token";
  }

  const res = await fetch(URL + `v1/wishlist/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then(async (res) => {
    if (res.ok) {
      return HandleGetWishList().then((res) => {
        return res;
      });
    }

    if (res.status === 403) {
      window.location.href = "/Login";
    }
  });

  return res;
};
