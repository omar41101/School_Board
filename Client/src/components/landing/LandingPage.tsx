import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LandingHeader } from './LandingHeader';
import { HeroSection } from './HeroSection';
import { AboutSection } from './AboutSection';
import { AuthModal } from '../auth/AuthModal';


interface LandingPageProps {
  onAuthSuccess: () => void;
}

export function LandingPage({ onAuthSuccess }: LandingPageProps) {
  const [currentLang, setCurrentLang] = useState<'ar' | 'fr' | 'en'>('en');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check system preference for dark mode
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(prefersDark);
    document.documentElement.classList.toggle('dark', prefersDark);
  }, []);

  const handleJoinPlatform = () => {
    setShowLoginModal(true);
  };

  const handleLoginSuccess = (userType: 'admin' | 'student', userData: any) => {
    setShowLoginModal(false);
    onAuthSuccess();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white dark:bg-[#0D1B2A] transition-colors duration-300"
    >
      {/* Header */}
      <LandingHeader 
        onJoinPlatform={handleJoinPlatform}
        isLoading={false}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onAuthSuccess={handleLoginSuccess}
        currentLang={currentLang}
      />

      {/* Page Content */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {/* Hero Section */}
        <HeroSection currentLang={currentLang} onJoinPlatform={handleJoinPlatform} />

        {/* About Section */}
        <AboutSection currentLang={currentLang} />

        {/* Additional Sections would go here */}
        {/* Programs Section */}
        <section id="programs" className="py-20 bg-white dark:bg-[#0D1B2A]">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-[#0D1B2A] dark:text-white mb-4">
                {currentLang === 'ar' ? 'برامجنا التعليمية' : 
                 currentLang === 'fr' ? 'Nos Programmes' : 
                 'Our Programs'}
              </h2>
              <p className="text-xl text-[#3E92CC] max-w-2xl mx-auto">
                {currentLang === 'ar' ? 'برامج متنوعة تلبي احتياجات جميع الطلاب' : 
                 currentLang === 'fr' ? 'Des programmes variés pour répondre aux besoins de tous les étudiants' : 
                 'Diverse programs to meet the needs of all students'}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: currentLang === 'ar' ? 'التعليم الأساسي' : currentLang === 'fr' ? 'Enseignement Primaire' : 'Primary Education',
                  description: currentLang === 'ar' ? 'أسس قوية للمستقبل' : currentLang === 'fr' ? 'Des bases solides pour l\'avenir' : 'Strong foundations for the future',
                  image: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400&h=300&fit=crop'
                },
                {
                  title: currentLang === 'ar' ? 'التعليم الثانوي' : currentLang === 'fr' ? 'Enseignement Secondaire' : 'Secondary Education',
                  description: currentLang === 'ar' ? 'إعداد للجامعة والمستقبل المهني' : currentLang === 'fr' ? 'Préparation à l\'université et à la carrière' : 'University and career preparation',
                  image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=400&h=300&fit=crop'
                },
                {
                  title: currentLang === 'ar' ? 'البرامج المتخصصة' : currentLang === 'fr' ? 'Programmes Spécialisés' : 'Specialized Programs',
                  description: currentLang === 'ar' ? 'برامج متخصصة في العلوم والتكنولوجيا' : currentLang === 'fr' ? 'Programmes spécialisés en sciences et technologie' : 'Specialized STEM programs',
                  image: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=400&h=300&fit=crop'
                }
              ].map((program, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                  className="bg-gray-50 dark:bg-[#1B2B3A] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={program.image} 
                      alt={program.title}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[#0D1B2A] dark:text-white mb-3">
                      {program.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {program.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 bg-gradient-to-br from-[#0D1B2A] to-[#3E92CC]">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center text-white"
            >
              <h2 className="text-4xl font-bold mb-4">
                {currentLang === 'ar' ? 'تواصل معنا' : 
                 currentLang === 'fr' ? 'Contactez-nous' : 
                 'Contact Us'}
              </h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto">
                {currentLang === 'ar' ? 'نحن هنا للإجابة على جميع استفساراتكم' : 
                 currentLang === 'fr' ? 'Nous sommes là pour répondre à toutes vos questions' : 
                 'We\'re here to answer all your questions'}
              </p>
              
              <div className="grid md:grid-cols-3 gap-8 mt-12">
                {[
                  {
                    title: currentLang === 'ar' ? 'اتصل بنا' : currentLang === 'fr' ? 'Appelez-nous' : 'Call Us',
                    value: '+216 71 123 456',
                    icon: '📞'
                  },
                  {
                    title: currentLang === 'ar' ? 'راسلنا' : currentLang === 'fr' ? 'Écrivez-nous' : 'Email Us',
                    value: 'info@futureschool.tn',
                    icon: '✉️'
                  },
                  {
                    title: currentLang === 'ar' ? 'زورونا' : currentLang === 'fr' ? 'Visitez-nous' : 'Visit Us',
                    value: currentLang === 'ar' ? 'تونس، المنار' : currentLang === 'fr' ? 'Tunis, El Manar' : 'Tunis, El Manar',
                    icon: '📍'
                  }
                ].map((contact, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="text-center"
                  >
                    <div className="text-4xl mb-4">{contact.icon}</div>
                    <h3 className="text-xl font-bold mb-2">{contact.title}</h3>
                    <p className="text-white/80">{contact.value}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </motion.main>

      {/* Footer */}
      <footer className="bg-[#0D1B2A] text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 Future School. All rights reserved.</p>
        </div>
      </footer>


    </motion.div>
  );
}