import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { GraduationCap, Users, Trophy, BookOpen, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface HeroSectionProps {
  currentLang: 'ar' | 'fr' | 'en';
  onJoinPlatform?: () => void;
}

const translations = {
  ar: {
    title: 'مرحباً بكم في مدرسة المستقبل',
    subtitle: 'نحن نقدم تعليماً متميزاً يؤهل طلابنا لمستقبل مشرق',
    description: 'منصة تعليمية متكاملة تضم أحدث التقنيات والمناهج المتطورة لضمان تفوق أطفالكم',
    stats: {
      students: 'طالب وطالبة',
      teachers: 'معلم ومعلمة',
      programs: 'برنامج تعليمي',
      awards: 'جائزة تميز'
    },
    cta: {
      explore: 'استكشف المدرسة',
      register: 'سجل الآن'
    }
  },
  fr: {
    title: 'Bienvenue à l\'École du Futur',
    subtitle: 'Nous offrons une éducation d\'excellence pour préparer nos élèves à un avenir brillant',
    description: 'Plateforme éducative intégrée avec les dernières technologies et méthodes pédagogiques avancées',
    stats: {
      students: 'Élèves',
      teachers: 'Enseignants',
      programs: 'Programmes',
      awards: 'Prix d\'Excellence'
    },
    cta: {
      explore: 'Explorer l\'École',
      register: 'S\'inscrire'
    }
  },
  en: {
    title: 'Welcome to Future School',
    subtitle: 'We provide excellent education to prepare our students for a bright future',
    description: 'Integrated educational platform with the latest technologies and advanced curricula',
    stats: {
      students: 'Students',
      teachers: 'Teachers',
      programs: 'Programs',
      awards: 'Excellence Awards'
    },
    cta: {
      explore: 'Explore School',
      register: 'Register Now'
    }
  }
};

const statsData = [
  { value: '2,847', icon: Users, key: 'students' },
  { value: '186', icon: GraduationCap, key: 'teachers' },
  { value: '24', icon: BookOpen, key: 'programs' },
  { value: '15', icon: Trophy, key: 'awards' }
];

export function HeroSection({ currentLang, onJoinPlatform }: HeroSectionProps) {
  const t = translations[currentLang];
  const isRTL = currentLang === 'ar';

  return (
    <section 
      id="home" 
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0D1B2A] via-[#1B2B3A] to-[#3E92CC] relative overflow-hidden"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-64 h-64 bg-white/5 rounded-full blur-xl"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              left: `${10 + i * 15}%`,
              top: `${10 + i * 10}%`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`space-y-8 ${isRTL ? 'text-right' : 'text-left'}`}
          >
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-4xl md:text-6xl font-bold text-white leading-tight"
            >
              {t.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-xl text-white/90"
            >
              {t.subtitle}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-lg text-white/80"
            >
              {t.description}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className={`flex gap-4 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <Button
                size="lg"
                className="bg-white text-[#0D1B2A] hover:bg-white/90 shadow-xl"
                onClick={onJoinPlatform}
              >
                {t.cta.explore}
                <ArrowRight className={`ml-2 h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-[#0D1B2A] shadow-xl"
                onClick={onJoinPlatform}
              >
                {t.cta.register}
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8"
            >
              {statsData.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.key}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 1.4 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <motion.h3
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 1.6 + index * 0.1 }}
                      className="text-2xl font-bold text-white"
                    >
                      {stat.value}
                    </motion.h3>
                    <p className="text-sm text-white/80">
                      {t.stats[stat.key as keyof typeof t.stats]}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>

          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            {/* Main Image */}
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 1, 0]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative z-10"
            >
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&h=400&fit=crop"
                alt="School Campus"
                className="w-full h-96 object-cover rounded-2xl shadow-2xl"
              />
            </motion.div>

            {/* Floating Cards */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 1.5 }}
              className="absolute -top-4 -left-4 bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold">98% Success Rate</p>
                  <p className="text-white/80 text-sm">Excellence in Education</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 1.7 }}
              className="absolute -bottom-4 -right-4 bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold">Award Winning</p>
                  <p className="text-white/80 text-sm">Best School 2024</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-white/50 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}