import axios from "axios";

const apiUrl = "http://localhost:3000/orders";
const stripeApiUrl = "http://localhost:3000/stripe";

export const createOrder = async (orderData) => {
  const token = localStorage.getItem("token");
  return axios.post(apiUrl, orderData, {
    headers: {
      Authorization: `Bearer ${token}`, // Envoyer le token dans les en-têtes
    },
  });
};

export const getOrderById = async (orderId) => {
  return axios.get(`${apiUrl}/${orderId}`);
};

export const getOrderByUser = async (userId) => {
  return axios.get(`${apiUrl}/user/${userId}`);
};

export const payOrder = async (orderId, products) => {
  console.log("Produits envoyés au backend :", products);
  console.log('orderId', orderId)
  try {
    const response = await axios.post(`${stripeApiUrl}`, {
      orderId: orderId,
      products: products,
    });

    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création de la session Stripe:", error);
    throw error;
  }
};
