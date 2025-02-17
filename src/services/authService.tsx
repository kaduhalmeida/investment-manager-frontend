import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const AuthService = {
  login: async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/signin`, { email, password });
      if (response.data && response.data.access_token) {
        localStorage.setItem('token', response.data.access_token); 
        return response.data;
      }
      throw new Error('Token não encontrado na resposta');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Erro desconhecido ao fazer login';
        throw new Error(errorMessage);
      } else {
        throw error;
      }
    }
  },

  register: async (name: string, email: string, password: string, profilePicture: File | null) => {
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);

      if (profilePicture) {
        formData.append('file', profilePicture);
      }

      const response = await axios.post(`${API_URL}/auth/signup`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Erro desconhecido ao cadastrar usuário';
        throw new Error(errorMessage);
      } else {
        throw error;
      }
    }
  },

  changePassword: async (newPassword: string) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Usuário não autenticado. Faça login para alterar a senha.'); 
        }

        const response = await axios.post(`${API_URL}/auth/change-password`, { newPassword }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data?.message || error.message || 'Erro ao alterar a senha'; 
            console.error("Erro na requisição:", error.response?.data); 
            throw new Error(errorMessage);
        } else {
            console.error("Erro na requisição:", error); 
            throw error;
        }
    }
},
  

  logout: () => {
    localStorage.removeItem('token');
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token'); 
  }
};
