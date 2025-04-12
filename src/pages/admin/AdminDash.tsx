import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

// ========== STATIC DATA ==========
const siteStats = {
    totalVisits: 12450,
    avgSessionDuration: '4m 32s',
    bounceRate: '42%',
    pagesPerVisit: 3.8,
};

const trafficSources = {
    direct: 38,
    organic: 45,
    referral: 12,
    social: 5,
};

const conversionRates = {
    signup: 5.2,
    investment: 2.8,
    kycCompletion: 68,
};

const growthMetrics = [
    { month: 'Jan', visitors: 4200, signups: 218 },
    { month: 'Feb', visitors: 5800, signups: 305 },
    { month: 'Mar', visitors: 7200, signups: 412 },
    { month: 'Apr', visitors: 8900, signups: 467 },
    { month: 'May', visitors: 12450, signups: 647 },
];

// ========== CHARTS ==========
const trafficChart = {
    labels: Object.keys(trafficSources),
    datasets: [{
        data: Object.values(trafficSources),
        backgroundColor: [
            '#3B82F6', '#10B981', '#F59E0B', '#EC4899'
        ],
    }]
};

const conversionChart = {
    labels: ['Signups', 'Investments', 'KYC Complete'],
    datasets: [{
        data: Object.values(conversionRates),
        backgroundColor: [
            '#6366F1', '#8B5CF6', '#A855F7'
        ],
    }]
};

const growthChart = {
    labels: growthMetrics.map(m => m.month),
    datasets: [
        {
            label: 'Visitors',
            data: growthMetrics.map(m => m.visitors),
            borderColor: '#3B82F6',
            tension: 0.3,
        },
        {
            label: 'Signups',
            data: growthMetrics.map(m => m.signups),
            borderColor: '#10B981',
            tension: 0.3,
        }
    ]
};

// ========== COMPONENT ==========
const AdminAnalyticsDashboard = () => {
    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">HydroFund - Site Analytics</h1>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <MetricCard
                    title="Total Visits"
                    value={siteStats.totalVisits.toLocaleString()}
                    change="↑ 24%"
                    icon="👥"
                />
                <MetricCard
                    title="Avg. Session"
                    value={siteStats.avgSessionDuration}
                    change="↑ 18%"
                    icon="⏱️"
                />
                <MetricCard
                    title="Bounce Rate"
                    value={siteStats.bounceRate}
                    change="↓ 6%"
                    icon="↩️"
                />
                <MetricCard
                    title="Pages/Visit"
                    value={siteStats.pagesPerVisit}
                    change="↑ 12%"
                    icon="📄"
                />
            </div>

            {/* Growth Trends */}
            <div className="bg-white p-4 rounded-lg shadow mb-8">
                <h3 className="text-lg font-semibold mb-4">Visitor Growth</h3>
                <Line
                    data={growthChart}
                    options={{ responsive: true }}
                    height={300}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Traffic Sources */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">Traffic Sources</h3>
                    <div className="h-64">
                        <Pie
                            data={trafficChart}
                            options={{ maintainAspectRatio: false }}
                        />
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                        {Object.entries(trafficSources).map(([source, percent]) => (
                            <div key={source} className="flex items-center">
                                <div
                                    className="w-3 h-3 rounded-full mr-2"
                                    style={{
                                        backgroundColor: trafficChart.datasets[0].backgroundColor[
                                            trafficChart.labels.indexOf(source)
                                        ]
                                    }}
                                />
                                <span className="capitalize">{source}</span>
                                <span className="ml-auto font-medium">{percent}%</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Conversion Funnel */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">Conversion Rates</h3>
                    <div className="h-64">
                        <Bar
                            data={conversionChart}
                            options={{
                                maintainAspectRatio: false,
                                scales: { y: { beginAtZero: true, max: 100 } }
                            }}
                        />
                    </div>
                    <div className="mt-4 space-y-2">
                        {Object.entries(conversionRates).map(([stage, rate]) => (
                            <div key={stage} className="flex items-center">
                                <div className="w-24 capitalize">{stage.replace(/([A-Z])/g, ' $1')}:</div>
                                <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                                    <div
                                        className="bg-blue-600 h-2.5 rounded-full"
                                        style={{ width: `${rate}%` }}
                                    />
                                </div>
                                <span className="ml-2 w-12 font-medium">{rate}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Page Performance */}
            <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Top Performing Pages</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left p-3">Page</th>
                                <th className="text-left p-3">Visits</th>
                                <th className="text-left p-3">Avg. Time</th>
                                <th className="text-left p-3">Exit Rate</th>
                                <th className="text-left p-3">Conversion</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { page: '/invest', visits: 5840, time: '3m45s', exit: '38%', conversion: '4.2%' },
                                { page: '/projects', visits: 4920, time: '2m50s', exit: '45%', conversion: '3.1%' },
                                { page: '/about', visits: 3210, time: '1m20s', exit: '62%', conversion: '1.8%' },
                            ].map((row, i) => (
                                <tr key={i} className="border-b hover:bg-gray-50">
                                    <td className="p-3">{row.page}</td>
                                    <td className="p-3">{row.visits.toLocaleString()}</td>
                                    <td className="p-3">{row.time}</td>
                                    <td className="p-3">{row.exit}</td>
                                    <td className="p-3">
                                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                            {row.conversion}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// Reusable metric card component
const MetricCard = ({ title, value, change, icon }: any) => (
    <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex justify-between">
            <h3 className="text-gray-500">{title}</h3>
            <span className="text-xl">{icon}</span>
        </div>
        <p className="text-2xl font-bold mt-2">{value}</p>
        <p className={`mt-1 text-sm ${change.includes('↑') ? 'text-green-500' : 'text-red-500'
            }`}>
            {change} vs last period
        </p>
    </div>
);

export default AdminAnalyticsDashboard;