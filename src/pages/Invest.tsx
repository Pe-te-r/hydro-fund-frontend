import { useEffect, useState } from 'react';
import { FiDollarSign, FiClock, FiTrendingUp, FiInfo, FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { mockProducts } from './data';
import { useNavigate } from 'react-router-dom';

export interface InvestmentProduct {
    id: string;
    name: string;
    price: number;
    cycle: number;
    dailyIncome: number;
    totalIncome: number;
    category?: string;
    riskLevel?: 'low' | 'medium' | 'high';
}

export default function InvestmentProducts() {
    const [products, setProducts] = useState<InvestmentProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('starter');
    const { cartItems, addToCart, removeFromCart } = useCart();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 500));
                setProducts(mockProducts);
                setLoading(false);
            } catch (err) {
                setError('Failed to load investment products');
                setLoading(false);
                console.error('Error fetching products:', err);
            }
        };

        fetchProducts();
    }, []);

    const filteredProducts = selectedCategory === 'all'
        ? products
        : products.filter(product => product.category === selectedCategory);

    const categories = ['all', ...new Set(products.map(product => product.category).filter(Boolean))];

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES'
        }).format(amount);
    };

    const getCartQuantity = (productId: string) => {
        const item = cartItems.find(item => item.id === productId);
        return item ? item.quantity : 0;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
                {error}
                <button
                    onClick={() => window.location.reload()}
                    className="ml-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Investment Opportunities</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Choose from our carefully curated investment products with transparent returns
                    </p>
                </div>

                {/* Category Filter */}
                <div className="mb-8 flex flex-wrap justify-center gap-2">
                    {categories.map(category => (
                        category&&
                        
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === category
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                                }`}
                                >   
                                {category?.charAt(0).toUpperCase() + category.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map(product => {
                        const cartQuantity = getCartQuantity(product.id);
                        const isInCart = cartQuantity > 0;

                        return (
                            <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="p-6">
                                    {/* Product Header */}
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
                                        <div className="flex flex-col items-end">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.riskLevel === 'high'
                                                ? 'bg-red-100 text-red-800'
                                                : product.riskLevel === 'medium'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-green-100 text-green-800'
                                                }`}>
                                                {product.riskLevel?.toUpperCase()}
                                            </span>
                                            {isInCart && (
                                                <span className="mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 flex items-center">
                                                    <FiShoppingCart className="mr-1" /> {cartQuantity} in cart
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Price */}
                                    <div className="mb-4">
                                        <p className="text-sm text-gray-500 mb-1">Investment Amount</p>
                                        <p className="text-2xl font-bold text-blue-600">{formatCurrency(product.price)}</p>
                                    </div>

                                    {/* Details Grid */}
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1 flex items-center">
                                                <FiClock className="mr-1" /> Cycle
                                            </p>
                                            <p className="font-medium">{product.cycle} days</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1 flex items-center">
                                                <FiTrendingUp className="mr-1" /> Daily
                                            </p>
                                            <p className="font-medium">{formatCurrency(product.dailyIncome)}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-sm text-gray-500 mb-1 flex items-center">
                                                <FiDollarSign className="mr-1" /> Total Return
                                            </p>
                                            <p className="font-medium text-lg">{formatCurrency(product.totalIncome)}</p>
                                        </div>
                                    </div>

                                    {/* ROI Calculation */}
                                    <div className="mb-6">
                                        <div className="flex justify-between text-sm text-gray-500 mb-1">
                                            <span>ROI</span>
                                            <span>{((product.totalIncome - product.price) / product.price * 100).toFixed(2)}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-green-500 h-2 rounded-full"
                                                style={{ width: `${Math.min(100, ((product.totalIncome - product.price) / product.price) * 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Cart Controls */}
                                    {isInCart ? (
                                        <div className="flex items-center justify-between mb-4">
                                            <button
                                                onClick={() => removeFromCart(product.id)}
                                                className="px-3 py-1 w-1/4 cursor-pointer bg-red-100 text-red-600 rounded hover:bg-red-200"
                                            >
                                                -
                                            </button>
                                            <span className="font-medium">{cartQuantity} added</span>
                                            <button
                                                onClick={() => addToCart({ id: product.id, price: product.price })}
                                                className="px-3 py-1 w-1/4 cursor-pointer bg-green-100 text-green-600 rounded hover:bg-green-200"
                                            >
                                                +
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => addToCart({ id: product.id, price: product.price })}
                                                className="w-full cursor-pointer py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center"
                                        >
                                            <FiShoppingCart className="mr-2" /> Add to Cart
                                        </button>
                                    )}

                                    {/* Info Link */}
                                    <button
                                        onClick={() => navigate(`/investments/${product.id}`)}
                                        className="mt-3 cursor-pointer w-full flex items-center justify-center text-sm text-blue-600 hover:text-blue-800"
                                    >
                                        <FiInfo className="mr-1" /> More details
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No investment products found in this category</p>
                        <button
                            onClick={() => setSelectedCategory('all')}
                            className="mt-4 px-4 cursor-pointer py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            View All Products
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}