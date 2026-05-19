import { 
  Database, 
  ShieldCheck, 
  Cloud, 
  Users, 
  Briefcase, 
  Headphones, 
  ArrowRight 
} from 'lucide-react';
import Link from 'next/link';

const PopularCategories = () => {
  const categories = [
    "Featured", 
    "Business & Leadership", 
    "Tech & Digital Skills", 
    "Compliance & Safety", 
    "Human Resources", 
    "Customer Service"
  ];

  const subCourses = [
    {
      title: "Data Science for Business",
      desc: "Unlock insights with data analytics and strategic decision making.",
      icon: <Database className="text-blue-500" size={24} />,
    },
    {
      title: "AWS Cloud Certification",
      desc: "Prepare for professional cloud architecture and deployment exams.",
      icon: <Cloud className="text-sky-400" size={24} />,
    },
    {
      title: "Cybersecurity Fundamentals",
      desc: "Protect organizational assets with modern security protocols.",
      icon: <ShieldCheck className="text-indigo-600" size={24} />,
    },
    {
      title: "Advanced Sales Training",
      desc: "Master high-ticket closing and relationship management.",
      icon: <Briefcase className="text-orange-500" size={24} />,
    },
    {
      title: "HR Compliance & Ethics",
      desc: "Navigate legal requirements and workplace culture standards.",
      icon: <Users className="text-emerald-500" size={24} />,
    },
    {
      title: "Customer Success Support",
      desc: "Deliver exceptional service and increase client retention.",
      icon: <Headphones className="text-yellow-500" size={24} />,
    },
  ];

  return (
    <section className="max-w-7xl mx-auto p-4 bg-slate-50 ">
      <div className="mb-8">
      {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div className="max-w-3xl">
              <span className="text-sm font-semibold uppercase tracking-wider">
                Our Course Portfolio
              </span>
              <h2 className="mt-3 text-4xl lg:text-5xl font-bold ">
                Explore our expert-led professional training categories
              </h2>
            </div>
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 text-primary font-semibold transition"
            >
              View all categories <ArrowRight className="h-4 w-4" />
            </Link>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-3">
          {categories.map((cat, i) => (
            <button
              key={cat}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                i === 0 
                ? "bg-primary text-white ring-2 ring-blue-200 ring-offset-2" 
                : "bg-primary/10 text-slate-700 hover:bg-slate-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Featured Card (Spans 2 rows) */}
        <div className="md:row-span-2 relative overflow-hidden rounded-3xl bg-slate-900 text-white p-8 flex flex-col justify-end min-h-[500px] group">
          {/* Background Image Placeholder */}
          <div className="absolute inset-0 opacity-50 transition-transform duration-500 group-hover:scale-105">
            <img 
              src="https://images.pexels.com/photos/8276212/pexels-photo-8276212.jpeg" 
              alt="Leadership Training"
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="relative z-10">
            <h3 className="text-3xl font-bold mb-3">Leadership Training</h3>
            <p className="text-slate-200 mb-6 text-sm leading-relaxed">
              Develop management skills, build strong teams, and lead with clarity and vision.
            </p>
            <button className="bg-primary text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-white transition-colors">
              Explore all leadership courses
            </button>
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {subCourses.map((course, idx) => (
            <div 
              key={idx} 
              className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full"
            >
              <h4 className="text-xl font-bold text-slate-900 mb-3 leading-tight">
                {course.title}
              </h4>
              <p className="text-slate-500 text-sm mb-8 grow">
                {course.desc}
              </p>
              <button className="flex items-center gap-2 text-primary font-semibold text-sm hover:underline group">
                Explore the courses
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularCategories;