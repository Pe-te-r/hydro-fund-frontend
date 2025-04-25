// pages/privacy-policy.jsx
import LegalPageLayout from '../components/LegalPageLayout';

const PrivacyPolicyPage = () => {
    return (
        <LegalPageLayout title="Privacy Policy">
            <div className="space-y-6">
                <p>
                    HydroFund Solutions values your privacy and is committed to protecting your personal data. This policy explains how we collect, use, and protect your information.
                </p>

                <h2 className="text-xl font-semibold text-gray-800">Information We Collect:</h2>
                <ul className="list-disc pl-5 space-y-2">
                    <li>Full name, phone number, email address</li>
                    <li>M-Pesa number and transaction details</li>
                    <li>IP address, browser data, device info</li>
                    <li>Referral and wallet history</li>
                </ul>

                <h2 className="text-xl font-semibold text-gray-800">How We Use Your Data:</h2>
                <ul className="list-disc pl-5 space-y-2">
                    <li>To process deposits, investments, and withdrawals</li>
                    <li>To verify identity and prevent fraud</li>
                    <li>To manage referral bonuses and rewards</li>
                    <li>To send updates via SMS, email, or Telegram</li>
                    <li>To improve user experience and security</li>
                </ul>

                <h2 className="text-xl font-semibold text-gray-800">Data Sharing:</h2>
                <ul className="list-disc pl-5 space-y-2">
                    <li>We do not sell your information.</li>
                    <li>We may share data with payment providers (e.g., Safaricom/M-Pesa) and legal authorities if required.</li>
                </ul>
            </div>
        </LegalPageLayout>
    );
};

export default PrivacyPolicyPage;