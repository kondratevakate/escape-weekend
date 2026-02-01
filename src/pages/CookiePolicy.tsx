import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const CookiePolicy = () => {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {language === 'ru' ? 'Назад к карте' : 'Back to map'}
          </Link>
        </Button>

        <article className="prose prose-stone dark:prose-invert max-w-none">
          {language === 'ru' ? (
            <>
              <h1>Политика использования файлов Cookie</h1>
              <p className="text-muted-foreground">
                Последнее обновление: {new Date().toLocaleDateString('ru-RU')}
              </p>

              <h2>Что такое файлы Cookie?</h2>
              <p>
                Файлы cookie — это небольшие текстовые файлы, которые сохраняются на вашем 
                устройстве при посещении веб-сайта. Они помогают сайту запоминать ваши 
                предпочтения и улучшать пользовательский опыт.
              </p>

              <h2>Какие файлы Cookie мы используем</h2>
              
              <h3>Необходимые файлы Cookie</h3>
              <p>
                Эти файлы cookie необходимы для работы сайта и не могут быть отключены:
              </p>
              <ul>
                <li><strong>cookie_consent</strong> — сохраняет ваше согласие на использование cookies</li>
                <li><strong>app_language</strong> — сохраняет выбранный язык интерфейса</li>
                <li><strong>kola_favorites</strong> — хранит список избранных мест</li>
              </ul>

              <h3>Функциональные файлы Cookie</h3>
              <p>
                Эти файлы cookie помогают персонализировать ваш опыт:
              </p>
              <ul>
                <li>Запоминают настройки отображения карты</li>
                <li>Сохраняют историю просмотренных мест</li>
              </ul>

              <h2>Как управлять файлами Cookie</h2>
              <p>
                Вы можете удалить файлы cookie в настройках браузера. Обратите внимание, 
                что это может повлиять на функциональность сайта.
              </p>

              <h2>Контакты</h2>
              <p>
                Если у вас есть вопросы о нашей политике использования файлов cookie, 
                свяжитесь с нами.
              </p>
            </>
          ) : (
            <>
              <h1>Cookie Policy</h1>
              <p className="text-muted-foreground">
                Last updated: {new Date().toLocaleDateString('en-US')}
              </p>

              <h2>What are Cookies?</h2>
              <p>
                Cookies are small text files that are stored on your device when you visit 
                a website. They help the site remember your preferences and improve your 
                user experience.
              </p>

              <h2>Types of Cookies We Use</h2>
              
              <h3>Essential Cookies</h3>
              <p>
                These cookies are necessary for the website to function and cannot be disabled:
              </p>
              <ul>
                <li><strong>cookie_consent</strong> — stores your cookie consent preference</li>
                <li><strong>app_language</strong> — stores your chosen interface language</li>
                <li><strong>kola_favorites</strong> — stores your list of favorite places</li>
              </ul>

              <h3>Functional Cookies</h3>
              <p>
                These cookies help personalize your experience:
              </p>
              <ul>
                <li>Remember map display settings</li>
                <li>Save your browsing history of places</li>
              </ul>

              <h2>How to Manage Cookies</h2>
              <p>
                You can delete cookies in your browser settings. Please note that this may 
                affect the functionality of the website.
              </p>

              <h2>Contact Us</h2>
              <p>
                If you have questions about our cookie policy, please contact us.
              </p>
            </>
          )}
        </article>
      </div>
    </div>
  );
};

export default CookiePolicy;
