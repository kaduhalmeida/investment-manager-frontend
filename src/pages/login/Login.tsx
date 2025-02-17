import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Email inválido').required('Email obrigatório'),
      password: Yup.string().required('Senha obrigatória'),
    }),
    onSubmit: async (values) => {
      try {
        await login(values.email, values.password);
        navigate('/dashboard/wallet');
      } catch (error) {
        console.error('Erro de login:', error);
      }
    },
  });

  return (
    <div className="h-screen flex items-center justify-center bg-white sm:bg-gradient-to-r sm:from-black sm:to-blue-500">
      <div className="bg-white p-4 sm:p-8 w-full max-w-sm backdrop-blur-sm sm:rounded-lg sm:shadow-md">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-8 sm:mb-12">
          Aplicação de investimentos
        </h2>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
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
          <div className="text-right">
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="text-blue-500 hover:text-blue-700 font-medium text-sm sm:text-base"
            >
              Esqueci a senha?
            </button>
          </div>
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm sm:text-base"
          >
            {formik.isSubmitting ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm sm:text-base">Não tem uma conta? </p> {/* Tamanho do texto responsivo */}
          <button onClick={() => navigate('/register')} className="text-blue-500 hover:text-blue-700 font-medium text-sm sm:text-base"> {/* Tamanho do texto responsivo */}
            Crie sua conta
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;