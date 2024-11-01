"use client";
import React from 'react';
import { Input, Button, Link, Typography, Grid, Paper } from '@mui/material';

type Props = {}

const Register = (props: Props) => {
  return (
    <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
        <Grid item xs={10} sm={8} md={6} lg={4}>
            <Paper elevation={3} sx={{ padding: 4 }}>
                <Typography variant="h4" gutterBottom align="center">
                    Sign Up
                </Typography>
                <form>
                    <Input fullWidth id='username' placeholder='Username' type='text' sx={{ marginBottom: 2 }} />
                    <Input fullWidth id='emailid' placeholder='Email address' type='email' sx={{ marginBottom: 2 }} />
                    <Input fullWidth id='password' placeholder='Password' type='password' sx={{ marginBottom: 2 }} />
                    <Button fullWidth variant="contained" sx={{ marginBottom: 2 }}>
                        Sign up
                    </Button>
                </form>
                <Typography variant="body2" align="center" sx={{ marginTop: 2 }}>
                    Already have an account? <Link href="/login">Login</Link>
                </Typography>
            </Paper>
        </Grid>
    </Grid>
  )
}

export default Register;
