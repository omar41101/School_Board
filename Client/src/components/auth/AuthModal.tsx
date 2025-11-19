import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { VisuallyHidden } from '../ui/visually-hidden';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Shield, 
  GraduationCap,
  UserCircle,
  ArrowLeft
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (userType: 'admin' | 'student', userData: any) => void;
  currentLang: 'ar' | 'fr' | 'en';
}

const translations = {
  ar: {
    signIn: 'تسجيل الدخول',
    signUp: 'إنشاء حساب',
    admin: 'الإدارة',
    student: 'الطلاب',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    confirmPassword: 'تأكيد كلمة المرور',
    fullName: 'الاسم الكامل',
    studentId: 'رقم الطالب',
    adminCode: 'رمز الإدارة',
    login: 'دخول',
    register: 'تسجيل',
    forgotPassword: 'نسيت كلمة المرور؟',
    backToLogin: 'العودة لتسجيل الدخول',
    welcome: 'مرحباً بك',
    adminWelcome: 'مرحباً بك في لوحة الإدارة',
    studentWelcome: 'مرحباً بك في منصة الطلاب',
    loading: 'جاري التحميل...'
  },
  fr: {
    signIn: 'Se connecter',
    signUp: 'S\'inscrire',
    admin: 'Administration',
    student: 'Étudiants',
    email: 'Email',
    password: 'Mot de passe',
    confirmPassword: 'Confirmer le mot de passe',
    fullName: 'Nom complet',
    studentId: 'ID Étudiant',
    adminCode: 'Code Admin',
    login: 'Connexion',
    register: 'Inscription',
    forgotPassword: 'Mot de passe oublié ?',
    backToLogin: 'Retour à la connexion',
    welcome: 'Bienvenue',
    adminWelcome: 'Bienvenue dans le panneau d\'administration',
    studentWelcome: 'Bienvenue dans la plateforme étudiante',
    loading: 'Chargement...'
  },
  en: {
    signIn: 'Sign In',
    signUp: 'Sign Up',
    admin: 'Administration',
    student: 'Students',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    fullName: 'Full Name',
    studentId: 'Student ID',
    adminCode: 'Admin Code',
    login: 'Login',
    register: 'Register',
    forgotPassword: 'Forgot Password?',
    backToLogin: 'Back to Login',
    welcome: 'Welcome',
    adminWelcome: 'Welcome to Admin Panel',
    studentWelcome: 'Welcome to Student Platform',
    loading: 'Loading...'
  }
};

export function AuthModal({ isOpen, onClose, onAuthSuccess, currentLang }: AuthModalProps) {
  const [userType, setUserType] = useState<'admin' | 'student'>('student');
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    studentId: '',
    adminCode: ''
  });

  const t = translations[currentLang];
  const isRTL = currentLang === 'ar';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    const userData = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.fullName || 'John Doe',
      email: formData.email,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      role: userType
    };

    setIsLoading(false);
    onAuthSuccess(userType, userData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        // Only invoke onClose when dialog is being closed
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-md p-0 bg-transparent border-0 shadow-none">
        <VisuallyHidden>
          <DialogHeader>
            <DialogTitle>
              {userType === 'admin' ? t?.adminWelcome || 'Welcome Admin' : t?.studentWelcome || 'Welcome Student'}
            </DialogTitle>
            <DialogDescription>
              {authMode === 'signin' ? t.signIn : t.signUp} {userType === 'admin' ? t.admin : t.student}
            </DialogDescription>
          </DialogHeader>
        </VisuallyHidden>
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          <Card className="bg-white/95 dark:bg-[#0D1B2A]/95 backdrop-blur-lg border border-white/20 dark:border-[#3E92CC]/20 shadow-2xl relative">
            <CardHeader className="text-center pb-4">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex justify-center mb-4"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-[#0D1B2A] to-[#3E92CC] rounded-2xl flex items-center justify-center">
                  {userType === 'admin' ? (
                    <Shield className="h-8 w-8 text-white" />
                  ) : (
                    <GraduationCap className="h-8 w-8 text-white" />
                  )}
                </div>
              </motion.div>
              <CardTitle className="text-2xl text-[#0D1B2A] dark:text-white">
                {userType === 'admin' ? t?.adminWelcome || 'Welcome Admin' : t?.studentWelcome || 'Welcome Student'}
              </CardTitle>
              {/* Close Button */}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 h-8 w-8 p-0"
                onClick={onClose}
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </CardHeader>

            <CardContent className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
              
              {/* User Type Selection */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 dark:bg-[#1B2B3A] rounded-lg">
                {(['student', 'admin'] as const).map((type) => (
                  <Button
                    key={type}
                    variant={userType === type ? 'default' : 'ghost'}
                    className={`${
                      userType === type 
                        ? 'bg-white dark:bg-[#0D1B2A] text-[#0D1B2A] dark:text-white shadow-sm' 
                        : 'text-gray-600 dark:text-gray-400'
                    } transition-all duration-200`}
                    onClick={() => setUserType(type)}
                  >
                    {type === 'admin' ? (
                      <Shield className="h-4 w-4 mr-2" />
                    ) : (
                      <GraduationCap className="h-4 w-4 mr-2" />
                    )}
                    {t[type]}
                  </Button>
                ))}
              </div>

              {/* Auth Tabs */}
              <Tabs value={authMode} onValueChange={(value) => setAuthMode(value as 'signin' | 'signup')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin">{t.signIn}</TabsTrigger>
                  <TabsTrigger value="signup">{t.signUp}</TabsTrigger>
                </TabsList>

                <TabsContent value="signin" className="mt-6">
                  <AnimatePresence mode="wait">
                    <motion.form
                      key={`signin-${userType}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                      onSubmit={handleSubmit}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="signin-email">{t.email}</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="signin-email"
                            type="email"
                            placeholder={t.email}
                            className="pl-10"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signin-password">{t.password}</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="signin-password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder={t.password}
                            className="pl-10 pr-10"
                            value={formData.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {userType === 'admin' && (
                        <div className="space-y-2">
                          <Label htmlFor="admin-code">{t.adminCode}</Label>
                          <div className="relative">
                            <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="admin-code"
                              type="text"
                              placeholder={t.adminCode}
                              className="pl-10"
                              value={formData.adminCode}
                              onChange={(e) => handleInputChange('adminCode', e.target.value)}
                              required
                            />
                          </div>
                        </div>
                      )}

                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-[#0D1B2A] to-[#3E92CC] hover:from-[#1B2B3A] hover:to-[#4EA2DC]"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>{t.loading}</span>
                          </div>
                        ) : (
                          t.login
                        )}
                      </Button>

                      <div className="text-center">
                        <Button variant="link" className="text-[#3E92CC]">
                          {t.forgotPassword}
                        </Button>
                      </div>
                    </motion.form>
                  </AnimatePresence>
                </TabsContent>

                <TabsContent value="signup" className="mt-6">
                  <AnimatePresence mode="wait">
                    <motion.form
                      key={`signup-${userType}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      onSubmit={handleSubmit}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="signup-name">{t.fullName}</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="signup-name"
                            type="text"
                            placeholder={t.fullName}
                            className="pl-10"
                            value={formData.fullName}
                            onChange={(e) => handleInputChange('fullName', e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-email">{t.email}</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="signup-email"
                            type="email"
                            placeholder={t.email}
                            className="pl-10"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      {userType === 'student' && (
                        <div className="space-y-2">
                          <Label htmlFor="student-id">{t.studentId}</Label>
                          <div className="relative">
                            <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="student-id"
                              type="text"
                              placeholder={t.studentId}
                              className="pl-10"
                              value={formData.studentId}
                              onChange={(e) => handleInputChange('studentId', e.target.value)}
                              required
                            />
                          </div>
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="signup-password">{t.password}</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="signup-password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder={t.password}
                            className="pl-10"
                            value={formData.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">{t.confirmPassword}</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="confirm-password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder={t.confirmPassword}
                            className="pl-10 pr-10"
                            value={formData.confirmPassword}
                            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-[#0D1B2A] to-[#3E92CC] hover:from-[#1B2B3A] hover:to-[#4EA2DC]"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>{t.loading}</span>
                          </div>
                        ) : (
                          t.register
                        )}
                      </Button>
                    </motion.form>
                  </AnimatePresence>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}