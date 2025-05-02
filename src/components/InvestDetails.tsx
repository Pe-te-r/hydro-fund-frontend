import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    FiDollarSign,
    FiClock,
    FiTrendingUp,
    FiArrowLeft,
    FiCalendar,
    FiPieChart,
    FiBarChart2,
    FiShield
} from 'react-icons/fi';
import { InvestmentProduct } from '../pages/Invest';
import { mockProducts } from '../pages/data';

export default function InvestmentDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState<InvestmentProduct | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 300));
                const foundProduct = mockProducts.find(p => p.id === id);
                if (foundProduct) {
                    setProduct(foundProduct);
                } else {
                    navigate('/investments', { replace: true });
                }
                setLoading(false);
            } catch (err) {
                console.error('Error fetching product:', err);
                navigate('/investments', { replace: true });
            }
        };

        fetchProduct();
    }, [id, navigate]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES'
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-center">
                Product not found
                <button
                    onClick={() => navigate('/investments')}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Back to Investments
                </button>
            </div>
        );
    }

    const profit = product.totalIncome - product.price;
    const roi = (profit / product.price) * 100;

    return (
        <div className="bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate('/investments')}
                    className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
                >
                    <FiArrowLeft className="mr-2" /> Back to Investments
                </button>

                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="p-6 md:p-8">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-8">
                            <div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium mb-2 inline-block ${product.riskLevel === 'high' ? 'bg-red-100 text-red-800' :
                                        product.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-green-100 text-green-800'
                                    }`}>
                                    {product.riskLevel?.toUpperCase()} RISK
                                </span>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{product.name}</h1>
                                <p className="text-gray-600 mt-2">{product.category?.toUpperCase()} PACKAGE</p>
                            </div>
                            <div className="mt-4 md:mt-0 text-right">
                                <p className="text-sm text-gray-500">Investment Amount</p>
                                <p className="text-3xl font-bold text-blue-600">{formatCurrency(product.price)}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            {/* Key Metrics */}
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <h2 className="text-lg font-semibold mb-4 flex items-center">
                                    <FiBarChart2 className="mr-2 text-blue-500" /> Investment Metrics
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 flex items-center">
                                            <FiClock className="mr-2" /> Investment Duration
                                        </span>
                                        <span className="font-medium">{product.cycle} days</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 flex items-center">
                                            <FiTrendingUp className="mr-2" /> Daily Income
                                        </span>
                                        <span className="font-medium">{formatCurrency(product.dailyIncome)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 flex items-center">
                                            <FiDollarSign className="mr-2" /> Total Return
                                        </span>
                                        <span className="font-medium text-green-600">{formatCurrency(product.totalIncome)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 flex items-center">
                                            <FiPieChart className="mr-2" /> Net Profit
                                        </span>
                                        <span className="font-medium text-green-600">{formatCurrency(profit)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 flex items-center">
                                            <FiCalendar className="mr-2" /> ROI
                                        </span>
                                        <span className="font-medium">{roi.toFixed(2)}%</span>
                                    </div>
                                </div>
                            </div>

                            {/* ROI Breakdown */}
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <h2 className="text-lg font-semibold mb-4 flex items-center">
                                    <FiPieChart className="mr-2 text-blue-500" /> ROI Breakdown
                                </h2>
                                <div className="mb-4">
                                    <div className="flex justify-between text-sm text-gray-500 mb-1">
                                        <span>Investment</span>
                                        <span>{formatCurrency(product.price)}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                                        <div
                                            className="bg-blue-500 h-2 rounded-full"
                                            style={{ width: '100%' }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-500 mb-1">
                                        <span>Profit</span>
                                        <span>{formatCurrency(profit)}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-green-500 h-2 rounded-full"
                                            style={{ width: `${Math.min(100, roi)}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <h3 className="font-medium text-blue-800 mb-2 flex items-center">
                                        <FiShield className="mr-2" /> Risk Assessment
                                    </h3>
                                    <p className="text-sm text-blue-700">
                                        This {product.riskLevel} risk investment is suitable for {
                                            product.riskLevel === 'high' ? 'experienced investors willing to accept higher volatility' :
                                                product.riskLevel === 'medium' ? 'investors with some experience looking for balanced growth' :
                                                    'conservative investors seeking stable returns'
                                        }.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Detailed Description */}
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold mb-4">About This Investment</h2>
                            <div className="prose prose-sm text-gray-600">
                                <p>
                                    This {product.category} investment package offers a fixed return of {formatCurrency(product.totalIncome)}
                                    over {product.cycle} days, with daily payouts of {formatCurrency(product.dailyIncome)}.
                                    Your capital of {formatCurrency(product.price)} will be invested in {
                                        product.category === 'agriculture' ? 'selected agricultural projects with proven track records' :
                                            product.category === 'real estate' ? 'prime real estate developments in growing markets' :
                                                product.category === 'technology' ? 'high-growth technology startups with innovative solutions' :
                                                    'diversified portfolios across multiple high-potential sectors'
                                    }.
                                </p>
                                <p className="mt-3">
                                    The projected {roi.toFixed(2)}% return is based on historical performance and current market conditions.
                                    All investments are managed by our team of expert portfolio managers with strict risk management protocols.
                                </p>
                            </div>
                        </div>

                        {/* Key Features */}
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold mb-4">Key Features</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-start">
                                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                                        <FiClock className="text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium">Fixed Duration</h3>
                                        <p className="text-sm text-gray-600">Lock-in period of {product.cycle} days</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="bg-green-100 p-2 rounded-full mr-3">
                                        <FiTrendingUp className="text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium">Daily Payouts</h3>
                                        <p className="text-sm text-gray-600">Receive {formatCurrency(product.dailyIncome)} every day</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="bg-purple-100 p-2 rounded-full mr-3">
                                        <FiShield className="text-purple-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium">Capital Protection</h3>
                                        <p className="text-sm text-gray-600">Principal amount secured</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="bg-yellow-100 p-2 rounded-full mr-3">
                                        <FiDollarSign className="text-yellow-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium">Guaranteed Returns</h3>
                                        <p className="text-sm text-gray-600">{formatCurrency(product.totalIncome)} total payout</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Terms and Conditions */}
                        <div className="border-t border-gray-200 pt-6">
                            <h2 className="text-lg font-semibold mb-4">Terms & Conditions</h2>
                            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-2">
                                <li>Minimum investment period is {product.cycle} days</li>
                                <li>Early withdrawals attract a 25% penalty fee</li>
                                <li>Daily payouts are made on the last day</li>
                                {/* <li>Investment is automatically renewed unless cancelled 7 days before maturity</li> */}
                                <li>All investments are subject to our terms of service</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}