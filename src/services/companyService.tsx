import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const getCompany = async () => {
  try {
    const response = await axios.get(`${API_URL}/company`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 'Erro ao buscar empresas';
      throw new Error(errorMessage);
    } else {
      throw error;
    }
  }
};
export const getCompanyById = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/company/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 'Erro ao buscar empresa';
      throw new Error(errorMessage);
    } else {
      throw error;
    }
  }
};

export const createCompany = async (data: { name: string; description: string; sector: string }) => {
  try {
    const token = localStorage.getItem('token');  
    const response = await axios.post(`${API_URL}/company`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 'Erro ao criar empresa';
      throw new Error(errorMessage);
    } else {
      throw error;
    }
  }
};

export const updateCompany = async (id: string, data: { name: string; description: string; sector: string }) => {
  try {
    const token = localStorage.getItem('token');  
    const response = await axios.put(`${API_URL}/company/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 'Erro ao atualizar empresa';
      throw new Error(errorMessage);
    } else {
      throw error;
    }
  }
};

export const deleteCompany = async (id: string) => {
  try {
    const token = localStorage.getItem('token');  
    const response = await axios.delete(`${API_URL}/company/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 'Erro ao excluir empresa';
      throw new Error(errorMessage);
    } else {
      throw error;
    }
  }
};
