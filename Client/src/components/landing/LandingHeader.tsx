import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { motion, AnimatePresence } from 'motion/react';
import { Moon, Sun, Globe, LogIn } from 'lucide-react';

interface Language {
  code: string;
  name: string;
  flag: string;
}

interface LandingHeaderProps {
  onJoinPlatform: () => void;
  isLoading?: boolean;
}

const languages: Language[] = [
  { code: 'ar', name: 'العربية التونسية', flag: '🇹🇳' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' }
];

const translations = {
  ar: {
    schoolName: 'مدرسة المستقبل',
    navigation: {
      home: 'الرئيسية',
      about: 'حول المدرسة',
      programs: 'البرامج',
      contact: 'اتصل بنا'
    },
    joinPlatform: 'انضم للمنصة'
  },
  fr: {
    schoolName: 'École du Futur',
    navigation: {
      home: 'Accueil',
      about: 'À propos',
      programs: 'Programmes',
      contact: 'Contact'
    },
    joinPlatform: 'Rejoindre la Plateforme'
  },
  en: {
    schoolName: 'Future School',
    navigation: {
      home: 'Home',
      about: 'About',
      programs: 'Programs',
      contact: 'Contact'
    },
    joinPlatform: 'Join Platform'
  }
};

export function LandingHeader({ onJoinPlatform, isLoading = false }: LandingHeaderProps) {
  const [isDark, setIsDark] = useState(false);
  const [currentLang, setCurrentLang] = useState<'ar' | 'fr' | 'en'>('en');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const t = translations[currentLang];

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 dark:bg-[#0D1B2A]/95 backdrop-blur-lg shadow-xl' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 m-2 bg-white/90 dark:bg-[#0D1B2A]/90 backdrop-blur-lg rounded-xl border border-white/20 dark:border-[#3E92CC]/20 shadow-lg">
          
          {/* Logo & School Name */}
          <motion.div 
            className="flex items-center space-x-3 px-4"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-[#0D1B2A] to-[#3E92CC] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <h1 className="text-xl font-bold text-[#0D1B2A] dark:text-white">
              {t.schoolName}
            </h1>
          </motion.div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {Object.entries(t.navigation).map(([key, label], index) => (
              <motion.a
                key={key}
                href={`#${key}`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
                className="text-[#0D1B2A] dark:text-white hover:text-[#3E92CC] dark:hover:text-[#3E92CC] transition-colors duration-200 font-medium"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {label}
              </motion.a>
            ))}
          </nav>

          {/* Controls */}
          <div className="flex items-center space-x-3 px-4">
            
            {/* Language Selector */}
            <Select value={currentLang} onValueChange={(value: 'ar' | 'fr' | 'en') => setCurrentLang(value)}>
              <SelectTrigger className="w-24 h-8 border-0 bg-transparent">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    <span className="flex items-center space-x-2">
                      <span>{lang.flag}</span>
                      <span className="text-xs">{lang.name}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDark(!isDark)}
              className="h-8 w-8 p-0 hover:bg-[#3E92CC]/10"
            >
              <motion.div
                initial={false}
                animate={{ rotate: isDark ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isDark ? (
                  <Sun className="h-4 w-4 text-yellow-500" />
                ) : (
                  <Moon className="h-4 w-4 text-[#0D1B2A]" />
                )}
              </motion.div>
            </Button>

            {/* Join Platform Button */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={onJoinPlatform}
                disabled={isLoading}
                className="bg-gradient-to-r from-[#0D1B2A] to-[#3E92CC] hover:from-[#1B2B3A] hover:to-[#4EA2DC] text-white border-0 shadow-lg h-9 px-6"
              >
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center space-x-2"
                    >
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span className="text-sm">{currentLang === 'ar' ? 'جاري التحميل...' : currentLang === 'fr' ? 'Chargement...' : 'Loading...'}</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="normal"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center space-x-2"
                    >
                      <LogIn className="h-4 w-4" />
                      <span className="text-sm">{t.joinPlatform}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}