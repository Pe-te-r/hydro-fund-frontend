// pages/terms-and-conditions.jsx
import LegalPageLayout from '../components/LegalPageLayout';

const TermsAndConditionsPage = () => {
    return (
        <LegalPageLayout title="Terms & Conditions">
            <div className="space-y-8">
                <p>
                    Welcome to HydroFund Solutions, a smart investment and digital wallet platform designed to help you grow your income, build passive wealth, and earn from referrals in a secure and supportive environment.
                </p>
                <p>
                    By using this platform, you agree to the terms below. Please take a moment to review them carefully.
                </p>

                <div className="space-y-6">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">1. Account Eligibility</h2>
                        <ul className="list-disc pl-5 space-y-2 mt-2">
                            <li>You must be at least 18 years old to register and use HydroFund.</li>
                            <li>Only one account is allowed per M-Pesa number.</li>
                            <li>Accounts linked to the same identity, IP address, or contact info may be reviewed for misuse.</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">2. Purpose of the Platform</h2>
                        <p>
                            HydroFund is a digital investment and project funding platform, designed to allow users to invest in oil-related products, earn profit based on duration, and invite others to earn bonuses.
                            It is not a licensed bank or regulated investment advisor.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">3. Investments</h2>
                        <ul className="list-disc pl-5 space-y-2 mt-2">
                            <li>Minimum deposit: KES 300</li>
                            <li>Each investment product includes:
                                <ul className="list-circle pl-5 mt-2 space-y-1">
                                    <li>A fixed price</li>
                                    <li>A defined cycle (e.g., 2 hours, 3 days, 30 days)</li>
                                    <li>A specific return shown before you invest</li>
                                </ul>
                            </li>
                            <li>Earnings are added to your wallet after the product's cycle is completed.</li>
                        </ul>
                    </div>

                    {/* Continue with other sections following the same pattern */}
                    {/* Sections 4-12 would follow the same structure */}

                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">12. Support & Contact</h2>
                        <p className="mt-2">For questions or assistance, you can reach us at:</p>
                        <ul className="list-disc pl-5 space-y-2 mt-2">
                            <li>Email: support@hydrofundsolutions.com</li>
                            <li>Telegram: Join Our Community</li>
                            <li>In-app support: Available through your dashboard</li>
                        </ul>
                    </div>

                    <p className="font-medium mt-6">
                        By using HydroFund Solutions, you accept and agree to these terms.
                        Let's build something great — together.
                    </p>
                </div>
            </div>
        </LegalPageLayout>
    );
};

export default TermsAndConditionsPage;