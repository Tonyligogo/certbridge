const ActionCTA = () => {
  return (
    <section className="w-full py-16 px-4 bg-[#f8fafd]">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-12">
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-600 mb-3">
            Get Started
          </p>
          <h2 className="text-4xl md:text-5xl font-semibold text-[#1a1a1a] tracking-tight">
            Take the next step with CertBridge
          </h2>
        </div>

        {/* CTA Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 1: Contact Us */}
          <div className="group flex flex-col bg-white rounded-3xl md:rounded-[32px] overflow-hidden border border-slate-100 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
            <div className="h-[180px] md:h-[280px] w-full overflow-hidden">
              <img 
                src="https://images.pexels.com/photos/8867252/pexels-photo-8867252.jpeg" 
                alt="Contact our team"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-6 md:p-10 flex flex-col flex-grow">
              <h3 className="text-2xl font-bold text-[#1a1a1a] mb-4">
                Contact Our Team
              </h3>
              <p className="text-slate-600 leading-relaxed mb-10 flex-grow">
                Discuss your training needs, explore custom solutions for groups, and get a tailored consultation from our specialists.
              </p>
              <div>
                <button className="bg-primary text-white px-7 py-3 rounded-lg font-bold text-sm">
                  Get in touch
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Create Account */}
          <div className="group flex flex-col bg-white rounded-3xl md:rounded-[32px] overflow-hidden border border-slate-100 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
            <div className="h-[180px] md:h-[280px] w-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-12">
              {/* Illustration Placeholder */}
              <div className="relative w-full h-full flex items-center justify-center">
                 <div className="w-48 h-32 bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-indigo-200 shadow-lg flex flex-col p-4">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full mb-3" />
                    <div className="w-full h-2 bg-slate-200 rounded-full mb-2" />
                    <div className="w-2/3 h-2 bg-slate-100 rounded-full" />
                    <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-emerald-400 rounded-2xl flex items-center justify-center shadow-lg transform rotate-12">
                      <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                 </div>
              </div>
            </div>
            <div className="p-6 md:p-10 flex flex-col flex-grow">
              <h3 className="text-2xl font-bold text-[#1a1a1a] mb-4">
                Create An Account
              </h3>
              <p className="text-slate-600 leading-relaxed mb-10 flex-grow">
                Join our training community to instantly unlock exclusive discounts, early course access, and manage your learning journey.
              </p>
              <div>
                <button className="bg-primary text-white px-7 py-3 rounded-lg font-bold text-sm">
                  Create an account
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ActionCTA;