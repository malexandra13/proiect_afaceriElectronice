import React, { useEffect, useState, useCallback } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useLocation } from 'react-router-dom';
import Product from '../components/Product';

export const Home = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        const query = search ? `?search=${search}` : '?search=trending';
        try {
            const response = await fetch(`http://localhost:8080/product${query}`);
            if (!response.ok) {
                throw new Error('Failed to fetch products.');
            }
            const data = await response.json();
            setProducts(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [search]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return (
        <>

            {!category && !search ? (

                <></>
            ) : (
                <Link className="btn btn-light m-3" to="/">
                    Înapoi
                </Link>
            )}

            <Container>
                <h3
                    style={{
                        cursor: 'pointer',
                        fontFamily: "'Lobster', cursive",
                        fontSize: '30px',
                        fontWeight: 'bold',
                        color: '#003366',
                        animation: 'fadeIn 3s ease-in-out',
                        textAlign: 'center',
                    }}
                    className="mt-3"
                >
                    Descoperă selecția de produse care se potrivesc nevoilor tale!
                </h3>
                <style>{`@keyframes fadeIn { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); }}`}</style>

                {isLoading && <p>Încărcăm produsele...</p>}
                {error && <p className="text-danger">Eroare: {error}</p>}


                <Row>
                    {!isLoading && !error && products.length > 0 ? (
                        products.map((product) => (
                            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                                <Product product={product} /><p></p>
                            </Col>
                        ))
                    ) : (
                        !isLoading &&
                        !error && <p>Nu am găsit produse care să corespundă criteriilor tale.</p>
                    )}
                </Row>
            </Container>
        </>
    );
};
