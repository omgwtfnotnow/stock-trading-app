"use client"
import React from "react";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Navbar from "./navbar";
function Header() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={(theme) => ({ background: theme.palette.common.black })}>
        <Toolbar sx={{ textAlign: 'center' }} >
          <Typography variant="h4" sx={{ width: '100%' }} >
            Trading Bill
          </Typography>
        </Toolbar>
        <Box display={'flex'} justifyContent={'center'} pb={1}>
          <Navbar />
        </Box>
      </AppBar>
    </Box>
  );
}

export default Header;