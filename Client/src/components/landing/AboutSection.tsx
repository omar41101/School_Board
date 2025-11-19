import { motion } from 'motion/react';
import { Card, CardContent } from '../ui/card';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { 
  Award, 
  Globe, 
  Users, 
  BookOpen, 
  Star, 
  Target,
  Heart,
  Lightbulb
} from 'lucide-react';

interface AboutSectionProps {
  currentLang: 'ar' | 'fr' | 'en';
}

const translations = {
  ar: {
    title: 'حول مدرسة المستقبل',
    subtitle: 'رحلة تعليمية استثنائية منذ 1995',
    description: 'نحن مؤسسة تعليمية رائدة تركز على تطوير الطلاب أكاديمياً واجتماعياً وشخصياً. نؤمن بأن كل طالب يستحق فرصة للتميز والنجاح.',
    values: {
      excellence: {
        title: 'التميز',
        description: 'نسعى للتميز في كل ما نقوم به'
      },
      innovation: {
        title: 'الابتكار',
        description: 'نتبنى أحدث الطرق التعليمية'
      },
      diversity: {
        title: 'التنوع',
        description: 'نحتفل بالتنوع الثقافي والفكري'
      },
      care: {
        title: 'الرعاية',
        description: 'نهتم بكل طالب كفرد متميز'
      }
    },
    achievements: {
      title: 'إنجازاتنا',
      items: [
        'أفضل مدرسة في تونس 2024',
        'جائزة التميز التعليمي',
        '98% نسبة نجاح في البكالوريا',
        'شراكات دولية مع جامعات عالمية'
      ]
    }
  },
  fr: {
    title: 'À propos de l\'École du Futur',
    subtitle: 'Un parcours éducatif exceptionnel depuis 1995',
    description: 'Nous sommes un établissement éducatif de premier plan axé sur le développement académique, social et personnel des élèves. Nous croyons que chaque élève mérite une chance d\'exceller et de réussir.',
    values: {
      excellence: {
        title: 'Excellence',
        description: 'Nous visons l\'excellence dans tout ce que nous faisons'
      },
      innovation: {
        title: 'Innovation',
        description: 'Nous adoptons les dernières méthodes pédagogiques'
      },
      diversity: {
        title: 'Diversité',
        description: 'Nous célébrons la diversité culturelle et intellectuelle'
      },
      care: {
        title: 'Bienveillance',
        description: 'Nous prenons soin de chaque élève individuellement'
      }
    },
    achievements: {
      title: 'Nos Réalisations',
      items: [
        'Meilleure école de Tunisie 2024',
        'Prix d\'excellence éducative',
        '98% de réussite au baccalauréat',
        'Partenariats internationaux avec des universités mondiales'
      ]
    }
  },
  en: {
    title: 'About Future School',
    subtitle: 'An exceptional educational journey since 1995',
    description: 'We are a leading educational institution focused on developing students academically, socially, and personally. We believe every student deserves a chance to excel and succeed.',
    values: {
      excellence: {
        title: 'Excellence',
        description: 'We strive for excellence in everything we do'
      },
      innovation: {
        title: 'Innovation',
        description: 'We embrace the latest educational methods'
      },
      diversity: {
        title: 'Diversity',
        description: 'We celebrate cultural and intellectual diversity'
      },
      care: {
        title: 'Care',
        description: 'We care for each student as a unique individual'
      }
    },
    achievements: {
      title: 'Our Achievements',
      items: [
        'Best School in Tunisia 2024',
        'Educational Excellence Award',
        '98% Baccalaureate Success Rate',
        'International partnerships with global universities'
      ]
    }
  }
};

const values = [
  { icon: Target, key: 'excellence' },
  { icon: Lightbulb, key: 'innovation' },
  { icon: Globe, key: 'diversity' },
  { icon: Heart, key: 'care' }
];

export function AboutSection({ currentLang }: AboutSectionProps) {
  const t = translations[currentLang];
  const isRTL = currentLang === 'ar';

  return (
    <section 
      id="about" 
      className="py-20 bg-gray-50 dark:bg-[#1B2B3A]"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className={`text-center mb-16 ${isRTL ? 'text-right' : 'text-left'} max-w-3xl mx-auto`}
        >
          <h2 className="text-4xl font-bold text-[#0D1B2A] dark:text-white mb-4">
            {t.title}
          </h2>
          <p className="text-xl text-[#3E92CC] mb-6">
            {t.subtitle}
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {t.description}
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=400&fit=crop"
                alt="School Building"
                className="w-full h-96 object-cover rounded-2xl shadow-2xl"
              />
              
              {/* Overlay Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
                className="absolute -bottom-8 -right-8 bg-white dark:bg-[#0D1B2A] p-6 rounded-2xl shadow-2xl border border-gray-200 dark:border-[#3E92CC]/20"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#0D1B2A] to-[#3E92CC] rounded-xl flex items-center justify-center">
                    <Award className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-[#0D1B2A] dark:text-white">29</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Years of Excellence</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Values Grid */}
            <div className="grid grid-cols-2 gap-4">
              {values.map((value, index) => {
                const Icon = value.icon;
                const valueData = t.values[value.key as keyof typeof t.values];
                
                return (
                  <motion.div
                    key={value.key}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -5 }}
                  >
                    <Card className="p-4 h-full hover:shadow-lg transition-all duration-300 border-gray-200 dark:border-[#3E92CC]/20 dark:bg-[#0D1B2A]/50">
                      <CardContent className="p-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#0D1B2A] to-[#3E92CC] rounded-lg flex items-center justify-center mb-3">
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <h4 className="font-bold text-[#0D1B2A] dark:text-white mb-2">
                          {valueData.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {valueData.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold text-[#0D1B2A] dark:text-white mb-6">
                {t.achievements.title}
              </h3>
              <div className="space-y-4">
                {t.achievements.items.map((achievement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center space-x-3"
                  >
                    <div className="w-6 h-6 bg-gradient-to-br from-[#0D1B2A] to-[#3E92CC] rounded-full flex items-center justify-center flex-shrink-0">
                      <Star className="h-3 w-3 text-white" />
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 font-medium">
                      {achievement}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-[#0D1B2A] to-[#3E92CC] rounded-3xl p-8 text-white"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '2,847', label: 'Active Students' },
              { value: '186', label: 'Expert Teachers' },
              { value: '24', label: 'Study Programs' },
              { value: '98%', label: 'Success Rate' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-3xl font-bold mb-2">{stat.value}</h3>
                <p className="text-white/80">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}