import axiosInstance from "../services/axios";

const apiUrl = "http://localhost:3000/orders";
const stripeApiUrl = "http://localhost:3000/stripe";

export const createOrder = async (orderData) => {
  const token = localStorage.getItem("token");
  return axiosInstance.post(apiUrl, orderData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
};

export const getOrderById = async (orderId) => {
  return axiosInstance.get(`${apiUrl}/${orderId}`);
};

export const getOrderByUser = async (userId) => {
  return axiosInstance.get(`${apiUrl}/user/${userId}`);
};

export const payOrder = async (orderId, products) => {
  console.log("Produits envoyés au backend :", products);
  console.log('orderId', orderId)
  try {
    const response = await axiosInstance.post(`${stripeApiUrl}`, {
      orderId: orderId,
      products: products,
    });

    return response;
  } catch (error) {
    console.error("Erreur lors de la création de la session Stripe:", error);
    throw error;
  }
};
