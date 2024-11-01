'use client'
import { PropsWithChildren, FC } from "react";
import theme from './theme'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import Header from "@/components/ui/header"; 
import { ThemeProvider } from '@mui/material/styles';

const Client:FC<PropsWithChildren> = ({children})=>{
    return (
        
        <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Header/>
          {children}  
          </LocalizationProvider>
          </ThemeProvider>
    )
}

export default Client