import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography } from '@mui/material';
import VerticalMenu from '../components/VerticalMenu';
import HeaderMenu from '../components/HeaderMenu';
import userService from '../services/userService';

const DashboardLayout = () => {
    const [user, setUser] = useState<{ name: string; photo?: string } | null>(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const profileData = await userService.getProfile();
                setUser(profileData);
            } catch (error) {
                console.error('Erro ao carregar o perfil:', error);
            }
        };

        fetchUserProfile();
    }, []);

    const APP_BAR_HEIGHT = 64;

    return (
        <Box display="flex" height="100vh">
            <AppBar
                position="fixed"
                sx={{ backgroundColor: '#1976d2', zIndex: 1201, height: `${APP_BAR_HEIGHT}px` }}
            >
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6"></Typography>
                    {user ? <HeaderMenu user={user} /> : <Typography variant="body1">Carregando...</Typography>}
                </Toolbar>
            </AppBar>

            <VerticalMenu />

            <Box
                flex={1}
                display="flex"
                flexDirection="column"
                sx={{
                    marginTop: `${APP_BAR_HEIGHT}px`,
                    overflow: 'auto',
                }}
            >
                <Box p={3}>
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
};

export default DashboardLayout;
