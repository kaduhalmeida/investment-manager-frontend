import React from 'react';
import { Container as MuiContainer, Box, Paper, ContainerProps as MuiContainerProps } from '@mui/material';

interface ContainerProps extends MuiContainerProps {
  children: React.ReactNode;
  paperProps?: React.ComponentProps<typeof Paper>; 
}

const Container: React.FC<ContainerProps> = ({ children, paperProps, ...props }) => {
  return (
    <MuiContainer {...props}>
      <Box sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%', backgroundColor: 'white', ...paperProps?.sx }} {...paperProps}>
          {children}
        </Paper>
      </Box>
    </MuiContainer>
  );
};

export default Container;

