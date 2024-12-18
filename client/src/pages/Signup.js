import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import { Button } from "react-bootstrap";

const SignupSchema = Yup.object().shape({
  first_name: Yup.string()
    .min(3, "Prenumele trebuie să aibă cel puțin 3 caractere")
    .required("Prenumele este obligatoriu"),
  last_name: Yup.string()
    .min(3, "Numele trebuie să aibă cel puțin 3 caractere")
    .required("Numele este obligatoriu"),
  email: Yup.string().email("Email invalid").required("Emailul este obligatoriu"),
  password: Yup.string()
    .min(6, "Parola trebuie să aibă cel puțin 6 caractere")
    .required("Parola este obligatorie"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Parolele trebuie să coincidă")
    .required("Confirmarea parolei este obligatorie"),
});

export const Signup = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    console.log(values);
    try {
      const response = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...values, role: "client" }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log("Utilizator înregistrat:", data);
        navigate("/login");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Eroare la înregistrarea utilizatorului:", error);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100"
      style={{
        backgroundColor: "#f7f7f7",
        padding: "20px",
      }}
    >
      <div
        className="card shadow p-4 bg-white"
        style={{
          width: "100%",
          maxWidth: "400px",
          borderRadius: "10px",
        }}
      >
        <h2 className="text-center mb-4">Client nou</h2>
        <Formik
          initialValues={{
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={SignupSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form>
              <div className="form-group mb-3">
                <label htmlFor="first_name" className="form-label">Prenume</label>
                <Field
                  type="text"
                  name="first_name"
                  className={`form-control ${errors.first_name && touched.first_name ? "is-invalid" : ""}`}
                />
                <ErrorMessage
                  name="first_name"
                  component="div"
                  className="invalid-feedback"
                />
              </div>

              <div className="form-group mb-3">
                <label htmlFor="last_name" className="form-label">Nume</label>
                <Field
                  type="text"
                  name="last_name"
                  className={`form-control ${errors.last_name && touched.last_name ? "is-invalid" : ""}`}
                />
                <ErrorMessage
                  name="last_name"
                  component="div"
                  className="invalid-feedback"
                />
              </div>

              <div className="form-group mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <Field
                  type="email"
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

              <div className="form-group mb-3">
                <label htmlFor="confirmPassword" className="form-label">Confirmare Parolă</label>
                <Field
                  type="password"
                  name="confirmPassword"
                  className={`form-control ${errors.confirmPassword && touched.confirmPassword ? "is-invalid" : ""}`}
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="invalid-feedback"
                />
              </div>

              <Button
                type="submit"
                style={{
                  backgroundColor: "darkred",
                  width: "100%",
                  color: "white",
                  padding: "10px",
                  borderRadius: "5px",
                }}
                className="mb-3"
              >
                Înregistrează-te
              </Button>
            </Form>
          )}
        </Formik>
        <Typography className="text-center mt-3">
          Ai deja un cont? <Link to="/login" className="text-decoration-none">Conectează-te</Link>
        </Typography>
      </div>
    </div>
  );
};
