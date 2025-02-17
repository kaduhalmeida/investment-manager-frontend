import React, { useState } from 'react';
import { Menu, MenuItem, Avatar, IconButton, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';

interface HeaderMenuProps {
    user: {
        name: string;
        photo?: string; 
    };
}

const HeaderMenu: React.FC<HeaderMenuProps> = ({ user }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', pr:"5vh", gap: 0 }}>

            <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
                <Avatar alt={user.name} src={user.photo} />
            </IconButton>
            <Typography variant="body1" sx={{ color: 'white' }}>
                {user.name}
            </Typography>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MenuItem component={Link} to="/dashboard/profile" onClick={handleMenuClose}>
                    Perfil
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        localStorage.removeItem('token');
                        window.location.href = '/login';
                    }}
                >
                    Sair
                </MenuItem>
            </Menu>
        </Box>
    );
};

export default HeaderMenu;