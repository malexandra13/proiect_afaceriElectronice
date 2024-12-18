import React from 'react';
import { Typography, Button, Container, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const Unauthorized = () => {
    const navigate = useNavigate();

    return (
        <Container className='text-center'>
            <Paper className="p-4 m-5" elevation={7}> 
                <Typography variant="h4" component="h1" gutterBottom>
                    Oops! Access Denied (401)
                </Typography>
                <Typography variant="body1" gutterBottom>
                    You are not authorized to view this page.
                </Typography>
                <Button variant="contained" color="primary" onClick={() => navigate("/")}>
                    Back to Home
                </Button>
            </Paper>
        </Container>
    );
};
