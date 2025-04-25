// pages/disclaimer.jsx
import LegalPageLayout from '../components/LegalPageLayout';

const DisclaimerPage = () => {
    return (
        <LegalPageLayout title="Disclaimer">
            <div className="space-y-6">
                <p>
                    At HydroFund Solutions, we're committed to giving you a powerful platform for investment, growth, and financial freedom. While we strive to maintain a stable and rewarding experience, it's important to understand a few things before you begin:
                </p>

                <h2 className="text-xl font-semibold text-gray-800">We're Here to Support, Not Advise</h2>
                <p>
                    HydroFund is a digital investment platform — not a licensed bank or financial advisor. The information provided on our website and app is for educational and platform-related purposes only. We do not offer personalized financial advice.
                </p>

                <h2 className="text-xl font-semibold text-gray-800">Your Earnings Are Based on Your Activity</h2>
                <p>
                    While many users earn daily from their investments and referrals, your results may vary based on how much you invest, how active you are, and overall market demand. We make every effort to ensure fairness, but no platform can guarantee constant returns.
                </p>

                <h2 className="text-xl font-semibold text-gray-800">Invest Responsibly</h2>
                <p>
                    Like any financial platform, there are risks involved. That's why we encourage all users to start with what they're comfortable with, grow slowly, and always make informed decisions.
                </p>

                <h2 className="text-xl font-semibold text-gray-800">Transparency Is Our Promise</h2>
                <p>
                    We openly disclose all fees and deductions — including platform charges, profit distribution percentages, and referral rewards. You'll always know what's happening with your account, and our support team is ready to help if you have any questions.
                </p>

                <h2 className="text-xl font-semibold text-gray-800">Your Trust Means Everything</h2>
                <p>
                    We believe in building a long-term community. If at any point you need clarity, guidance, or support, we're just a message away. Your financial journey is personal, and we're proud to be part of it.
                </p>

                <p className="font-medium">
                    Thank you for choosing HydroFund Solutions — where your goals, growth, and trust come first.
                </p>
            </div>
        </LegalPageLayout>
    );
};

export default DisclaimerPage;