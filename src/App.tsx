
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ReactNode } from 'react';
import NavBar from './components/NavBar';
import Register from './pages/users/Register';
import Login from './pages/users/Login';
import { useAuth } from './context/AuthContext';
import AccountPage from './pages/users/Account';
import SettingsPage from './pages/users/Settings';
import AccountDashboard from './pages/users/Dashboard';
import HomePage from './pages/Home';
import AboutPage from './pages/About';
import InvestmentProducts from './pages/Invest';
import DepositPage from './pages/users/DepositPage';
import WithdrawPage from './pages/users/withdraw';
import AdminDashboard from './pages/admin/AdminDash';
import AdminUsersPage from './pages/admin/AdminUser';
import CartPage from './pages/cart';

// Define props for our route components
interface RouteComponentProps {
  children?: ReactNode;
}

// Create components with proper typing
// const Invest = ({ children }: RouteComponentProps) => <div className="min-h-screen pt-16 bg-gray-50 p-4">Investment Portal{children}</div>;
const Marketplace = ({ children }: RouteComponentProps) => <div className="min-h-screen pt-16 bg-gray-50 p-4">E-commerce Marketplace{children}</div>;
const Transactions = ({ children }: RouteComponentProps) => <div className="min-h-screen pt-16 bg-gray-50 p-4">Transaction History{children}</div>;
const Contact = ({ children }: RouteComponentProps) => <div className="min-h-screen pt-16 bg-gray-50 p-4">Contact Us{children}</div>;
const NotFound = ({ children }: RouteComponentProps) => <div className="min-h-screen pt-16 p-4">404 - Page Not Found{children}</div>;

function App() {
  const {user} = useAuth()
  

  return (
    <Router>
      <div className="App">
        <NavBar />

        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={user ? <AccountDashboard /> : <Login />}
          />
          <Route
            path="/join"
            element={user ? <AccountDashboard /> : <Register />}
          />
 
          <Route
            path="/investments"
            element={user ? <InvestmentProducts /> : <Login />}
          />
          <Route
            path="/marketplace"
            element={user ? <Marketplace /> : <Login />}
          />
          <Route
            path="/transactions"
            element={user ? <Transactions /> : <Login />}
          />
          <Route
            path="/withdraw"
            element={user ? <WithdrawPage /> : <Login />}
          />
 
          <Route
            path="/settings"
            element={user ? <SettingsPage /> : <Login />}
          />
          <Route
            path="/account"
            element={user ? <AccountPage /> : <Login />}
          />
          <Route
            path="/deposit"
            element={user ? <DepositPage /> : <Login />}
          />

          {/* admin urls */}
          <Route path='/admin'
            element={user ? <AdminDashboard /> : <Login/>}
          />
          <Route path='/admin/users'
            element={user ? <AdminUsersPage /> : <Login/>}
          />
          <Route path='/cart'
            element={user ? <CartPage /> : <Login/>}
          />

          {/* 404 catch-all - properly typed */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;