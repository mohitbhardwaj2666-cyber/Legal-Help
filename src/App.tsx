import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { Scale, Briefcase, Users, Hop as Home, Calendar, CircleCheck as CheckCircle, Menu, X, ChevronRight, Phone, Mail, MapPin, Clock, Shield, Award, BookOpen, ArrowLeft, MessageCircle, Globe, CreditCard, Building2, Gavel, Landmark, FileText, ChevronDown } from 'lucide-react';
import { supabase } from './lib/supabase';
import { I18nProvider, useI18n } from './lib/i18n';
import type { User } from '@supabase/supabase-js';

type Page = 'home' | 'about' | 'services' | 'contact' | 'booking' | 'dashboard' | 'blog';

const NAV_PAGES: Page[] = ['home', 'about', 'services', 'blog', 'contact'];

export default function App() {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  );
}

function AppContent() {
  const { t, toggleLang } = useI18n();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const navigateTo = (page: Page) => {
    setIsMobileMenuOpen(false);
    navigate(page === 'home' ? '/' : `/${page}`);
    window.scrollTo(0, 0);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center">
          <Scale className="w-12 h-12 text-slate-800 animate-pulse mb-4" />
          <p className="text-slate-600 font-medium">Initializing Secure Environment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-slate-200">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link to="/" className="flex items-center group" onClick={() => setIsMobileMenuOpen(false)}>
              <div className="bg-slate-900 text-white p-2 rounded mr-3 group-hover:bg-slate-800 transition-colors">
                <Scale size={24} />
              </div>
              <div>
                <h1 className="font-bold text-xl tracking-tight text-slate-900">Advocate Mohit Bhardwaj</h1>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">District Courts</p>
              </div>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              {NAV_PAGES.map((page) => (
                <Link
                  key={page}
                  to={page === 'home' ? '/' : `/${page}`}
                  className="text-sm font-medium transition-colors duration-200 text-slate-600 hover:text-slate-900"
                >
                  {t(`nav.${page}`)}
                </Link>
              ))}
              <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-slate-200">
                <Link
                  to="/case-studies"
                  className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  {t('nav.caseStudies')}
                </Link>
                <Link
                  to="/dashboard"
                  className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  {t('nav.portal')}
                </Link>
                <button
                  onClick={toggleLang}
                  className="flex items-center space-x-1 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors border border-slate-200 rounded px-2.5 py-1.5"
                >
                  <Globe size={14} />
                  <span>{t('lang.label')}</span>
                </button>
                <Link
                  to="/booking"
                  className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded text-sm font-medium transition-all shadow-sm flex items-center"
                >
                  <Calendar size={16} className="mr-2" />
                  {t('nav.consult')}
                </Link>
              </div>
            </div>

            <div className="md:hidden flex items-center space-x-2">
              <button
                onClick={toggleLang}
                className="flex items-center space-x-1 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors border border-slate-200 rounded px-2 py-1.5"
              >
                <Globe size={14} />
                <span>{t('lang.label')}</span>
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-slate-600 hover:text-slate-900 focus:outline-none p-2"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 absolute w-full shadow-lg">
            <div className="px-4 pt-2 pb-6 space-y-2">
              {[...NAV_PAGES, 'dashboard' as Page].map((page) => (
                <Link
                  key={page}
                  to={page === 'home' ? '/' : `/${page}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-left px-4 py-3 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                >
                  {page === 'dashboard' ? t('nav.portal') : t(`nav.${page}`)}
                </Link>
              ))}
              <Link
                to="/case-studies"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full text-left px-4 py-3 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900"
              >
                {t('nav.caseStudies')}
              </Link>
              <div className="pt-4 px-4">
                <Link
                  to="/booking"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full bg-slate-900 text-white px-4 py-3 rounded-md text-base font-medium flex items-center justify-center"
                >
                  <Calendar size={18} className="mr-2" />
                  {t('nav.consult')}
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      <main className="flex-grow flex flex-col">
        <Routes>
          <Route path="/" element={<HomeView navigateTo={navigateTo} />} />
          <Route path="/about" element={<AboutView navigateTo={navigateTo} />} />
          <Route path="/services" element={<ServicesView navigateTo={navigateTo} />} />
          <Route path="/blog" element={<BlogView />} />
          <Route path="/blog/:id" element={<BlogPostView />} />
          <Route path="/contact" element={<ContactView user={user} />} />
          <Route path="/booking" element={<BookingView user={user} navigateTo={navigateTo} />} />
          <Route path="/dashboard" element={<DashboardView user={user} />} />
          <Route path="/terms" element={<TermsView />} />
          <Route path="/privacy" element={<PrivacyView />} />
          <Route path="/case-studies" element={<CaseStudiesView />} />
        </Routes>
      </main>

      <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center text-white mb-4">
                <Scale size={24} className="mr-2" />
                <span className="font-bold text-xl tracking-tight">Advocate Mohit Bhardwaj</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed max-w-sm mb-6">
                Providing strategic, results-driven legal counsel across District Courts. Specializing in RERA, Matrimonial, Consumer, and Commercial Litigation.
              </p>
              <div className="flex space-x-4">
                <a href="https://www.linkedin.com/in/mohit-bhardwaj-95287b157/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center hover:bg-slate-700 cursor-pointer transition-colors text-xs font-medium">in</a>
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors">About Firm</Link></li>
                <li><Link to="/services" className="hover:text-white transition-colors">Practice Areas</Link></li>
                <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link to="/dashboard" className="hover:text-white transition-colors">Client Portal</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Contact</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start">
                  <MapPin size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                  <span>LE/A 603, Luxuria Estate,<br />Sector 6, Aditya World City,<br />Ghaziabad 201002</span>
                </li>
                <li className="flex items-center">
                  <Phone size={16} className="mr-2 flex-shrink-0" />
                  <span>+91 8527200481</span>
                </li>
                <li className="flex items-center">
                  <Mail size={16} className="mr-2 flex-shrink-0" />
                  <span>adv.mohit.bhardwaj1@gmail.com</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-12 pt-8 text-sm text-slate-500 flex flex-col md:flex-row justify-between items-center">
            <p>&copy; {new Date().getFullYear()} Advocate Mohit Bhardwaj. All rights reserved.</p>
            <div className="space-x-4 mt-4 md:mt-0">
              <Link to="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>

      <a
        href="https://wa.me/8527200481?text=Hello%20Advocate%20Bhardwaj,%20I%20would%20like%20to%20inquire%20about%20a%20legal%20consultation"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-colors"
        aria-label="Contact on WhatsApp"
      >
        <MessageCircle size={28} />
      </a>
    </div>
  );
}

function HomeView({ navigateTo }: { navigateTo: (page: Page) => void }) {
  return (
    <div className="flex flex-col w-full">
      <section className="bg-slate-900 text-white py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center">
          <div className="md:w-3/5 pr-0 md:pr-12">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-sm font-medium mb-6">
              <Shield size={14} className="mr-2 text-blue-400" />
              Trusted Legal Representation in District Courts
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Strategic Counsel.<br />
              <span className="text-slate-400">Decisive Results.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl leading-relaxed">
              Specialized litigation and advisory services focusing on Real Estate (RERA), Matrimonial Disputes, Consumer Protection, and Commercial Law across District Courts.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => navigateTo('booking')}
                className="bg-white text-slate-900 hover:bg-slate-100 px-8 py-4 rounded font-semibold text-lg transition-colors flex items-center justify-center shadow-lg"
              >
                Book Consultation <ChevronRight size={20} className="ml-2" />
              </button>
              <button
                onClick={() => navigateTo('services')}
                className="border border-slate-600 text-white hover:bg-slate-800 px-8 py-4 rounded font-medium text-lg transition-colors flex items-center justify-center"
              >
                Explore Practices
              </button>
            </div>
          </div>
          <div className="md:w-2/5 mt-12 md:mt-0 hidden md:block">
            <div className="grid grid-cols-2 gap-4 h-96">
              <div className="bg-slate-800 rounded-lg p-6 flex flex-col justify-end transform translate-y-8 shadow-2xl border border-slate-700">
                <Briefcase size={32} className="text-blue-400 mb-4" />
                <h3 className="font-semibold text-lg">Commercial</h3>
              </div>
              <div className="bg-slate-800 rounded-lg p-6 flex flex-col justify-end shadow-2xl border border-slate-700">
                <Home size={32} className="text-blue-400 mb-4" />
                <h3 className="font-semibold text-lg">RERA & Property</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white border-b border-slate-200 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-100">
            <div>
              <div className="text-3xl font-bold text-slate-900 mb-1">100%</div>
              <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">Client Dedication</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900 mb-1">Modern</div>
              <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">Legal Approach</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900 mb-1">Focused</div>
              <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">Case Strategy</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900 mb-1">District</div>
              <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">Courts Focus</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Core Practice Areas</h2>
            <div className="w-16 h-1 bg-blue-700 mx-auto rounded"></div>
            <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">Focused expertise ensuring meticulous representation and robust strategies tailored to your unique legal challenges.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Home, title: "RERA & Property", desc: "Real estate disputes, builder-buyer agreements, and property litigation." },
              { icon: Users, title: "Matrimonial", desc: "Divorce, alimony, child custody, and domestic violence proceedings." },
              { icon: Award, title: "Consumer Law", desc: "Medical negligence, product liability, and deficiency in services." },
              { icon: Briefcase, title: "Commercial", desc: "Contract enforcement, corporate disputes, and arbitration." }
            ].map((service, idx) => (
              <div key={idx} className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow group">
                <div className="w-14 h-14 bg-slate-50 rounded-lg flex items-center justify-center mb-6 text-slate-700 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                  <service.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
                <p className="text-slate-600 leading-relaxed mb-6">{service.desc}</p>
                <button
                  onClick={() => navigateTo('services')}
                  className="text-blue-700 font-medium flex items-center hover:text-blue-900 transition-colors text-sm"
                >
                  Learn more <ChevronRight size={16} className="ml-1" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Need Legal Assistance?</h2>
          <p className="text-lg text-slate-600 mb-10">Schedule a confidential consultation to discuss your legal options and strategy.</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button
              onClick={() => navigateTo('booking')}
              className="bg-slate-900 text-white hover:bg-slate-800 px-8 py-4 rounded font-semibold text-lg transition-colors flex items-center justify-center shadow-lg"
            >
              Book Appointment <Calendar size={20} className="ml-2" />
            </button>
            <button
              onClick={() => navigateTo('contact')}
              className="bg-slate-100 text-slate-900 hover:bg-slate-200 px-8 py-4 rounded font-semibold text-lg transition-colors flex items-center justify-center"
            >
              Send an Inquiry
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function AboutView({ navigateTo }: { navigateTo: (page: Page) => void }) {
  return (
    <div className="py-12 bg-slate-50 flex-grow">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="md:flex">
            <div className="md:w-2/5 bg-slate-200 relative min-h-[400px]">
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800 text-slate-300 p-8 text-center">
                <Scale size={64} className="mb-6 opacity-50" />
                <p className="text-sm font-medium tracking-widest uppercase mb-2">Advocate</p>
                <h2 className="text-3xl font-bold text-white">Mohit Bhardwaj</h2>
                <p className="mt-4 italic">"Justice delayed is justice denied. We strive for timely and effective resolutions."</p>
              </div>
            </div>
            <div className="md:w-3/5 p-8 md:p-12 lg:p-16">
              <h1 className="text-3xl font-bold text-slate-900 mb-6">Profile & Philosophy</h1>
              <div className="w-12 h-1 bg-blue-700 rounded mb-8"></div>
              <div className="prose prose-slate prose-lg">
                <p className="text-slate-600 mb-6 leading-relaxed">
                  As a dedicated and dynamic advocate practicing in the District Courts, I bring a fresh, meticulous, and highly focused approach to modern legal challenges. My practice is built on a strong academic foundation and a relentless drive to secure the best possible outcomes for my clients.
                </p>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  My firm operates on the principles of transparency, strategic litigation, and empathetic counseling in sensitive matters such as family disputes. I believe that every client deserves dedicated attention, constant communication, and an advocate who is deeply invested in their case.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 mt-8 mb-4 flex items-center">
                  <Award size={20} className="mr-2 text-blue-700" /> Professional Focus
                </h3>
                <ul className="list-none space-y-2 text-slate-600">
                  <li className="flex items-center"><CheckCircle size={16} className="mr-2 text-green-600" /> District Court Bar Association</li>
                  <li className="flex items-center"><CheckCircle size={16} className="mr-2 text-green-600" /> Real Estate & RERA Authority Proceedings</li>
                  <li className="flex items-center"><CheckCircle size={16} className="mr-2 text-green-600" /> Consumer Disputes Redressal Forums</li>
                </ul>
              </div>
              <div className="mt-12 pt-8 border-t border-slate-100">
                <button
                  onClick={() => navigateTo('contact')}
                  className="bg-slate-900 text-white px-6 py-3 rounded font-medium hover:bg-slate-800 transition-colors inline-flex items-center"
                >
                  Get in Touch <ChevronRight size={18} className="ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ServicesView({ navigateTo }: { navigateTo: (page: Page) => void }) {
  const services = [
    {
      id: 'rera', title: 'RERA & Real Estate', icon: Home,
      description: 'Comprehensive representation for homebuyers, developers, and agents under the Real Estate (Regulation and Development) Act.',
      details: ['Filing complaints with RERA Authority', 'Execution of RERA orders', 'Builder-Buyer agreement vetting', 'Property title disputes & civil suits']
    },
    {
      id: 'matrimonial', title: 'Matrimonial & Family Law', icon: Users,
      description: 'Sensitive yet firm handling of complex family dynamics, prioritizing client well-being and equitable resolutions.',
      details: ['Mutual & Contested Divorce', 'Child Custody & Visitation rights', 'Maintenance and Alimony', 'Domestic Violence (PWDVA) proceedings']
    },
    {
      id: 'consumer', title: 'Consumer Protection', icon: Award,
      description: 'Aggressive pursuit of justice against unfair trade practices and deficiency in goods or services.',
      details: ['District Consumer Disputes Redressal Commission', 'Medical negligence cases', 'Insurance claim disputes', 'E-commerce disputes']
    },
    {
      id: 'commercial', title: 'Commercial Litigation', icon: Briefcase,
      description: 'Protecting business interests through strategic litigation and alternative dispute resolution mechanisms.',
      details: ['Breach of contract suits', 'Arbitration & Conciliation', 'Recovery suits (Order 37)', 'Insolvency proceedings (NCLT)']
    }
  ];

  return (
    <div className="py-12 bg-slate-50 flex-grow">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Areas of Expertise</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">Providing specialized legal services across key domains in the District Courts jurisdiction.</p>
        </div>
        <div className="space-y-12">
          {services.map((service, index) => (
            <div key={service.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden md:flex flex-row-reverse group">
              <div className={`md:w-1/3 bg-slate-100 flex items-center justify-center p-12 ${index % 2 === 0 ? 'md:order-last border-l' : 'md:border-r border-slate-200'}`}>
                <service.icon size={80} className="text-slate-300 group-hover:text-slate-400 transition-colors duration-500" />
              </div>
              <div className="md:w-2/3 p-8 md:p-12">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-blue-50 text-blue-700 rounded-lg flex items-center justify-center mr-4">
                    <service.icon size={20} />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">{service.title}</h2>
                </div>
                <p className="text-slate-600 text-lg mb-8 leading-relaxed">{service.description}</p>
                <div className="bg-slate-50 rounded-lg p-6 border border-slate-100">
                  <h4 className="font-semibold text-slate-900 mb-4 flex items-center">
                    <BookOpen size={18} className="mr-2" /> Key Services
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {service.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start text-slate-700 text-sm">
                        <CheckCircle size={16} className="text-slate-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-8">
                  <button
                    onClick={() => navigateTo('booking')}
                    className="text-slate-900 font-semibold hover:text-blue-700 transition-colors flex items-center border-b-2 border-transparent hover:border-blue-700 pb-1"
                  >
                    Consult for {service.title} <ChevronRight size={16} className="ml-1 mt-0.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ContactView({ user }: { user: User | null }) {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setStatus('error');
      return;
    }
    setStatus('loading');
    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert({ name: formData.name, email: formData.email, phone: formData.phone, message: formData.message, user_id: user.id });
      if (error) throw error;
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error("Error sending message:", error);
      setStatus('error');
    }
  };

  return (
    <div className="py-12 bg-slate-50 flex-grow">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Contact Our Chambers</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">Reach out for general inquiries or locate our offices.</p>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/3 space-y-6">
            <div className="bg-slate-900 text-white rounded-xl p-8 shadow-lg">
              <h3 className="text-xl font-bold mb-6">Office Details</h3>
              <div className="space-y-6">
                <div className="flex">
                  <MapPin className="text-slate-400 mr-4 flex-shrink-0" size={24} />
                  <div>
                    <h4 className="font-semibold text-slate-200 mb-1">Primary Chamber</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">LE/A 603, Luxuria Estate,<br />Sector 6, Aditya World City,<br />Ghaziabad 201002</p>
                  </div>
                </div>
                <div className="flex">
                  <Phone className="text-slate-400 mr-4 flex-shrink-0" size={24} />
                  <div>
                    <h4 className="font-semibold text-slate-200 mb-1">Phone</h4>
                    <p className="text-slate-400 text-sm">+91 8527200481</p>
                  </div>
                </div>
                <div className="flex">
                  <Mail className="text-slate-400 mr-4 flex-shrink-0" size={24} />
                  <div>
                    <h4 className="font-semibold text-slate-200 mb-1">Email</h4>
                    <p className="text-slate-400 text-sm">adv.mohit.bhardwaj1@gmail.com</p>
                  </div>
                </div>
                <div className="flex">
                  <Clock className="text-slate-400 mr-4 flex-shrink-0" size={24} />
                  <div>
                    <h4 className="font-semibold text-slate-200 mb-1">Hours</h4>
                    <p className="text-slate-400 text-sm">Mon - Fri: 10:00 AM - 7:00 PM<br />Sat: 10:00 AM - 2:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:w-2/3 bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Send a Message</h3>
            {!user && (
              <div className="mb-6 bg-blue-50 text-blue-800 border border-blue-200 rounded-md p-4">
                <p className="font-medium">Please log in to your client portal to send a message. This ensures we can respond to your inquiry securely.</p>
              </div>
            )}
            {status === 'success' && (
              <div className="mb-6 bg-green-50 text-green-800 border border-green-200 rounded-md p-4 flex items-center">
                <CheckCircle size={20} className="mr-3 text-green-500" />
                <p className="font-medium">Message sent successfully. Our team will contact you shortly.</p>
              </div>
            )}
            {status === 'error' && user && (
              <div className="mb-6 bg-red-50 text-red-800 border border-red-200 rounded-md p-4">
                <p className="font-medium">Failed to send message. Please try again later.</p>
              </div>
            )}
            {status === 'error' && !user && (
              <div className="mb-6 bg-red-50 text-red-800 border border-red-200 rounded-md p-4">
                <p className="font-medium">Authentication required. Please log in to send a message.</p>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6" style={{ opacity: user ? 1 : 0.5, pointerEvents: user ? 'auto' : 'none' }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                  <input type="text" required disabled={!user} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 rounded-md border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors disabled:bg-slate-100 disabled:text-slate-500" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                  <input type="tel" required disabled={!user} value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-3 rounded-md border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors disabled:bg-slate-100 disabled:text-slate-500" placeholder="+91 90000 00000" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                <input type="email" required disabled={!user} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 rounded-md border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors disabled:bg-slate-100 disabled:text-slate-500" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Brief details of your inquiry</label>
                <textarea required rows={5} disabled={!user} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full px-4 py-3 rounded-md border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors resize-none disabled:bg-slate-100 disabled:text-slate-500" placeholder="Describe your legal issue..."></textarea>
              </div>
              <button type="submit" disabled={status === 'loading' || !user} className="w-full bg-slate-900 text-white font-medium py-4 rounded-md hover:bg-slate-800 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed flex justify-center items-center">
                {status === 'loading' ? <span className="animate-pulse">Sending...</span> : 'Send Message'}
              </button>
              <p className="text-xs text-slate-500 text-center mt-4">* Please do not share highly sensitive or confidential information through this form.</p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function BookingView({ user, navigateTo }: { user: User | null; navigateTo: (page: Page) => void }) {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({ service: 'RERA', date: '', time: '10:00', name: '', phone: '', mode: 'video' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  const getMinDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 60);
    return d.toISOString().split('T')[0];
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingData.date || !bookingData.name || !bookingData.phone) { setErrorMsg("Please fill all fields."); return; }
    setErrorMsg('');
    setStep(2);
  };

  const handlePaymentAndBook = async () => {
    if (!user) return;
    setShowConfirmModal(false);
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    try {
      const { error } = await supabase.from('bookings').insert({
        user_id: user.id, service: bookingData.service, date: bookingData.date, time: bookingData.time,
        name: bookingData.name, phone: bookingData.phone, mode: bookingData.mode,
        status: 'Confirmed', payment_status: 'Paid', fee: 2500,
      });
      if (error) throw error;
      setStep(3);
    } catch (error) {
      console.error("Booking error:", error);
      setErrorMsg("Failed to complete booking. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmClick = () => {
    setShowConfirmModal(false);
    setPaymentConfirmed(true);
    setTimeout(() => handlePaymentAndBook(), 300);
  };

  return (
    <div className="py-12 bg-slate-50 flex-grow">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-center">
          <div className="flex items-center space-x-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-500'}`}>1</div>
            <div className={`h-1 w-12 rounded ${step >= 2 ? 'bg-slate-900' : 'bg-slate-200'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-500'}`}>2</div>
            <div className={`h-1 w-12 rounded ${step >= 3 ? 'bg-slate-900' : 'bg-slate-200'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 3 ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-500'}`}>3</div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {step === 1 && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Schedule a Consultation</h2>
              <p className="text-slate-600 mb-8">Consultation fee: ₹2,500 for a 45-minute session.</p>
              {errorMsg && <div className="mb-4 text-red-600 text-sm font-medium">{errorMsg}</div>}
              <form onSubmit={handleProceedToPayment} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Matter Category</label>
                    <select value={bookingData.service} onChange={(e) => setBookingData({ ...bookingData, service: e.target.value })} className="w-full px-4 py-3 rounded-md border border-slate-300 focus:ring-2 focus:ring-slate-900 outline-none">
                      <option value="RERA">RERA & Real Estate</option>
                      <option value="Matrimonial">Matrimonial & Family</option>
                      <option value="Consumer">Consumer Protection</option>
                      <option value="Commercial">Commercial Dispute</option>
                      <option value="General">General Advisory</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Consultation Mode</label>
                    <div className="flex space-x-4">
                      <label className={`flex-1 border rounded-md p-3 flex items-center justify-center cursor-pointer transition-colors ${bookingData.mode === 'video' ? 'border-slate-900 bg-slate-50 font-medium' : 'border-slate-200 text-slate-600'}`}>
                        <input type="radio" name="mode" value="video" className="hidden" checked={bookingData.mode === 'video'} onChange={() => setBookingData({ ...bookingData, mode: 'video' })} />
                        Video Call
                      </label>
                      <label className={`flex-1 border rounded-md p-3 flex items-center justify-center cursor-pointer transition-colors ${bookingData.mode === 'in-person' ? 'border-slate-900 bg-slate-50 font-medium' : 'border-slate-200 text-slate-600'}`}>
                        <input type="radio" name="mode" value="in-person" className="hidden" checked={bookingData.mode === 'in-person'} onChange={() => setBookingData({ ...bookingData, mode: 'in-person' })} />
                        In-Chamber
                      </label>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Select Date</label>
                    <input
                      type="date"
                      required
                      value={bookingData.date}
                      onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                      min={getMinDate()}
                      max={getMaxDate()}
                      className="w-full px-4 py-3 rounded-md border border-slate-300 focus:ring-2 focus:ring-slate-900 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Select Time</label>
                    <select value={bookingData.time} onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })} className="w-full px-4 py-3 rounded-md border border-slate-300 focus:ring-2 focus:ring-slate-900 outline-none">
                      <option value="10:00">10:00 AM</option>
                      <option value="11:30">11:30 AM</option>
                      <option value="14:00">02:00 PM</option>
                      <option value="16:00">04:00 PM</option>
                      <option value="17:30">05:30 PM</option>
                    </select>
                  </div>
                </div>
                <div className="border-t border-slate-200 pt-6 mt-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Your Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input type="text" required placeholder="Full Name" value={bookingData.name} onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })} className="w-full px-4 py-3 rounded-md border border-slate-300 focus:ring-2 focus:ring-slate-900 outline-none" />
                    <input type="tel" required placeholder="Mobile Number" value={bookingData.phone} onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })} className="w-full px-4 py-3 rounded-md border border-slate-300 focus:ring-2 focus:ring-slate-900 outline-none" />
                  </div>
                </div>
                <button type="submit" className="w-full bg-slate-900 text-white font-medium py-4 rounded-md hover:bg-slate-800 transition-colors mt-6">Proceed to Payment</button>
              </form>
            </div>
          )}
          {step === 2 && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Complete Payment</h2>
              {paymentConfirmed && isProcessing && (
                <div className="mb-6 bg-green-50 text-green-800 border border-green-200 rounded-lg p-4 flex items-center">
                  <CheckCircle size={20} className="mr-3 text-green-500 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Payment confirmation received</p>
                    <p className="text-sm text-green-700">Verifying your booking. Please wait while we process your consultation...</p>
                  </div>
                </div>
              )}
              <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 mb-8">
                <div className="flex justify-between mb-4 pb-4 border-b border-slate-200">
                  <span className="text-slate-600">Consultation ({bookingData.mode})</span>
                  <span className="font-semibold">₹2,500.00</span>
                </div>
                <div className="flex justify-between text-sm text-slate-500 mb-2"><span>Date</span><span>{new Date(bookingData.date).toLocaleDateString('en-IN')}</span></div>
                <div className="flex justify-between text-sm text-slate-500"><span>Time</span><span>{bookingData.time}</span></div>
              </div>
              {errorMsg && <div className="mb-4 text-red-600 text-sm font-medium">{errorMsg}</div>}
              <div className="border border-slate-200 rounded-lg p-8 mb-8 bg-white text-center">
                <h3 className="font-semibold text-slate-900 mb-2">Pay via UPI</h3>
                <p className="text-sm text-slate-500 mb-6">Scan the QR code below or send payment to the UPI ID shown.</p>
                <div className="flex justify-center mb-6">
                  <div className="w-48 h-48 bg-white border-2 border-slate-200 rounded-xl p-3 shadow-sm">
                    <img
                      src="/upi-qr-code.png"
                      alt="UPI QR Code for Advocate Mohit Bhardwaj consultation payment to 8527200481@yescred"
                      className="w-full h-full object-contain"
                      loading="lazy"
                      decoding="async"
                      width="192"
                      height="192"
                    />
                  </div>
                </div>
                <div className="bg-slate-50 rounded-lg p-4 inline-block">
                  <p className="text-xs text-slate-500 mb-1 uppercase tracking-wider font-medium">UPI ID</p>
                  <p className="text-lg font-bold text-slate-900 tracking-wide">8527200481@yescred</p>
                </div>
                <p className="text-xs text-slate-400 mt-4">Amount: ₹2,500.00</p>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">Transaction ID / Reference Number (Optional)</label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="Enter your UPI transaction ID or reference number"
                  className="w-full px-4 py-3 rounded-md border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors"
                />
              </div>
              <div className="flex space-x-4">
                <button onClick={() => setStep(1)} disabled={isProcessing} className="w-1/3 bg-slate-100 text-slate-700 font-medium py-4 rounded-md hover:bg-slate-200 transition-colors disabled:opacity-50">Back</button>
                <button onClick={() => setShowConfirmModal(true)} disabled={isProcessing} className="w-2/3 bg-slate-900 text-white font-medium py-4 rounded-md hover:bg-slate-800 transition-colors flex justify-center items-center disabled:opacity-80">
                  I Have Paid
                </button>
              </div>

              {showConfirmModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-8">
                    <h3 className="text-xl font-bold text-slate-900 mb-4">Confirm Payment</h3>
                    <p className="text-slate-600 mb-6">Please confirm that you have completed the transaction of <strong>₹2,500.00</strong> to <strong>8527200481@yescred</strong>.</p>
                    {transactionId && (
                      <p className="text-sm text-slate-500 mb-4">Transaction Reference: <span className="font-mono bg-slate-100 px-2 py-1 rounded">{transactionId}</span></p>
                    )}
                    <div className="flex space-x-4">
                      <button
                        onClick={() => setShowConfirmModal(false)}
                        className="flex-1 bg-slate-100 text-slate-700 font-medium py-3 rounded-md hover:bg-slate-200 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleConfirmClick}
                        className="flex-1 bg-slate-900 text-white font-medium py-3 rounded-md hover:bg-slate-800 transition-colors"
                      >
                        Yes, Confirm
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {step === 3 && (
            <div className="p-12 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} className="text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Payment Confirmed!</h2>
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Booking Confirmed</h3>
              <p className="text-slate-600 mb-2 max-w-md mx-auto">
                Your consultation for <strong>{new Date(bookingData.date).toLocaleDateString('en-IN')}</strong> at <strong>{bookingData.time}</strong> has been successfully scheduled.
              </p>
              {transactionId && (
                <p className="text-sm text-slate-500 mb-4">Transaction Reference: <span className="font-mono bg-slate-100 px-2 py-1 rounded">{transactionId}</span></p>
              )}
              <p className="text-slate-500 text-sm mb-8">Details have been saved to your client portal.</p>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <button onClick={() => navigateTo('dashboard')} className="bg-slate-900 text-white px-8 py-3 rounded-md font-medium hover:bg-slate-800 transition-colors">View Client Portal</button>
                <button onClick={() => navigateTo('home')} className="bg-white border border-slate-300 text-slate-700 px-8 py-3 rounded-md font-medium hover:bg-slate-50 transition-colors">Return Home</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface Booking {
  id: string;
  service: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  mode: string;
  status: string;
  payment_status: string;
  fee: number;
  created_at: string;
}

function AuthView() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) throw signUpError;
        setSuccess('Account created successfully! You can now log in.');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setIsSignUp(false);
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        setEmail('');
        setPassword('');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 bg-slate-50 flex-grow flex items-center justify-center">
      <div className="w-full max-w-md px-4 sm:px-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Scale className="w-10 h-10 text-slate-900" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              {isSignUp ? 'Create Account' : 'Client Login'}
            </h1>
            <p className="text-sm text-slate-500">
              {isSignUp ? 'Sign up to access your secure portal' : 'Log in to your client portal'}
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 text-red-800 border border-red-200 rounded-md p-4 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 bg-green-50 text-green-800 border border-green-200 rounded-md p-4 text-sm flex items-center">
              <CheckCircle size={18} className="mr-2" />
              {success}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-md border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-md border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors"
                placeholder="••••••••"
              />
            </div>

            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-md border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white font-medium py-3 rounded-md hover:bg-slate-800 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed mt-6"
            >
              {loading ? (
                <span className="inline-flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                isSignUp ? 'Create Account' : 'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                  setSuccess('');
                  setEmail('');
                  setPassword('');
                  setConfirmPassword('');
                }}
                className="text-slate-900 font-medium hover:underline"
              >
                {isSignUp ? 'Sign in' : 'Create one'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface BlogPost {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  date: string;
  readTime: string;
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: 'rera-builder-agreement',
    title: 'Understanding Your Rights: Navigating Builder-Buyer Agreements under RERA',
    category: 'RERA & Real Estate',
    date: 'May 1, 2026',
    readTime: '5 min read',
    excerpt: 'The Real Estate (Regulation and Development) Act, 2016 (RERA) has fundamentally transformed the landscape of real estate transactions in India. One of its most significant contributions is the standardization and protection of builder-buyer agreements, which form the legal foundation of property purchases. Understanding your rights and obligations under these agreements is crucial before signing any contract.\n\nBuilder-buyer agreements under RERA now mandate specific disclosures, timelines, and guarantees that protect homebuyers from unfair practices. These agreements must comply with model format guidelines and clearly outline the property specifications, payment schedule, construction timeline, and compensation clauses. As a buyer, you have the right to a copy of the agreement, full transparency regarding project details, and legitimate grounds for demanding refunds if the builder fails to deliver as promised.\n\nCommon pitfalls in these agreements include unclear penalty clauses, ambiguous delivery timelines, and buried costs. Our firm helps clients review these agreements meticulously to ensure all protective clauses are in place and your interests are safeguarded before you commit financially.'
  },
  {
    id: 'mutual-consent-divorce',
    title: 'The Process of Mutual Consent Divorce in District Courts Explained',
    category: 'Matrimonial & Family Law',
    date: 'April 28, 2026',
    readTime: '6 min read',
    excerpt: 'Mutual consent divorce, also known as uncontested divorce, is the most straightforward path to ending a marriage when both spouses agree to separate. Under the Hindu Marriage Act, 1955 and other applicable personal laws, this process offers a faster, less adversarial alternative to contested proceedings. Understanding the procedural steps and timeline can help couples navigate this sensitive transition with minimal stress.\n\nThe mutual consent divorce process typically unfolds in two key phases: the filing phase and the waiting period. Both spouses must submit a joint petition to the district court, accompanied by affidavits confirming their agreement, financial arrangements, and custody decisions if minor children are involved. After the first motion is heard and the initial decree is granted, there is a mandatory six-month cooling-off period before the final decree can be issued.\n\nDuring this period, either party can withdraw the petition, and both must maintain their agreement regarding property division, maintenance, and child custody. Our expertise in matrimonial law ensures that settlements are fair, all interests (including children\'s) are protected, and the legal process moves smoothly through both motions required by the courts.'
  },
  {
    id: 'consumer-complaint-filing',
    title: 'How to Effectively File a Complaint in the District Consumer Disputes Redressal Commission',
    category: 'Consumer Protection',
    date: 'April 25, 2026',
    readTime: '5 min read',
    excerpt: 'Consumer protection laws in India empower you to seek redressal for defective products, inadequate services, and unfair trade practices. The District Consumer Disputes Redressal Commission (DCDRC) serves as the forum for claims up to Rs. 1 crore, handling thousands of cases annually. However, filing an effective complaint requires proper documentation, clear articulation of grievances, and understanding of the commission\'s procedures.\n\nA well-drafted complaint must clearly identify the opposite party (the seller, manufacturer, or service provider), describe the defect or service failure with specifics, quantify the loss suffered, and present supporting evidence such as purchase invoices, warranty cards, photographs, or service records. The complaint should also specify the relief sought\u2014refund, replacement, repair, or compensation for damages. The DCDRC has the authority to award compensation for loss suffered and punitive damages if the opposite party acts in bad faith.\n\nWhile the DCDRC\'s informal procedures are designed to be accessible to consumers without legal representation, having expert guidance significantly increases your chances of success. We prepare comprehensive complaints, represent clients through hearings, and negotiate settlements that adequately compensate for your grievances and protect your consumer rights.'
  },
  {
    id: 'contract-drafting-small-business',
    title: 'Why Proper Contract Drafting is Crucial for Small Businesses',
    category: 'Commercial Litigation',
    date: 'April 22, 2026',
    readTime: '7 min read',
    excerpt: 'For small businesses, contracts are the backbone of commercial relationships\u2014they define obligations, allocate risks, and provide a roadmap for collaboration. Yet many entrepreneurs overlook the importance of meticulous contract drafting, relying instead on templates or informal agreements. This approach exposes businesses to significant legal and financial risks that could have been prevented with proper legal documentation.\n\nA well-drafted contract clearly articulates the terms of engagement, payment schedules, delivery obligations, quality standards, and dispute resolution mechanisms. It includes protective clauses such as limitation of liability, indemnification provisions, confidentiality requirements, and termination conditions. These elements are not just formalities\u2014they are essential safeguards that determine how disputes are resolved if something goes wrong. Vague or missing provisions often lead to costly litigation because courts must interpret intentions rather than enforce clear terms.\n\nSmall businesses operating in sectors like manufacturing, consulting, construction, and supply chains face particular risks from poorly drafted contracts. Our commercial litigation expertise includes drafting airtight contracts tailored to your business model, reviewing agreements from counterparties to identify unfavorable terms, and ensuring compliance with relevant commercial laws. Investing in proper contract drafting today prevents litigation expenses and operational disruptions tomorrow.'
  }
];

function BlogView() {
  return (
    <div className="py-12 bg-slate-50 flex-grow">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Legal Insights & Analysis</h1>
          <p className="text-lg text-slate-600 max-w-2xl">Expert articles on RERA, Matrimonial Law, Consumer Protection, and Commercial Litigation to help you understand your rights and obligations.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {BLOG_POSTS.map((post) => (
            <div key={post.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-block px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full uppercase tracking-wide">
                    {post.category}
                  </span>
                  <span className="text-xs text-slate-500">{post.readTime}</span>
                </div>

                <h2 className="text-xl font-bold text-slate-900 mb-3 leading-tight">
                  {post.title}
                </h2>

                <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-4">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className="text-xs text-slate-500">{post.date}</span>
                  <Link to={`/blog/${post.id}`} className="inline-flex items-center px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded hover:bg-slate-800 transition-colors">
                    Read Article <ChevronRight size={16} className="ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BlogPostView() {
  const { id } = useParams<{ id: string }>();
  const post = BLOG_POSTS.find(p => p.id === id);

  if (!post) {
    return (
      <div className="py-20 bg-slate-50 flex-grow flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Article Not Found</h1>
          <p className="text-slate-600 mb-6">The article you are looking for does not exist.</p>
          <Link to="/blog" className="inline-flex items-center px-6 py-3 bg-slate-900 text-white font-medium rounded hover:bg-slate-800 transition-colors">
            <ArrowLeft size={18} className="mr-2" /> Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const paragraphs = post.excerpt.split('\n\n');

  return (
    <div className="py-12 bg-slate-50 flex-grow">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/blog" className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 font-medium mb-8 transition-colors">
          <ArrowLeft size={16} className="mr-1" /> Back to Blog
        </Link>

        <article>
          <div className="mb-8">
            <span className="inline-block px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full uppercase tracking-wide mb-4">
              {post.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 leading-tight">{post.title}</h1>
            <div className="flex items-center text-sm text-slate-500 space-x-4">
              <span>{post.date}</span>
              <span>{post.readTime}</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 md:p-12">
            <div className="prose prose-slate prose-lg max-w-none">
              {paragraphs.map((paragraph, index) => (
                <p key={index} className="text-slate-700 leading-relaxed mb-6 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-200 text-center">
            <p className="text-slate-600 mb-4">Need legal assistance with this topic?</p>
            <Link to="/booking" className="inline-flex items-center px-6 py-3 bg-slate-900 text-white font-medium rounded hover:bg-slate-800 transition-colors">
              Book a Consultation <ChevronRight size={18} className="ml-2" />
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}

function DashboardView({ user }: { user: User | null }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    const fetchBookings = async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) { console.error("Error fetching bookings:", error); }
      else { setBookings(data ?? []); }
      setLoading(false);
    };
    fetchBookings();
  }, [user]);

  if (!user) {
    return <AuthView />;
  }

  return (
    <div className="py-12 bg-slate-50 flex-grow">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Secure Client Portal</h1>
            <p className="text-slate-600">Manage your appointments and case documents securely.</p>
            <p className="text-sm text-slate-500 mt-2">Logged in as: <span className="font-medium text-slate-900">{user.email}</span></p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <div className="text-sm text-slate-500">
              Client ID: <span className="font-mono bg-slate-200 px-2 py-1 rounded">{user.id.slice(0, 8)}...</span>
            </div>
            <button
              onClick={() => supabase.auth.signOut()}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-4 py-2 rounded-md transition-colors text-sm"
            >
              Sign Out
            </button>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="border-b border-slate-200 px-6 py-4 bg-slate-50">
            <h2 className="font-semibold text-slate-900 flex items-center">
              <Calendar size={18} className="mr-2 text-slate-600" />
              Your Appointments
            </h2>
          </div>
          <div className="p-0">
            {loading ? (
              <div className="p-12 text-center text-slate-500">Loading your secure data...</div>
            ) : bookings.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar size={24} className="text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">No active appointments</h3>
                <p className="text-slate-500">You haven't scheduled any consultations yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                      <th className="px-6 py-4 font-medium">Date & Time</th>
                      <th className="px-6 py-4 font-medium">Matter</th>
                      <th className="px-6 py-4 font-medium">Mode</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-slate-900">{new Date(booking.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                          <div className="text-sm text-slate-500">{booking.time}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-slate-900">{booking.service}</div>
                          <div className="text-xs text-slate-500">{booking.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-800 capitalize">{booking.mode}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-800">{booking.status}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900">View Details</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden opacity-75">
          <div className="border-b border-slate-200 px-6 py-4 bg-slate-50 flex justify-between items-center">
            <h2 className="font-semibold text-slate-900 flex items-center">
              <Briefcase size={18} className="mr-2 text-slate-600" />
              Case Documents (Coming Soon)
            </h2>
            <span className="text-xs font-medium px-2 py-1 bg-slate-200 text-slate-600 rounded">Locked</span>
          </div>
          <div className="p-8 text-center">
            <p className="text-sm text-slate-500">Secure document sharing will be enabled once a formal Vakalatnama (Power of Attorney) is signed and your case is active.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TermsView() {
  return (
    <div className="py-12 bg-slate-50 flex-grow">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Terms of Service</h1>
        <p className="text-sm text-slate-500 mb-10">Last updated: May 4, 2026</p>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 md:p-12 space-y-8">
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">1. Acceptance of Terms</h2>
            <p className="text-slate-600 leading-relaxed">By accessing or using this website (the "Site"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use the Site. These Terms constitute a legally binding agreement between you and Advocate Mohit Bhardwaj ("the Advocate," "we," or "us").</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">2. Bar Council of India Disclaimer</h2>
            <p className="text-slate-600 leading-relaxed">In compliance with the rules and regulations of the Bar Council of India, this website does not constitute solicitation, advertisement, or inducement of any kind. The contents of this Site are intended solely for informational purposes and must not be construed as legal advice or opinion. The Advocate and this firm do not warrant or assume any liability for the accuracy, completeness, or timeliness of any information provided herein. No advocate-client relationship is formed by the use of this Site or by any communication through it. Users are advised to seek independent legal counsel before acting on any information contained on this Site.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">3. No Legal Advice</h2>
            <p className="text-slate-600 leading-relaxed">The information provided on this Site, including but not limited to articles, blog posts, practice area descriptions, and responses to inquiries, does not constitute formal legal advice. The content is for general informational purposes only and should not be relied upon as a substitute for professional legal counsel tailored to your specific circumstances. The Advocate disclaims all liability arising from any reliance placed on the content of this Site.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">4. Consultation Bookings and Payment</h2>
            <p className="text-slate-600 leading-relaxed mb-3">Consultations are booked through this Site at a fee of INR 2,500 per 45-minute session. Payment is required at the time of booking via the UPI payment method provided on the Site.</p>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">4.1 Payment Terms</h3>
            <p className="text-slate-600 leading-relaxed mb-3">All consultation fees must be paid in full before the scheduled appointment. The Advocate reserves the right to reschedule or cancel a consultation if payment has not been confirmed. A booking confirmation will be issued upon successful payment.</p>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">4.2 Refund Policy</h3>
            <p className="text-slate-600 leading-relaxed">Refunds for consultation bookings are subject to the following conditions: (a) Cancellations made at least 24 hours prior to the scheduled appointment time are eligible for a full refund. (b) Cancellations made less than 24 hours before the appointment or failure to attend a scheduled consultation ("no-show") are not eligible for any refund. (c) If the Advocate cancels a consultation for any reason, a full refund or rescheduling at no additional cost will be offered at the client's preference. Refund requests should be directed to adv.mohit.bhardwaj1@gmail.com and will be processed within 7 business days.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">5. Intellectual Property</h2>
            <p className="text-slate-600 leading-relaxed">All content on this Site, including text, graphics, logos, and design elements, is the property of Advocate Mohit Bhardwaj and is protected by applicable intellectual property laws. Reproduction, distribution, or modification of any content without prior written consent is prohibited.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">6. Limitation of Liability</h2>
            <p className="text-slate-600 leading-relaxed">To the fullest extent permitted by law, the Advocate shall not be liable for any direct, indirect, incidental, consequential, or special damages arising from the use of this Site or reliance on any information contained herein. This includes, without limitation, damages for loss of profits, data, or other intangible losses.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">7. Governing Law and Jurisdiction</h2>
            <p className="text-slate-600 leading-relaxed">These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts at Delhi, India.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">8. Amendments</h2>
            <p className="text-slate-600 leading-relaxed">The Advocate reserves the right to modify these Terms at any time. Continued use of the Site following any changes constitutes acceptance of the revised Terms. Users are encouraged to review these Terms periodically.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">9. Contact</h2>
            <p className="text-slate-600 leading-relaxed">For any questions regarding these Terms, please contact us at adv.mohit.bhardwaj1@gmail.com.</p>
          </section>
        </div>

        <div className="mt-8 text-center">
          <Link to="/" className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 font-medium transition-colors">
            <ArrowLeft size={16} className="mr-1" /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

function PrivacyView() {
  return (
    <div className="py-12 bg-slate-50 flex-grow">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-slate-500 mb-10">Last updated: May 4, 2026</p>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 md:p-12 space-y-8">
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">1. Introduction</h2>
            <p className="text-slate-600 leading-relaxed">Advocate Mohit Bhardwaj ("we," "us," or "the Advocate") is committed to protecting the privacy and confidentiality of all individuals who interact with this website. This Privacy Policy explains how we collect, use, store, and protect your personal information when you visit our Site or engage our services.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">2. Legal Privilege and Confidentiality</h2>
            <p className="text-slate-600 leading-relaxed">All client inquiry data submitted through this Site, including contact form submissions, consultation requests, and any information shared regarding legal matters, is kept strictly confidential under the protections of attorney-client privilege and applicable Indian law. We do not disclose, sell, or share any client inquiry data with third parties except as required by law or with the client's explicit written consent.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">3. Information We Collect</h2>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">3.1 Information You Provide</h3>
            <p className="text-slate-600 leading-relaxed mb-3">When you book a consultation appointment through our Site, we collect the following information:</p>
            <ul className="list-disc list-inside text-slate-600 space-y-1 mb-4 ml-4">
              <li>Full name</li>
              <li>Email address</li>
              <li>Mobile phone number</li>
              <li>Selected service category (e.g., RERA, Matrimonial, Consumer, Commercial)</li>
              <li>Preferred consultation date and time</li>
              <li>Consultation mode (video call or in-chamber)</li>
              <li>Transaction ID or reference number (if provided)</li>
            </ul>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">3.2 Contact Form Submissions</h3>
            <p className="text-slate-600 leading-relaxed mb-3">When you submit a message through our contact form, we collect your name, email, phone number, and the content of your message.</p>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">3.3 Automatically Collected Information</h3>
            <p className="text-slate-600 leading-relaxed">When you visit our Site, we may automatically collect certain technical information, including your IP address, browser type, device type, and pages visited. This data is used solely for analytics and improving the Site experience.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">4. How We Use Your Information</h2>
            <p className="text-slate-600 leading-relaxed">We use the information we collect to:</p>
            <ul className="list-disc list-inside text-slate-600 space-y-1 ml-4 mt-2">
              <li>Process and confirm consultation bookings</li>
              <li>Respond to inquiries and messages submitted through the contact form</li>
              <li>Communicate appointment details, reminders, and updates</li>
              <li>Maintain records for legitimate legal practice management purposes</li>
              <li>Improve the functionality and content of this Site</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">5. Payment Data Security</h2>
            <p className="text-slate-600 leading-relaxed">Consultation payments are processed via UPI (Unified Payments Interface). We do not collect, store, or have access to your bank account details, card numbers, or UPI PINs. All payment transactions are processed directly through your bank's UPI infrastructure, which employs industry-standard encryption and security protocols. The only payment-related data we retain is the optional transaction reference number you may choose to provide, and the payment status (Paid/Pending) associated with your booking.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">6. Data Storage and Retention</h2>
            <p className="text-slate-600 leading-relaxed">Your data is stored securely using Supabase, a platform that provides encrypted data storage and row-level security policies to ensure that only authorized personnel can access your information. Booking and inquiry records are retained for the duration necessary to fulfill the purposes described in this Policy and as required by applicable legal and regulatory obligations.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">7. Your Rights</h2>
            <p className="text-slate-600 leading-relaxed">You have the right to request access to, correction of, or deletion of your personal data held by us, subject to applicable legal and regulatory requirements. To exercise these rights, please contact us at the email address provided below.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">8. Third-Party Services</h2>
            <p className="text-slate-600 leading-relaxed">Our Site uses Supabase for data storage and authentication. These third-party service providers operate under their own privacy policies and are contractually obligated to protect your data. We do not share your personal information with any other third parties for marketing or commercial purposes.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">9. Data Protection Contact</h2>
            <p className="text-slate-600 leading-relaxed">For any questions, concerns, or requests regarding this Privacy Policy or the handling of your personal data, please contact us at:</p>
            <div className="mt-3 bg-slate-50 rounded-lg p-4 border border-slate-200">
              <p className="text-slate-900 font-medium">Advocate Mohit Bhardwaj</p>
              <p className="text-slate-600">Email: <a href="mailto:adv.mohit.bhardwaj1@gmail.com" className="text-blue-700 hover:underline">adv.mohit.bhardwaj1@gmail.com</a></p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">10. Changes to This Policy</h2>
            <p className="text-slate-600 leading-relaxed">We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date. Continued use of the Site following any changes constitutes acceptance of the revised Policy.</p>
          </section>
        </div>

        <div className="mt-8 text-center">
          <Link to="/" className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 font-medium transition-colors">
            <ArrowLeft size={16} className="mr-1" /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

type CaseCategory = 'Civil' | 'Criminal' | 'Corporate' | 'RERA';

const CASE_STUDIES = [
  {
    id: 1,
    category: 'RERA',
    title: 'Delayed Possession Recovery for Homebuyers',
    challenge: 'A group of 12 homebuyers had been waiting over 4 years for possession of their apartments. The builder had repeatedly delayed handover citing regulatory approvals, while continuing to demand installment payments. Individual complaints had yielded no results.',
    approach: 'Filed a consolidated complaint before the UP RERA Authority on behalf of all 12 buyers. Presented detailed evidence of construction delays, financial statements showing fund diversion, and correspondence demonstrating the builder\'s bad faith. Sought both possession and compensation for the delay period.',
    resolution: 'RERA Authority directed the builder to deliver possession within 6 months and awarded compensation of Rs. 5,000 per sq.ft. per month of delay to each buyer. Total recovery exceeded Rs. 48 lakhs for the group.',
    icon: Landmark,
  },
  {
    id: 2,
    category: 'Matrimonial',
    title: 'Complex Custody and Maintenance Resolution',
    challenge: 'A mother of two minor children sought divorce on grounds of cruelty while simultaneously facing counter-allegations. The husband had filed for custody, claiming the mother was unfit, and was offering minimal maintenance far below the family\'s standard of living.',
    approach: 'Built a comprehensive case documenting the husband\'s financial capacity through salary slips, property records, and lifestyle evidence. Engaged a child psychologist\'s report supporting the mother\'s fitness. Negotiated firmly through mediation while preparing for contested hearings on both custody and maintenance.',
    resolution: 'Secured full custody of both children with liberal visitation for the father. Monthly maintenance of Rs. 35,000 was awarded along with a one-time settlement of Rs. 15 lakhs. The divorce decree was granted on terms favorable to the client.',
    icon: Users,
  },
  {
    id: 3,
    category: 'Consumer',
    title: 'Medical Negligence Compensation Victory',
    challenge: 'A patient suffered permanent partial disability due to a surgical error. The hospital denied negligence, claiming the complication was a known risk. The patient had no prior legal experience and limited financial resources to pursue a complex medical case.',
    approach: 'Obtained independent medical opinions from two specialists confirming the deviation from standard care protocols. Filed a complaint before the District Consumer Disputes Redressal Commission with comprehensive medical records, expert testimony, and documentation of the patient\'s diminished earning capacity.',
    resolution: 'The Commission found the hospital liable for deficiency in service and negligence. Awarded Rs. 8 lakhs in compensation covering medical expenses, loss of earnings, and pain and suffering. The hospital was also directed to provide free corrective treatment.',
    icon: Award,
  },
  {
    id: 4,
    category: 'Commercial',
    title: 'Breach of Contract Recovery for SME',
    challenge: 'A small manufacturing firm had supplied goods worth Rs. 22 lakhs to a larger corporate buyer who refused payment, citing alleged quality issues. The SME was facing a cash flow crisis and potential closure. The buyer had significantly more legal resources.',
    approach: 'Filed a summary suit under Order 37 of the CPC for prompt recovery, bypassing the lengthy ordinary suit process. Presented irrefutable delivery receipts, quality inspection certificates, and email correspondence proving the buyer had accepted and used the goods without raising quality concerns for months.',
    resolution: 'The court granted a decree in favor of the SME within 8 months, a fraction of the typical timeline. The buyer was ordered to pay the full Rs. 22 lakhs along with 12% interest from the date of default and legal costs.',
    icon: Briefcase,
  },
];

function CaseStudiesView() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const categoryColors: Record<string, { text: string; bg: string; border: string }> = {
    RERA: { text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
    Matrimonial: { text: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' },
    Consumer: { text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    Commercial: { text: 'text-slate-700', bg: 'bg-slate-50', border: 'border-slate-200' },
  };

  return (
    <div className="py-12 bg-slate-50 flex-grow">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Case Studies</h1>
          <div className="w-16 h-1 bg-blue-700 mx-auto rounded mb-6"></div>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Anonymized records of legal successes demonstrating our strategic approach and commitment to client outcomes. All identifying details have been changed to protect confidentiality.
          </p>
        </div>

        <div className="space-y-6">
          {CASE_STUDIES.map((cs) => {
            const colors = categoryColors[cs.category] || categoryColors.Commercial;
            const Icon = cs.icon;
            const isExpanded = expandedId === cs.id;

            return (
              <div key={cs.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-shadow hover:shadow-md">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : cs.id)}
                  className="w-full text-left p-6 md:p-8 flex items-start justify-between gap-4"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${colors.bg} ${colors.text}`}>
                      <Icon size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full uppercase tracking-wide ${colors.bg} ${colors.text} ${colors.border} border`}>
                          {cs.category}
                        </span>
                      </div>
                      <h2 className="text-xl font-bold text-slate-900">{cs.title}</h2>
                    </div>
                  </div>
                  <ChevronDown
                    size={20}
                    className={`text-slate-400 flex-shrink-0 mt-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  />
                </button>

                {isExpanded && (
                  <div className="px-6 md:px-8 pb-8 pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ml-0 md:ml-16">
                      <div className="bg-red-50 rounded-lg p-5 border border-red-100">
                        <h3 className="font-bold text-red-800 mb-2 flex items-center text-sm uppercase tracking-wider">
                          <Shield size={16} className="mr-2" /> Challenge
                        </h3>
                        <p className="text-slate-700 text-sm leading-relaxed">{cs.challenge}</p>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-5 border border-blue-100">
                        <h3 className="font-bold text-blue-800 mb-2 flex items-center text-sm uppercase tracking-wider">
                          <BookOpen size={16} className="mr-2" /> Approach
                        </h3>
                        <p className="text-slate-700 text-sm leading-relaxed">{cs.approach}</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-5 border border-green-100">
                        <h3 className="font-bold text-green-800 mb-2 flex items-center text-sm uppercase tracking-wider">
                          <CheckCircle size={16} className="mr-2" /> Resolution
                        </h3>
                        <p className="text-slate-700 text-sm leading-relaxed">{cs.resolution}</p>
                      </div>
                    </div>
                    <div className="mt-6 ml-0 md:ml-16">
                      <Link
                        to="/booking"
                        className="inline-flex items-center text-sm font-medium text-slate-900 hover:text-blue-700 transition-colors border-b-2 border-transparent hover:border-blue-700 pb-0.5"
                      >
                        Discuss a similar matter <ChevronRight size={16} className="ml-1" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center bg-white rounded-xl shadow-sm border border-slate-200 p-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Facing a Similar Legal Challenge?</h2>
          <p className="text-slate-600 mb-8 max-w-lg mx-auto">Every case is unique. Schedule a confidential consultation to discuss your specific situation and explore your legal options.</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/booking" className="bg-slate-900 text-white px-8 py-4 rounded font-semibold text-lg transition-colors flex items-center justify-center shadow-lg hover:bg-slate-800">
              Book Consultation <Calendar size={20} className="ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
