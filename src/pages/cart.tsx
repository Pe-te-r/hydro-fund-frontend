import { useCart } from '../context/CartContext';
import { mockProducts } from './data';
import { FiTrash2, FiShoppingCart, FiArrowLeft } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { useCreateOrderMutation } from '../slice/invest';
import { useAuth } from '../context/AuthContext';
import { ApiErrorType } from '../types/type';

const CartPage = () => {
    const {
        cartItems,
        itemCount,
        removeFromCart,
        deleteItem,
        addToCart,
        clearCart
    } = useCart();

    const navigate = useNavigate();
    const [createOrder, { isLoading, isError, error, isSuccess }] = useCreateOrderMutation();

    // Get full product details for items in cart
    const getProductDetails = (id: string) => {
        return mockProducts.find(product => product.id === id);
    };

    const checkoutItems = cartItems.map(item => {
        const product = getProductDetails(item.id);
        return {
            productId: Number(item.id),
            productName: product?.name || 'Unknown Product',
            price: item.price,
            quantity: item.quantity,
            dailyIncome: product?.dailyIncome || 0,
            totalIncome: product?.totalIncome || 0,
            cycle: product?.cycle || 0
        };
    });


    // Calculate total cost
    const totalCost = cartItems.reduce(
        (sum, item) => sum + (item.price * item.quantity), 0
    );
    const {user}=useAuth()

    // Handle checkout
    const handleCheckout = async () => {
        try {
            // Get user ID from local storage or auth context
            const userId = user?.id
            if (!userId) {
                toast.error('You need to be logged in to checkout');
                return;
            }

            const orderData = {
                userId,
                items: checkoutItems,
                totalAmount: totalCost
            };

            console.log(orderData)
            const results = await createOrder(orderData).unwrap();
            toast.success(results.message)
            console.log(results)

        } catch (err) {

            // Error handling is done in the useEffect below
            console.error('Checkout failed:', err);
        }
    };

    // Handle API response side effects
    useEffect(() => {
        if (isError) {
            const apiError = error as ApiErrorType;
            const errorMessage = apiError?.data?.message || 'Failed to place order';

            if (errorMessage.includes('insufficient balance')) {
                toast.error('Insufficient balance in your wallet');
            } else {
                toast.error(errorMessage);
            }
        }

        if (isSuccess) {
            toast.success('Order placed successfully!');
            clearCart();
            navigate('/investments/dashboard');
        }
    }, [isError, isSuccess, error]);

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <Link
                        to="/investments"
                        className="flex cursor-pointer items-center text-blue-600 hover:text-blue-800"
                    >
                        <FiArrowLeft className="mr-2" />
                        Back to Investments
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">Your Investment Cart</h1>
                    <div className="w-8"></div> {/* Spacer for alignment */}
                </div>

                {/* Cart Content */}
                {itemCount === 0 ? (
                    <div className="bg-white rounded-xl shadow-md p-8 text-center">
                        <FiShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
                        <h2 className="mt-4 text-xl font-medium text-gray-900">Your cart is empty</h2>
                        <p className="mt-2 text-gray-500">Start adding investments to see them here</p>
                        <Link
                            to="/investments"
                            className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                        >
                            Browse Investments
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        {/* Cart Items */}
                        <div className="divide-y divide-gray-200">
                            {cartItems.map(item => {
                                const product = getProductDetails(item.id);
                                return (
                                    <div key={item.id} className="p-4 sm:p-6">
                                        <div className="flex flex-col sm:flex-row sm:items-center">
                                            {/* Product Info */}
                                            <div className="flex-1">
                                                <div className="flex items-start">
                                                    <div className="flex-shrink-0 h-16 w-16 rounded-md bg-blue-50 flex items-center justify-center">
                                                        <span className="text-blue-600 text-xl font-bold">
                                                            {product?.name.charAt(0)}
                                                        </span>
                                                    </div>
                                                    <div className="ml-4">
                                                        <h3 className="text-lg font-medium text-gray-900">{product?.name}</h3>
                                                        <p className="text-sm text-gray-500 mt-1">
                                                            {product?.cycle} day cycle • {product?.riskLevel} risk
                                                        </p>
                                                        <div className="mt-2 flex items-center space-x-4">
                                                            <span className="text-sm font-medium text-gray-900">
                                                                {item.quantity} × {item.price.toLocaleString('en-KE', {
                                                                    style: 'currency',
                                                                    currency: 'KES'
                                                                })}
                                                            </span>
                                                            <span className="text-sm font-bold text-blue-600">
                                                                {(item.price * item.quantity).toLocaleString('en-KE', {
                                                                    style: 'currency',
                                                                    currency: 'KES'
                                                                })}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="mt-4 sm:mt-0 sm:ml-6 flex items-center">
                                                <div className="flex items-center border border-gray-300 rounded-md">
                                                    <button
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="px-3 py-1 text-gray-600 cursor-pointer hover:bg-gray-100"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        -
                                                    </button>
                                                    <span className="px-3 py-1 text-gray-900">{item.quantity}</span>
                                                    <button
                                                        onClick={() => {
                                                            if (product) {
                                                                addToCart({
                                                                    id: product.id,
                                                                    price: product.price,
                                                                });
                                                            }
                                                        }}
                                                        className="px-3 cursor-pointer py-1 text-gray-600 hover:bg-gray-100"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => deleteItem(item.id)}
                                                    className="ml-4 cursor-pointer text-red-500 hover:text-red-700"
                                                >
                                                    <FiTrash2 className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Additional Info */}
                                        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-gray-500">Daily Income</p>
                                                <p className="font-medium">
                                                    {product?.dailyIncome.toLocaleString('en-KE', {
                                                        style: 'currency',
                                                        currency: 'KES'
                                                    })}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">Total Return</p>
                                                <p className="font-medium">
                                                    {product?.totalIncome.toLocaleString('en-KE', {
                                                        style: 'currency',
                                                        currency: 'KES'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Summary */}
                        <div className="bg-gray-50 px-4 py-5 sm:px-6">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-medium text-gray-900">Order Summary</h3>
                                <button
                                    onClick={clearCart}
                                    className="text-sm cursor-pointer text-red-600 hover:text-red-800"
                                >
                                    Clear Cart
                                </button>
                            </div>
                            <div className="mt-4 space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium">
                                        {totalCost.toLocaleString('en-KE', {
                                            style: 'currency',
                                            currency: 'KES'
                                        })}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Number of Items</span>
                                    <span className="font-medium">{itemCount}</span>
                                </div>
                                <div className="border-t border-gray-200 pt-3 flex justify-between">
                                    <span className="text-lg font-medium">Total</span>
                                    <span className="text-lg font-bold text-blue-600">
                                        {totalCost.toLocaleString('en-KE', {
                                            style: 'currency',
                                            currency: 'KES'
                                        })}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={handleCheckout}
                                disabled={isLoading}
                                className={`mt-6 w-full bg-blue-600 border border-transparent rounded-md py-3 px-4 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                                {isLoading ? 'Processing...' : 'Proceed to Investment'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;