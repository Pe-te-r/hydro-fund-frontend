
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ReactNode, useState } from 'react';
import NavBar from './components/NavBar';
import { SelectUser } from './types/type';
import Register from './pages/users/Register';
import Login from './pages/users/Login';
import { useAuth } from './context/AuthContext';

// Define props for our route components
interface RouteComponentProps {
  children?: ReactNode;
}

// Create components with proper typing
const Dashboard = ({ children }: RouteComponentProps) => <div className="min-h-screen pt-16 bg-gray-50 p-4">Dashboard Content{children}</div>;
const Invest = ({ children }: RouteComponentProps) => <div className="min-h-screen pt-16 bg-gray-50 p-4">Investment Portal{children}</div>;
const Marketplace = ({ children }: RouteComponentProps) => <div className="min-h-screen pt-16 bg-gray-50 p-4">E-commerce Marketplace{children}</div>;
const Transactions = ({ children }: RouteComponentProps) => <div className="min-h-screen pt-16 bg-gray-50 p-4">Transaction History{children}</div>;
const About = ({ children }: RouteComponentProps) => <div className="min-h-screen pt-16 bg-gray-50 p-4">About HydroFund{children}</div>;
const Contact = ({ children }: RouteComponentProps) => <div className="min-h-screen pt-16 bg-gray-50 p-4">Contact Us{children}</div>;
const Profile = ({ children }: RouteComponentProps) => <div className="min-h-screen pt-16 bg-gray-50 p-4">User Profile{children}</div>;
const Settings = ({ children }: RouteComponentProps) => <div className="min-h-screen pt-16 bg-gray-50 p-4">Account Settings{children}</div>;
const Home = ({ children }: RouteComponentProps) => <div className="min-h-screen pt-16 bg-gray-50 p-4">Welcome to HydroFund{children}</div>;
const NotFound = ({ children }: RouteComponentProps) => <div className="min-h-screen pt-16 p-4">404 - Page Not Found{children}</div>;

function App() {
  const {user} = useAuth()
  

  return (
    <Router>
      <div className="App">
        <NavBar />

        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={user ? <Dashboard /> : <Login />}
          />
          <Route
            path="/invest"
            element={user ? <Invest /> : <Login />}
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
            path="/profile"
            element={user ? <Profile /> : <Login />}
          />
          <Route
            path="/settings"
            element={user ? <Settings /> : <Login />}
          />

          {/* 404 catch-all - properly typed */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;