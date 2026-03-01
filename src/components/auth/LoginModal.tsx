import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Heart, Mail } from 'lucide-react';

export const LoginModal = () => {
  const { showLoginModal, setShowLoginModal, login } = useAuth();
  const { language } = useLanguage();
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (trimmed && emailRegex.test(trimmed) && trimmed.length <= 255) {
      login(trimmed);
    }
  };

  const handleSocialLogin = (provider: string) => {
    // Placeholder - just login with provider name
    login(`user@${provider}.com`);
  };

  return (
    <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            {language === 'ru' ? 'Войдите, чтобы сохранять места' : 'Log in to save places'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center py-4">
          <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-4">
            <Heart className="h-8 w-8 text-accent" />
          </div>
          
          <p className="text-muted-foreground text-center text-sm mb-6">
            {language === 'ru' 
              ? 'Сохраняйте любимые места и получайте персональные рекомендации' 
              : 'Save your favorite places and get personalized recommendations'}
          </p>

          {/* Social login buttons */}
          <div className="w-full space-y-3 mb-4">
            <Button 
              variant="outline" 
              className="w-full justify-start gap-3 h-12"
              onClick={() => handleSocialLogin('telegram')}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#26A5E4">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              <span>{language === 'ru' ? 'Продолжить с Telegram' : 'Continue with Telegram'}</span>
            </Button>

            <Button 
              variant="outline" 
              className="w-full justify-start gap-3 h-12"
              onClick={() => handleSocialLogin('google')}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>{language === 'ru' ? 'Продолжить с Google' : 'Continue with Google'}</span>
            </Button>

            <Button 
              variant="outline" 
              className="w-full justify-start gap-3 h-12"
              onClick={() => handleSocialLogin('vk')}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#0077FF">
                <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.12-5.339-3.202-2.17-3.043-2.763-5.32-2.763-5.795 0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.864 2.492 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.372 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.254-1.406 2.151-3.574 2.151-3.574.119-.254.322-.491.763-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.05.17.49-.085.744-.576.744z"/>
              </svg>
              <span>{language === 'ru' ? 'Продолжить с VK' : 'Continue with VK'}</span>
            </Button>
          </div>

          <div className="relative w-full mb-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                {language === 'ru' ? 'или' : 'or'}
              </span>
            </div>
          </div>

          {/* Email login */}
          <form onSubmit={handleSubmit} className="w-full space-y-3">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder={language === 'ru' ? 'Введите email' : 'Enter your email'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            <Button type="submit" className="w-full h-12">
              {language === 'ru' ? 'Продолжить' : 'Continue'}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-4">
            {language === 'ru' 
              ? 'Это демо-версия. Реальная авторизация будет добавлена позже.' 
              : 'This is a demo. Real authentication will be added later.'}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
