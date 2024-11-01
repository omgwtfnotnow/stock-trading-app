"use client";
import { useState } from "react";
import { Button, Grid, Paper, Typography, TextField, Link } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons/faGoogle";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        console.log(email);
        console.log(password);
        // Add your login logic here
    };

    return (
        <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
            <Grid item xs={10} sm={8} md={6} lg={4}>
                <Paper elevation={3} sx={{ padding: 4 }}>
                    <Typography variant="h4" gutterBottom align="center">
                        Sign In
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            id="email"
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            variant="outlined"
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            id="password"
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            variant="outlined"
                            margin="normal"
                            required
                        />
                        <Button fullWidth variant="contained" type="submit" sx={{ mt: 2 }}>
                            Sign in
                        </Button>
                    </form>
                    <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                        Don't have an account? <Link href="/register">Register</Link>
                    </Typography>
                    <hr style={{ margin: '20px 0' }} />
                    <Button fullWidth variant="outlined" startIcon={<FontAwesomeIcon icon={faGoogle} />} sx={{ mt: 2 }}>
                        Sign in with Google
                    </Button>
                </Paper>
            </Grid>
        </Grid>
    );
}

export default Login;
