import { Route, Routes, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Provider } from 'react-redux';
import store from './store';
import { AuthProvider, useAuth } from './context/AuthContext';
import NavigationBar from './components/NavigationBar';
import { Unauthorized } from './pages/Unauthorized';
import Cart from './pages/Cart';
import AddProduct from './pages/AddProduct';

const App = () => {
  const addAdmin = async () => {
    try {
      const response = await fetch('http://localhost:8080/auth/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify({
          first_name: 'Admin', last_name: 'User', username: 'admin',
          password: '123456', email: 'user@admin.com', role: 'admin'
        }),
      });
      if (!response.ok) throw new Error('Network response was not ok');
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  useEffect(() => {
    addAdmin();
  }, []);

  return (
    <Provider store={store}>
      <AuthProvider>
        <NavigationBar />
        <Routes>
          {/* HOME */}
          <Route exact path="/" element={<Home />} />
          <Route exact path="/home" element={<Home />} />
          <Route exact path="/products" element={<Home />} />

          {/* AUTH */}
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/signup" element={<Signup />} />

          {/* ADMIN PAGES */}
          <Route exact path="/add-product" element={<PrivateAdminRoute />}>
            <Route exact path="/add-product" element={<AddProduct />} />
          </Route>

          <Route exact path="/cart" element={<PrivateRoute />}>
            <Route exact path="/cart" element={<Cart />} />
          </Route>

          <Route exact path="/unauthorized" element={<Unauthorized />} />
        </Routes>
      </AuthProvider>
    </Provider>
  );
};

const PrivateRoute = () => {
  const { state } = useAuth();
  const location = useLocation();
  return state.isAuthenticated ? <Outlet /> :
    <Navigate state={{ from: location }} to="/login" />
};

const PrivateAdminRoute = () => {
  const { state } = useAuth();
  const location = useLocation()

  return state.isAuthenticated ? (
    state.isAdmin ? <Outlet /> : <Navigate to="/unauthorized" />
  ) : <Navigate state={{ from: location }} to="/login" />
};

export default App;