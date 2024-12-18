import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Row, Col, ListGroup, Image, Form, Button, Card, Modal } from 'react-bootstrap'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
    const { state, dispatch } = useAuth();
    const [carts, setCarts] = useState([]);
    const [toDelete, setToDelete] = useState();
    const [selectedCart, setSelectedCart] = useState();
    const [showModal, setShowModal] = useState(false);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        fetchCart();
    }, [refresh]);

    const fetchCart = async () => {
        const existingCart = await fetch(`http://localhost:8080/cart/?userId=${state.id}`, {
            headers: {
                token: localStorage.getItem('token'),
                "Content-Type": "application/json",
            },
        });

        const cartData = await existingCart.json();
        if (cartData) {
            setCarts(cartData)
            if (cartData.length < 1) {
                setCarts(undefined)
            }
            console.log(cartData, cartData.length)
        }
    }

    const removeFromCartHandler = (cart, product) => {
        setToDelete(product);
        setSelectedCart(cart);
        setShowModal(true);
    };

    const handleDeleteConfirmation = async itemToDelete => {
        const updatedCart = await fetch(`http://localhost:8080/cart/rows/${selectedCart.cartId}/${itemToDelete}`, {
            method: 'DELETE',
            headers: {
                token: localStorage.getItem('token'),
                "Content-Type": "application/json",
            }
        });
        const updatedCartData = await updatedCart.json();
        window.location.reload()
    }

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const checkoutHandler = async cartId => {
        const updatedCart = await fetch(`http://localhost:8080/cart/${cartId}`, {
            method: 'DELETE',
            headers: {
                token: localStorage.getItem('token'),
                "Content-Type": "application/json",
            }
        });
        const updatedCartData = await updatedCart.json();
        window.location.reload()
        alert("Comandat!")
    }

    const updateQuantity = async (newValue, cart, item) => {
        if (newValue > item.stock || !parseInt(newValue)) {
            alert("Cantitatea depășește stocul!")
            return
        }
        const updatedCart = await fetch(`http://localhost:8080/cart/rows/${cart.cartId}/${item.productId}`, {
            method: 'PUT',
            headers: {
                token: localStorage.getItem('token'),
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                quantity: newValue
            })
        });
        const updatedCartData = await updatedCart.json();
        setCarts(updatedCartData);
        setRefresh(!refresh)
    }

    return (
        <div className="container py-5">
            <h1 className="mb-4 text-center">Coșul meu</h1>

            {/* Mesaj când coșul este gol */}
            {(!carts || (carts.length === 1 && carts[0].Products.length < 1)) && (
                <p className="text-center">
                    <Link to="/">Coșul este gol. Caută produse.</Link>
                </p>
            )}

            
            {carts &&
                carts.length > 0 &&
                (carts.length === 1 && carts[0].Products.length > 0) &&
                carts.map((cart) => (
                    <React.Fragment key={cart.cartId}>
                        <Row className="justify-content-center mb-4">
                            <Col md={8} lg={6} className="card p-3">
                                <h4 className="text-center mb-3">Produsele din coș</h4>
                                <ListGroup variant="flush">
                                    {cart.Products.map((product) => (
                                        <ListGroup.Item key={product.productId}>
                                            <Row>
                                                {/* Imagine produs */}
                                                <Col md={4}>
                                                    <Image
                                                        style={{ objectFit: 'contain', width: '100%', height: '120px' }}
                                                        src={JSON.parse(product.images)[0]}
                                                        alt={product.title}
                                                        fluid
                                                        rounded
                                                    />
                                                </Col>

                                                {/* Detalii produs */}
                                                <Col md={8}>
                                                    <p><strong>{product.title}</strong></p>
                                                    <p>Preț produs: {product.price} lei</p>
                                                    <p>
                                                        <Form.Control
                                                            as="input"
                                                            type="number"
                                                            max={product.stock}
                                                            defaultValue={product.CartRow.quantity}
                                                            onChange={(e) => updateQuantity(e.target.value, cart, product)}
                                                        />
                                                    </p>
                                                    <p>Preț total: {product.price * product.CartRow.quantity} lei</p>

                                                  
                                                    <div className="text-center mt-3">
                                                        <Button
                                                            type="button"
                                                            variant="danger"
                                                            className="w-75"
                                                            onClick={() => removeFromCartHandler(cart, product)}>
                                                            Șterge produsul din coș
                                                        </Button>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            </Col>
                        </Row>

                        {/* Secțiunea Detalii Comandă */}
                        <Row className="justify-content-center">
                            <Col md={8} lg={6} className="card p-3">
                                <h4 className="text-center mb-3">Detalii comandă</h4>
                                <ListGroup variant="flush">
                                    <ListGroup.Item>
                                        <span className="d-flex justify-content-between">
                                            <strong>Cost produse:</strong>
                                            {cart.Products?.reduce(
                                                (total, product) => total + product.CartRow.quantity * product.price,
                                                0
                                            )}{' '}
                                            lei
                                        </span>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Button
                                            type="button"
                                            style={{
                                                width: '100%',
                                                backgroundColor: 'darkred',
                                                color: 'white',
                                            }}
                                            disabled={cart?.Products.length === 0}
                                            onClick={() => checkoutHandler(cart.cartId)}
                                        >
                                            Finalizează comanda
                                        </Button>
                                    </ListGroup.Item>
                                </ListGroup>
                            </Col>
                        </Row>

                        {/* Modal pentru ștergere */}
                        <Modal show={showModal} onHide={handleCloseModal}>
                            <Modal.Header closeButton>
                                <Modal.Title>Ștergere din coș</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                Chiar vrei să ștergi {toDelete?.title}?
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleCloseModal}>
                                    Nu
                                </Button>
                                <Button variant="danger" onClick={() => handleDeleteConfirmation(toDelete?.productId)}>
                                    Da
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </React.Fragment>
                ))}
        </div>
    );

}

export default Cart
