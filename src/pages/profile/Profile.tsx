import React, { useEffect, useState } from 'react';
import userService from '../../services/userService';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { AuthService } from '../../services/authService';

const ProfileSchema = Yup.object().shape({
    name: Yup.string().required('Nome obrigatório'),
    email: Yup.string().email('Email inválido').required('Email obrigatório'),
});

const ChangePasswordSchema = Yup.object().shape({
    newPassword: Yup.string().required('Nova senha obrigatória').min(6, 'A senha deve ter no mínimo 6 caracteres'),
    confirmPassword: Yup.string().oneOf([Yup.ref('newPassword')], 'As senhas devem corresponder').required('Confirmação de senha obrigatória'),
});

const ProfilePage = () => {
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const profileData = await userService.getProfile();
                setUser(profileData);
            } catch (error) {
                console.error('Erro ao carregar o perfil:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUserProfile();
    }, []);

    const handleUpdate = async (values: any) => {
        try {
            const updatedUser = await userService.updateUser(user.id, values);
            setUser(updatedUser);
        } catch (error) {
            console.error('Erro ao editar o perfil:', error);
        }
    };

    const handleChangePassword = async (values: any) => {
        try {
            await AuthService.changePassword(values.newPassword);
            setIsChangingPassword(false);
            alert("Senha alterada com sucesso!");
        } catch (error) {
            console.error('Erro ao alterar a senha:', error);
        }
    };

    const handleDelete = async () => {
        try {
            await userService.deleteUser(user.id);
            localStorage.removeItem('token');
            window.location.href = '/login';
        } catch (error) {
            console.error('Erro ao excluir o perfil:', error);
        }
    };

    if (isLoading) return <div className="text-center py-10">Carregando...</div>;
    if (!user) return <div className="text-center py-10">Usuário não encontrado.</div>;

    return (
        <div className="flex min-h-screen bg-gray-100">
            <div className="flex-grow p-8 flex justify-center">
                <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                    <h1 className="text-2xl font-bold mb-4">Perfil do Usuário</h1>
                    <Formik
                        initialValues={{ name: user.name, email: user.email }}
                        validationSchema={ProfileSchema}
                        onSubmit={handleUpdate}
                        enableReinitialize
                    >
                        {({ errors, touched }) => (
                            <Form className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium">Nome</label>
                                    <Field name="name" className="w-full p-2 border rounded-md" />
                                    {errors.name && touched.name && <p className="text-red-500 text-sm">{String(errors.name)}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Email</label>
                                    <Field name="email" className="w-full p-2 border rounded-md" />
                                    {errors.email && touched.email && <p className="text-red-500 text-sm">{String(errors.email)}</p>}
                                </div>
                                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md">Salvar</button>
                            </Form>
                        )}
                    </Formik>

                    <div className="border-t my-6"></div>

                    <h2 className="text-lg font-semibold mb-2">Alterar Senha</h2>
                    {isChangingPassword ? (
                        <Formik
                            initialValues={{ newPassword: '', confirmPassword: '' }}
                            validationSchema={ChangePasswordSchema}
                            onSubmit={handleChangePassword}
                        >
                            {({ errors, touched }) => (
                                <Form className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium">Nova Senha</label>
                                        <Field name="newPassword" type="password" className="w-full p-2 border rounded-md" />
                                        {errors.newPassword && touched.newPassword && <p className="text-red-500 text-sm">{String(errors.newPassword)}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium">Confirmar Senha</label>
                                        <Field name="confirmPassword" type="password" className="w-full p-2 border rounded-md" />
                                        {errors.confirmPassword && touched.confirmPassword && <p className="text-red-500 text-sm">{String(errors.confirmPassword)}</p>}
                                    </div>
                                    <div className="flex gap-2">
                                        <button type="submit" className="w-full bg-green-500 text-white py-2 rounded-md">Salvar Senha</button>
                                        <button type="button" className="w-full bg-gray-300 py-2 rounded-md" onClick={() => setIsChangingPassword(false)}>Cancelar</button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    ) : (
                        <button className="w-full bg-blue-500 text-white py-2 rounded-md mt-4" onClick={() => setIsChangingPassword(true)}>Alterar Senha</button>
                    )}

                    <div className="border-t my-6"></div>
                    <button className="w-full bg-red-500 text-white py-2 rounded-md" onClick={handleDelete}>Excluir Conta</button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
