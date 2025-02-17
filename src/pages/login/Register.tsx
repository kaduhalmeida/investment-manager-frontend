import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AuthService } from '../../services/authService';

interface ErrorResponse {
  response?: {
    data: {
      message: string;
    };
  };
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [fileKey, setFileKey] = useState(0);
  const [emailError, setEmailError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Nome obrigatório'),
      email: Yup.string().email('Email inválido').required('Email obrigatório'),
      password: Yup.string().min(6, 'A senha deve ter pelo menos 6 caracteres').required('Senha obrigatória'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setEmailError(null);
        const response = await AuthService.register(values.name, values.email, values.password, file);
        console.log("Resposta do registro:", response);
        navigate('/login');
      } catch (error) {
        const err = error as ErrorResponse;
        if (err.response?.data?.message === 'Email já registrado') {
          setEmailError('Este email já está registrado.');
        } else {
          alert('Erro ao cadastrar');
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewURL(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleRemovePhoto = () => {
    setFile(null);
    setPreviewURL(null);
    const fileInput = document.getElementById('profilePicture') as HTMLInputElement | null;
    if (fileInput) {
      fileInput.value = '';
    }
  };


  return (
    <div className="h-screen flex items-center justify-center bg-white sm:bg-gradient-to-r sm:from-black sm:to-blue-500">
      <div className="bg-white p-4 sm:p-8 w-full max-w-sm backdrop-blur-sm sm:rounded-lg sm:shadow-md">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-8 sm:mb-12">
          Crie sua conta
        </h2>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="mb-4">
            <div className="mb-6">
              <label htmlFor="profilePicture" className="block text-gray-700 font-medium mb-2">Foto de Perfil</label>
              <div className="flex items-center justify-between mb-4">
                <div className="flex flex-col items-center">
                  {previewURL ? (
                    <img
                      src={previewURL}
                      alt="Pré-visualização da foto de perfil"
                      className="rounded-full h-24 w-24 object-cover"
                    />
                  ) : (
                    <div className="border border-dashed rounded-full h-24 w-24 flex items-center justify-center text-gray-400">
                      <span>Sem foto</span>
                    </div>
                  )}
                  {previewURL && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="text-red-500 text-sm hover:underline mt-2"
                    >
                      Remover Foto
                    </button>
                  )}
                </div>
                <input
                  key={fileKey}
                  type="file"
                  id="profilePicture"
                  name="profilePicture"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="profilePicture" className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm">
                  Escolher Foto
                </label>
              </div>
            </div>
            <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Nome</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`border rounded-md w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${formik.touched.name && formik.errors.name ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Digite seu nome"
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`border rounded-md w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Digite seu email"
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
            )}
            {emailError && (
              <p className="text-red-500 text-sm mt-1">{emailError}</p>
            )}
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Senha</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`border rounded-md w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Digite sua senha"
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm sm:text-base"
          >
            {formik.isSubmitting ? 'Criando...' : 'Criar Conta'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm sm:text-base">Já tem uma conta? </p>
          <button onClick={() => navigate('/login')} className="text-blue-500 hover:text-blue-700 font-medium text-sm sm:text-base">
            Faça login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
