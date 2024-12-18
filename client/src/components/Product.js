import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Adăugăm importul pentru useNavigate
import { Button, Card, Modal } from 'react-bootstrap';
import { DeleteForeverOutlined, ShoppingCartOutlined } from '@mui/icons-material';
import { jwtDecode } from 'jwt-decode';
import './Product.css';
import { useAuth } from '../context/AuthContext';

const Product = ({ product, retriggerRefresh }) => {
	const { state } = useAuth();
	const navigate = useNavigate();
	const [isAdmin, setIsAdmin] = useState(false);
	const [showModal, setShowModal] = useState(false);

	const handleCloseModal = () => {
		setShowModal(false);
	};

	const handleShowModal = () => {
		setShowModal(true);
	};

	const addToCartHandler = async () => {
		if (!state.isAuthenticated) {
			navigate("/login");
		}
		if (product.stock <= 0) {
			alert("Nu este în stoc!");
			return;
		}
		try {
			const cart = await fetch('http://localhost:8080/cart', {
				method: 'POST',
				headers: {
					token: localStorage.getItem('token'),
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					userId: state.id,
					products: [
						{
							productId: product.productId,
							quantity: 1
						}
					]
				})
			});

			const newCartData = await cart.json();
			navigate("/cart")
		} catch (error) {
			console.error('Error:', error);
		}
	};


	const handleDeleteConfirmation = async () => {
		const response = await fetch(`http://localhost:8080/product/${product.productId}`, {
			method: 'DELETE',
			headers: {
				token: localStorage.getItem('token'),
				"Content-Type": "application/json",
			}
		});
		const data = await response.json();
		if (response.ok) {
			setShowModal(false);
			retriggerRefresh();
			alert(`Produsul ${product.title} a fost șters cu succes!`);
			window.location.reload();  // refresh al paginii pentru a actualiza lista
		} else {
			console.error("Error: " + data);
		}
	};

	// verifica daca utilizatorul este admin
	useEffect(() => {
		const token = localStorage.getItem('token');
		if (token) {
			try {
				const data = jwtDecode(token);
				setIsAdmin(data.isAdmin);
			} catch (e) {
				console.error(e);
				localStorage.removeItem('token');
				localStorage.removeItem('user');
			}
		}
	}, []);

	return (
		<Card style={{ cursor: 'pointer', fontFamily: 'Saira Condensed', fontSize: '26px', fontWeight: 'bold' }}
			className='my-3 p-3 rounded product-card shadow'>
			<div className='image-container'>
				<Card.Img
					src={JSON.parse(product.images)[0]}
					variant='top'
					height="200px"
				/>
			</div>
			<Card.Body>
				<Card.Title as='div'>
					{product.title}
				</Card.Title>

				<Card.Text className='mt-3 text-center' as='h3'>{product.price} lei
					<p></p>
					{!isAdmin &&
						<Button style={{ backgroundColor: 'darkred', color: 'white' }} onClick={addToCartHandler}>
							<ShoppingCartOutlined /> Adaugă produsul în coș
						</Button>
					}
					{isAdmin &&
						<Button variant="outline-danger" className='my-2' onClick={handleShowModal}>
							<DeleteForeverOutlined /> Șterge produsul
						</Button>
					}
				</Card.Text>



			</Card.Body>
			<Modal show={showModal} onHide={handleCloseModal}>
				<Modal.Header closeButton>
					<Modal.Title>Stergere Produs</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					Chiar vrei sa stergi produsul {product.title}?
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleCloseModal}>
						NU
					</Button>
					<Button variant="danger" onClick={handleDeleteConfirmation}>
						DA
					</Button>
				</Modal.Footer>
			</Modal>
		</Card>
	);
};

Product.defaultProps = {
	retriggerRefresh: () => { },
};

export default Product;
