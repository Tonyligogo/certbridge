import { Monitor, Building2, MapPin, ArrowRight } from 'lucide-react';

const DeliveryFormats = () => {
  const formats = [
    {
      tag: "Online Sessions",
      title: "Join Anywhere",
      description: "Live, interactive training with our expert instructors, fully accessible from any location via a secure online platform.",
      linkText: "Explore digital options",
      icon: <Monitor className="text-blue-400" size={32} />,
    },
    {
      tag: "Client Site",
      title: "In-House Solution",
      description: "Bring our trainers and content directly to your company's premises. Fully customized for your team and internal workspace.",
      linkText: "Request on-site quote",
      icon: <Building2 className="text-emerald-400" size={32} />,
    },
    {
      tag: "Arranged Venue",
      title: "Dedicated Space",
      description: "Host your training at a professional off-site location we arrange, complete with all technology and catering.",
      linkText: "View venue details",
      icon: <MapPin className="text-orange-400" size={32} />,
    },
  ];

  return (
    <section className="w-full pt-16 pb-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
            Choose Your Experience
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Empowering your team with flexible training delivery options that meet your unique needs and environment.
          </p>
        </div>

        {/* Hero Background Container */}
        <div className="relative md:rounded-[40px] overflow-hidden min-h-[600px] flex flex-col md:flex-row md:items-end gap-6 md:gap-0 p-2 md:p-12">
          {/* Background Image */}
          <div className="block md:absolute inset-0 z-0 rounded-3xl overflow-hidden">
            <img 
              src="https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg" 
              alt="Training Collaboration"
              className="w-full h-full object-cover object-bottom"
            />
            {/* Subtle overlay to blend cards */}
            <div className="hidden md:absolute inset-0 bg-black/10" />
          </div>

          {/* Cards Grid */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            {formats.map((format, index) => (
              <div 
                key={index} 
                className="bg-white/85 backdrop-blur-xl p-6 md:p-8 rounded-3xl md:rounded-[32px] border border-slate-100 md:border-white/40 shadow-sm md:shadow-2xl flex flex-col h-full group transition-transform hover:-translate-y-2"
              >
                <div className="mb-6 flex justify-between items-start">
                  <div className="p-3 bg-white rounded-2xl shadow-sm">
                    {format.icon}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    {format.tag}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  {format.title}
                </h3>
                
                <p className="text-slate-600 text-sm leading-relaxed mb-8 flex-grow">
                  {format.description}
                </p>

                <button className="flex items-center gap-2 cursor-pointer text-sm font-bold text-primary border-b-2 border-transparent hover:border-primary w-fit transition-all pb-1">
                  {format.linkText}
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeliveryFormats;