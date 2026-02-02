import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Backpack, Palette, Map, Heart, Route, Layers, Share2, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const roles: { 
  id: UserRole; 
  icon: React.ElementType; 
  labelRu: string; 
  labelEn: string;
  features: { icon: React.ElementType; ru: string; en: string }[];
}[] = [
  {
    id: 'tourist',
    icon: Backpack,
    labelRu: 'Турист',
    labelEn: 'Tourist',
    features: [
      { icon: Heart, ru: 'Сохраняйте места', en: 'Save places' },
      { icon: Route, ru: 'Стройте маршруты', en: 'Build routes' },
      { icon: Map, ru: 'Получайте рекомендации', en: 'Get recommendations' },
    ],
  },
  {
    id: 'creator',
    icon: Palette,
    labelRu: 'Креатор',
    labelEn: 'Creator',
    features: [
      { icon: Layers, ru: 'Создавайте свои слои', en: 'Create your layers' },
      { icon: Share2, ru: 'Делитесь коллекциями', en: 'Share collections' },
      { icon: TrendingUp, ru: 'Зарабатывайте на контенте', en: 'Monetize content' },
    ],
  },
];

export const RoleSelector = () => {
  const { showRoleSelector, setShowRoleSelector, setUserRole } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const handleSelectRole = (role: UserRole) => {
    setUserRole(role);
    navigate('/dashboard');
  };

  return (
    <Dialog open={showRoleSelector} onOpenChange={setShowRoleSelector}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            {language === 'ru' 
              ? 'Как вы хотите использовать WowAtlas?' 
              : 'How would you like to use WowAtlas?'}
          </DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-4 py-6">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <button
                key={role.id}
                onClick={() => handleSelectRole(role.id)}
                className="group relative flex flex-col items-center p-6 rounded-xl border-2 border-border 
                           hover:border-primary hover:bg-accent/30 transition-all duration-200
                           focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4
                                group-hover:bg-primary/20 transition-colors">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                
                <h3 className="text-lg font-semibold mb-4">
                  {language === 'ru' ? role.labelRu : role.labelEn}
                </h3>
                
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {role.features.map((feature, idx) => {
                    const FeatureIcon = feature.icon;
                    return (
                      <li key={idx} className="flex items-center gap-2">
                        <FeatureIcon className="h-4 w-4 text-primary/70" />
                        <span>{language === 'ru' ? feature.ru : feature.en}</span>
                      </li>
                    );
                  })}
                </ul>

                <Button 
                  variant="outline" 
                  className="mt-6 w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                >
                  {language === 'ru' ? 'Выбрать' : 'Select'}
                </Button>
              </button>
            );
          })}
        </div>

        <p className="text-xs text-muted-foreground text-center">
          {language === 'ru' 
            ? 'Вы можете изменить роль в любое время в настройках профиля' 
            : 'You can change your role anytime in profile settings'}
        </p>
      </DialogContent>
    </Dialog>
  );
};
