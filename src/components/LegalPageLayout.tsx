// components/LegalPageLayout.tsx
import { ReactNode } from 'react';

interface LegalPageLayoutProps {
    title: string;
    children: ReactNode;
}

const LegalPageLayout = ({ title, children }: LegalPageLayoutProps) => {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-blue-600">{title}</h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Effective Date: April 2025
                    </p>
                </div>

                <div className="prose prose-blue max-w-none">
                    {children}
                </div>

                <div className="mt-12 pt-6 border-t border-gray-200 text-center">
                    <p className="text-sm text-gray-500">
                        HydroFund Solutions - Where your goals, growth, and trust come first.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LegalPageLayout;