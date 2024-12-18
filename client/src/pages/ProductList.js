// src/pages/ProductList.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from 'jwt-decode';

const ProductList = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const { data } = await axios.get("http://localhost:8080/products");
            setProducts(data);
        } catch (error) {
            console.error("Eroare la încărcarea produselor:", error);
        }
    };

    const addToCart = async (id) => {
        console.log(`Produsul cu ID-ul ${id} a fost adăugat în coș.`);
    };

    const isClient = () => {
        const token = localStorage.getItem("token");
        const decodedToken = jwtDecode(token);
        return decodedToken?.role === "client";
    };

    const isClientUser = isClient();

    return (
        <div className="container mt-5">
            <h2>Produse disponibile</h2>
            <div className="list-group">
                {products.map((product) => (
                    <div key={product.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <strong>{product.title}</strong>
                            <p>{product.desc}</p>
                        </div>


                        {isClientUser && (
                            <button
                                className="btn btn-success"
                                onClick={() => addToCart(product.id)}
                            >
                                Adaugă în coș
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};


export default ProductList;
