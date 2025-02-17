import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const InvestmentService = {
  createInvestment: async (walletId: string, data: any) => {
    try {
      const response = await axios.post(`${API_URL}/wallets/${walletId}/investments`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Erro ao criar investimento';
        throw new Error(errorMessage);
      } else {
        throw error;
      }
    }
  },
  
  getInvestments: async (walletId: string) => {
    try {
      const response = await axios.get(`${API_URL}/wallets/${walletId}/investments`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Erro ao buscar investimentos';
        throw new Error(errorMessage);
      } else {
        throw error;
      }
    }
  },
  

  getInvestment: async (id: string) => {
    try {
      const response = await axios.get(`${API_URL}/investments/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Erro ao buscar investimento';
        throw new Error(errorMessage);
      } else {
        throw error;
      }
    }
  },

  updateInvestment: async (id: string, data: any) => {
    try {
      const response = await axios.patch(`${API_URL}/investments/${id}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Erro ao atualizar investimento';
        throw new Error(errorMessage);
      } else {
        throw error;
      }
    }
  },

  deleteInvestment: async (id: string) => {
    try {
      const response = await axios.delete(`${API_URL}/investments/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Erro ao excluir investimento';
        throw new Error(errorMessage);
      } else {
        throw error;
      }
    }
  },

  sellInvestment: async (id: string, sellPrice: number) => {
    try {
      const response = await axios.patch(`${API_URL}/investments/${id}/sell`, { sellPrice }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Erro ao vender investimento';
        throw new Error(errorMessage);
      } else {
        throw error;
      }
    }
  },

  withdrawInvestment: async (id: string) => {
    try {
      const response = await axios.patch(`${API_URL}/investments/${id}/withdraw`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Erro ao retirar investimento';
        throw new Error(errorMessage);
      } else {
        throw error;
      }
    }
  }
};
