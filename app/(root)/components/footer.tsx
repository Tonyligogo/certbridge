import React from 'react';

const Footer = () => {
  const footerSections = [
    {
      title: "Explore Courses",
      links: [
        "Business & Leadership",
        "Tech & Digital Skills",
        "Compliance & Safety",
        "Human Resources",
        "Customer Service",
      ],
    },
    {
      title: "Delivery Formats",
      links: [
        "Virtual Online Sessions",
        "On-Site Corporate Training",
        "Arranged Venues",
        "Custom Group Packages",
        "Individual 1-on-1 Learning",
      ],
    },
    {
      title: "For Partners & Clients",
      links: [
        "Become a Certified Trainer",
        "Employer B2B Portal",
        "Venue Partnership Program",
        "Request a Training Quote",
      ],
    },
    {
      title: "Company & Trust",
      links: [
        "How CertBridge Works",
        "Quality Assurance Vetting",
        "Enterprise Case Studies",
        "Contact CertBridge Support",
      ],
    },
  ];

  return (
    <footer className="w-full bg-white rounded-t-4xl">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        
        {/* Top Section: Branding and CTAs */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-16 pb-12 border-b border-slate-100">
          
          {/* Logo Brand Area */}
          <div className="flex items-center gap-3 group cursor-pointer">
            {/* Corporate Logo Icon */}
            <div className="relative w-8 h-8 flex items-center justify-center bg-slate-950 rounded-full text-white font-black overflow-hidden tracking-tighter">
              <span className="text-xs z-10">C</span>
              <span className="text-xs z-10 -ml-0.5 text-blue-400">B</span>
              <div className="absolute inset-0 bg-linear-to-tr from-slate-900 via-transparent to-slate-800 opacity-50" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              CertBridge<span className="text-slate-500 font-medium text-lg ml-1">Global</span>
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none px-6 py-3 bg-primary text-white font-semibold text-sm rounded-xl transition-colors whitespace-nowrap">
              Get in touch
            </button>
          </div>
        </div>

        {/* Bottom Section: Mega Menu Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-6">
          {footerSections.map((section, idx) => (
            <div key={idx} className="flex flex-col">
              {/* Small Header Title */}
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-6">
                {section.title}
              </h4>
              
              {/* Links List */}
              <ul className="space-y-4">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <a 
                      href="#" 
                      className="text-[15px] font-semibold text-slate-800 hover:text-blue-600 transition-colors block leading-tight"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Sub-footer copyright area */}
        <div className="mt-16 pt-8 border-t border-slate-50 flex flex-col sm:flex-row justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} CertBridge Global. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-600">Privacy Policy</a>
            <a href="#" className="hover:text-slate-600">Terms of Service</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;