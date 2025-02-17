import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

class UserService {
    async uploadProfilePicture(userId: string, file: File) {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(`${API_URL}/upload-profile-picture/${userId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data;
        } catch (error) {
            console.error('Erro ao fazer upload da foto:', error);
            throw error;
        }
    }

   
    async getProfile() {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Token não encontrado');
            }

            
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            const userId = decodedToken.sub; 

            const response = await axios.get(`${API_URL}/users/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao carregar perfil:', error);
            throw error;
        }
    }

  
    async updateUser(id: string, updatedData: any) {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.put(`${API_URL}/users/${id}`, updatedData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao editar o perfil:', error);
            throw error;
        }
    }

   
    async deleteUser(id: string) {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.delete(`${API_URL}/users/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao excluir o perfil:', error);
            throw error;
        }
    }
}

const userServiceInstance = new UserService();
export default userServiceInstance;
