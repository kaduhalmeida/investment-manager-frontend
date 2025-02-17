import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const getWallets = async () => {
    const response = await axios.get(`${API_URL}/wallet`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data;
};

export const createWallet = async (data: { name: string; balance: number; spentAmount: number; fundsAdded: number }) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/wallet`, data, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const getWalletById = async (id: string) => {
    const response = await axios.get(`${API_URL}/wallet/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data;
};

export const updateWallet = async (id: string, data: { name: string; balance: number }) => {
    const response = await axios.put(`${API_URL}/wallet/${id}`, data, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data;
};


export const deleteWallet = async (id: string) => {
    const response = await axios.delete(`${API_URL}/wallet/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data;
};

export const getInvestmentsByWalletId = async (walletId: string) => {
    const response = await axios.get(`${API_URL}/wallet/${walletId}/investments`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data;
};
