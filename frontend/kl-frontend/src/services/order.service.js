import axios from 'axios'

const apiUrl = 'http://localhost:3000/orders';

export const createOrder = async(orderData) => {
    const token = localStorage.getItem("token");
    console.log('token', token)
    return axios.post(apiUrl, orderData,{
        headers: {
            Authorization: `Bearer ${token}`, // Envoyer le token dans les en-têtes
          },
      });
}

export const getOrderById = async(orderId) => {
    return axios.get(`${apiUrl}/${orderId}`)
}

export const getOrderByUser = async(userId) => {
    return axios.get(`${apiUrl}/user/${userId}`)
}

export const payOrder = async(orderId) => {
    console.log('orderId dans payOrder', orderId)
        return axios.put(`${apiUrl}/${orderId}`, { status: "completed" })
}