import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import { Alert, Typography } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { Button } from "react-bootstrap";

const LoginSchema = Yup.object().shape({
    email: Yup.string().email("Introduceți un email valid").required("Introduceți email"),
    password: Yup.string().required("Introduceți parola"),
});

export const Login = () => {
    const { state, dispatch } = useAuth();
    const [error, setError] = useState(false);
    const [message, setMessage] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const redirect = searchParams.get('redirect');

    useEffect(() => {
        if (state.isAuthenticated) {
            if (redirect) {
                navigate('/' + redirect);
            } else {
                navigate("/");
            }
        }
    }, [state.isAuthenticated]);

    const handleSubmit = async (values) => {
        try {
            setError(false);
            setMessage(null);
            const response = await fetch("http://localhost:8080/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });
            const data = await response.json();
            if (!response.ok) {
                setError(true);
                setMessage("Error. " + data.message);
                alert(data.message);
            }
            localStorage.setItem('token', data.accessToken);
            const decoded = jwtDecode(data.accessToken);
            dispatch({ type: 'SET_ADMIN', payload: decoded.isAdmin });
            dispatch({ type: 'SET_AUTHENTICATED', payload: true });
            window.location.href = "/";
        } catch (error) {
            console.error("Error logging in:", error);
        }
    };

    return (
        <div
            className="d-flex align-items-center justify-content-center vh-100"
            style={{
                backgroundColor: "#f7f7f7",
                padding: "20px"
            }}
        >
            <div
                className="card shadow p-4 bg-white"
                style={{
                    width: "100%",
                    maxWidth: "400px",
                    borderRadius: "10px"
                }}
            >
                <h2 className="text-center mb-4">Autentificare</h2>
                <Formik
                    initialValues={{
                        email: "",
                        password: "",
                    }}
                    validationSchema={LoginSchema}
                    onSubmit={handleSubmit}
                >
                    {({ errors, touched }) => (
                        <Form>
                            <div className="form-group mb-3">
                                <label htmlFor="email" className="form-label">Email</label>
                                <Field
                                    type="text"
                                    name="email"
                                    className={`form-control ${errors.email && touched.email ? "is-invalid" : ""}`}
                                />
                                <ErrorMessage
                                    name="email"
                                    component="div"
                                    className="invalid-feedback"
                                />
                            </div>

                            <div className="form-group mb-3">
                                <label htmlFor="password" className="form-label">Parolă</label>
                                <Field
                                    type="password"
                                    name="password"
                                    className={`form-control ${errors.password && touched.password ? "is-invalid" : ""}`}
                                />
                                <ErrorMessage
                                    name="password"
                                    component="div"
                                    className="invalid-feedback"
                                />
                            </div>

                            <Button
                                type="submit"
                                style={{
                                    backgroundColor: 'darkred',
                                    width: '100%',
                                    color: 'white',
                                    padding: "10px",
                                    borderRadius: "5px"
                                }}
                                className="mb-3"
                            >
                                Continuă
                            </Button>
                            {message && <Alert severity={error ? "error" : "success"}>{message}</Alert>}
                        </Form>
                    )}
                </Formik>
                <Typography className="text-center mt-3">
                    Nu ai cont? <Link to="/signup" className="text-decoration-none">Înregistrează-te</Link>
                </Typography>
                <Typography className="text-center mt-2">
                    <Link to="/resetare-parola-solicitare" className="text-decoration-none">Ai uitat parola?</Link>
                </Typography>
            </div>
        </div>
    );
};
