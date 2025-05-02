
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
import TransactionHistoryPage from './pages/users/TransactionHistoryPage';
import AdminWithdrawalsPage from './pages/admin/AdminWithdrawalsPage';
import AdminLayout from './components/AdminLayout';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import InvestmentPage from './pages/InvestmentPage';
import AdminUserData from './pages/admin/adminUserData';
import TermsAndConditionsPage from './components/TermsAndConditionsPage';
import DisclaimerPage from './components/DisclaimerPage';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import ChangePasswordPage from './pages/ChangePassword';
import AdminPendingDeposits from './pages/admin/AdminPendingDeposit';
import InvestmentDetail from './components/InvestDetails';

// Define props for our route components
interface RouteComponentProps {
  children?: ReactNode;
}

// Create components with proper typing
// const Invest = ({ children }: RouteComponentProps) => <div className="min-h-screen pt-16 bg-gray-50 p-4">Investment Portal{children}</div>;
const Marketplace = ({ children }: RouteComponentProps) => <div className="min-h-screen pt-16 bg-gray-50 p-4">E-commerce Marketplace{children}</div>;
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
          <Route path="/forget" element={<ChangePasswordPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/terms" element={<TermsAndConditionsPage />} />
          <Route path="/disclaimer" element={<DisclaimerPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AccountDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route 
            path='/investments/dashboard'
            element={
              <ProtectedRoute> <InvestmentPage /></ProtectedRoute>
          }/>

          <Route
            path="/join"
            element={user ? <AccountDashboard /> : <Register />}
          />
          <Route
            path="/investments"
            element={
              <ProtectedRoute>
                <InvestmentProducts />
              </ProtectedRoute>
            }
          />
          <Route path="/investments/:id" element={<ProtectedRoute><InvestmentDetail /></ProtectedRoute>} />

          <Route
            path="/marketplace"
            element={
              <ProtectedRoute>
                <Marketplace />
              </ProtectedRoute>
            }
          />

          <Route
            path="/withdraw"
            element={
              <ProtectedRoute>
                <WithdrawPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <AccountPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/deposit"
            element={
              <ProtectedRoute>
                <DepositPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <TransactionHistoryPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />



          {/* admin routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout>
                  <AdminUsersPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users/:id"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout>
                  <AdminUserData />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/withdrawals"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout>
                  <AdminWithdrawalsPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/deposit-pending"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout>
                  <AdminPendingDeposits />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* 404 catch-all - properly typed */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer/>
      </div>
    </Router>
  );
}

export default App;