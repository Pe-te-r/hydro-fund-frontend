import React from 'react';
import { FiMail, FiChevronDown } from 'react-icons/fi';
import { Link } from 'react-router-dom';

interface FooterLink {
    name: string;
    url: string;
}

interface ContactItem {
    name: string;
    icon: React.ReactNode;
    url:string
}

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();
    const [expandedSection, setExpandedSection] = React.useState<string | null>(null);

    const toggleSection = (section: string) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    const quickLinks: FooterLink[] = [
        { name: 'Home', url: '/' },
        { name: 'About', url: '/about' },
        { name: 'Invest', url: '/investments' },
    ];

    const legalLinks: FooterLink[] = [
        { name: 'Privacy Policy', url: '/privacy' },
        { name: 'Terms', url: '/terms' },
        { name: 'Disclaimer', url: '/disclaimer' },
    ];

    const contactItems: ContactItem[] = [
        { name: 'solution@hydrofundsolutions.com', icon: <FiMail />, url:'' },
    ];

    return (
        <footer className="bg-gradient-to-br from-blue-800 to-blue-600 text-white">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand Column */}
                    <Link to='/' className="md:col-span-1">
                        <div className="flex items-center mb-4">
                            <div className="bg-white/10 p-2 rounded-lg mr-3">
                                <div className="w-10 h-10 bg-white rounded flex items-center justify-center text-blue-800 font-bold">HF</div>
                            </div>
                            <h2 className="text-xl font-bold">HydroFund</h2>
                        </div>
                        <p className="text-blue-100 text-sm mb-4">
                            Sustainable hydropower investments for a greener future.
                        </p>
                    </Link>

                    {/* Collapsible Sections */}
                    {[
                        { title: 'Quick Links', items: quickLinks, id: 'quick' },
                        { title: 'Legal', items: legalLinks, id: 'legal' },
                        { title: 'Contact', items: contactItems, id: 'contact' }
                    ].map((section) => (
                        <div key={section.id} className="md:col-span-1">
                            <button
                                className="md:hidden w-full flex justify-between items-center py-2 text-left"
                                onClick={() => toggleSection(section.id)}
                                aria-expanded={expandedSection === section.id}
                            >
                                <h3 className="text-lg font-semibold">{section.title}</h3>
                                <FiChevronDown className={`transition-transform ${expandedSection === section.id ? 'rotate-180' : ''}`} />
                            </button>

                            <h3 className="hidden md:block text-lg font-semibold mb-4">{section.title}</h3>

                            <ul className={`${expandedSection === section.id ? 'block' : 'hidden'} md:block space-y-2`}>
                                {section.items.map((item, index) => (
                                    <li key={index}>
                                       {section.id === 'contact' ? (
                                           <div className="flex items-start text-blue-100 hover:text-white transition-colors">
                                               <span className="mr-2 mt-0.5">{(item as ContactItem).icon}</span>
                                               <span>{item.name}</span>
                                           </div>
                                       ) : (
                                           <Link
                                                   to={item?.url || ''}
                                               className="text-blue-100 hover:text-white transition-colors block py-1 text-sm"
                                           >
                                               {item.name}
                                           </Link>
                                       )}
                                   </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="border-t border-blue-500/30 my-6"></div>

                <div className="flex flex-col md:flex-row justify-between items-center">
                    <p className="text-blue-200 text-xs md:text-sm order-2 md:order-1 mt-4 md:mt-0">
                        &copy; {currentYear} HydroFund. All rights reserved.
                    </p>

                    <div className="order-1 md:order-2 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs md:text-sm">
                        <Link to="/privacy" className="text-blue-200 hover:text-white">Privacy</Link>
                        <Link to="/terms" className="text-blue-200 hover:text-white">Terms</Link>
                        <Link to="/disclaimer" className="text-blue-200 hover:text-white">Disclaimer</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;