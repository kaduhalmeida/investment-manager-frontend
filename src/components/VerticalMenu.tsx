import React, { useState } from 'react';
import { Drawer, List, ListItemButton, ListItemText, Divider, IconButton, useMediaQuery, ListItemIcon } from '@mui/material';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LogoutIcon from '@mui/icons-material/Logout';

const VerticalMenu: React.FC = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
    const APP_BAR_HEIGHT = 64;

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('token'); 
        window.location.href = "/login"; 
    };

    const drawer = (
        <List>
            <ListItemButton component={Link} to="/dashboard">
                <ListItemIcon>
                    <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
            </ListItemButton>
            <Divider />
            <ListItemButton component={Link} to="/dashboard/wallet">
                <ListItemIcon>
                    <AccountBalanceWalletIcon />
                </ListItemIcon>
                <ListItemText primary="Carteira" />
            </ListItemButton>
            <ListItemButton component={Link} to="/dashboard/portfolio">
                <ListItemIcon>
                    <TrendingUpIcon />
                </ListItemIcon>
                <ListItemText primary="Portfólio" />
            </ListItemButton>
            <ListItemButton component={Link} to="/dashboard/companies">
                <ListItemIcon>
                    <StorefrontIcon />
                </ListItemIcon>
                <ListItemText primary="Mercado" />
            </ListItemButton>
            <ListItemButton onClick={handleLogout}>
                <ListItemIcon>
                    <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Sair" />
            </ListItemButton>
        </List>
    );

    return (
        <>
            {isMobile && (
                <IconButton
                    aria-label="abrir menu"
                    onClick={handleDrawerToggle}
                    sx={{
                        position: 'fixed',
                        top: 16,
                        left: 16,
                        zIndex: 1300,
                        color: 'white',
                        padding: '8px',
                        minWidth: 'auto',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
                    }}
                >
                    <MenuIcon />
                </IconButton>
            )}

            <Drawer
                variant={isMobile ? 'temporary' : 'permanent'}
                open={isMobile ? mobileOpen : true}
                onClose={handleDrawerToggle}
                sx={{
                    width: 240,
                    flexShrink: 0,
                    zIndex: 1199,
                    '& .MuiDrawer-paper': {
                        width: 240,
                        marginTop: `${APP_BAR_HEIGHT}px`,
                        boxSizing: 'border-box',
                        backgroundColor: '#ffffff',
                    },
                }}
            >
                {drawer}
            </Drawer>
        </>
    );
};

export default VerticalMenu;
