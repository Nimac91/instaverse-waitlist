
import React, { useState, useEffect, Suspense } from 'react';
import { GoogleGenAI } from "@google/genai";
import { useTranslation } from 'react-i18next';
import { PhoneMockup, conversations } from './components/PhoneMockup';
import { InstaVerseLogo } from './components/InstaVerseLogo';

const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'ko', name: 'Korean', flag: '🇰🇷' },
    { code: 'zh', name: 'Mandarin', flag: '🇨🇳' },
    { code: 'ru', name: 'Russian', flag: '🇷🇺' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
    { code: 'pt', name: 'Portuguese', flag: '🇧🇷' },
    { code: 'it', name: 'Italian', flag: '🇮🇹' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
    { code: 'nl', name: 'Dutch', flag: '🇳🇱' },
    { code: 'tr', name: 'Turkish', flag: '🇹🇷' },
    { code: 'pl', name: 'Polish', flag: '🇵🇱' },
];

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex justify-center items-center flex-wrap gap-x-3 gap-y-2 mt-4">
        {languages.map((lang) => (
            <button 
                key={lang.code} 
                onClick={() => changeLanguage(lang.code)} 
                title={lang.name} 
                aria-label={`Switch to ${lang.name}`}
                className={`text-2xl rounded-md p-1 transition-all duration-200 hover:scale-125 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white ${i18n.language.startsWith(lang.code) ? 'scale-110 ring-2 ring-blue-500 ring-offset-2' : 'grayscale hover:grayscale-0'}`}
            >
                {lang.flag}
            </button>
        ))}
    </div>
  );
};


const App: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [currentConversationIndex, setCurrentConversationIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentConversationIndex(prevIndex => (prevIndex + 1) % conversations.length);
    }, 5000);
    
    return () => clearInterval(timer);
  }, []);

  const logEmailToSheet = async (emailToLog: string) => {
    const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwwrJ9_qVrrMFsoQeKEdFnqgLIRXIZFaeZWbxqUYVcalZ2A61BpjMCbQ8KKKnMfZDK6/exec";
    try {
      await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailToLog }),
      });
    } catch (error) {
      console.error('Failed to log email to Google Sheet:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || isLoading) return;

    setIsLoading(true);
    setError(null);
    await logEmailToSheet(email);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const currentLanguageName = languages.find(l => i18n.language.startsWith(l.code))?.name || 'English';
      const prompt = `A user with the email ${email} just signed up for the waitlist for "InstaVerse", our new AI chat app that offers real-time translation. Generate a short, enthusiastic, and friendly confirmation message (2-3 sentences) in ${currentLanguageName}. Confirm they're on the waitlist and build excitement for the launch.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      setConfirmationMessage(response.text || t('form.success.fallback'));
      setSubmitted(true);
      setEmail('');
    } catch (err) {
      console.error("API Error:", err);
      setError(t('form.error'));
    } finally {
      setIsLoading(false);
    }
  };
  
  const howItWorks = [
    { num: 1, title: t('howItWorks.step1.title'), description: t('howItWorks.step1.description') },
    { num: 2, title: t('howItWorks.step2.title'), description: t('howItWorks.step2.description') },
    { num: 3, title: t('howItWorks.step3.title'), description: t('howItWorks.step3.description') },
  ];
  
  const supportedLanguages = languages.map(lang => lang.name);
  const currentConversation = conversations[currentConversationIndex];

  return (
    <div className="bg-white text-gray-800 antialiased" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="overflow-x-hidden">
        <main>
          {/* Hero Section */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
            <div className="flex flex-col items-center text-center">

              {/* Unified Mockups - Positioned above the text */}
              <div className="relative h-[1440px] sm:h-[1800px] w-full flex items-center justify-center mb-12">
                  <div className="flex items-center justify-center">
                      <PhoneMockup 
                        key={`${currentConversationIndex}-1`}
                        conversation={currentConversation}
                        perspectiveIndex={1} 
                        className="transform -rotate-[10deg] translate-x-24 sm:translate-x-36 scale-[2.4] sm:scale-[3]"
                        phoneStyle="ios"
                        theme="light" 
                      />
                      <PhoneMockup 
                        key={`${currentConversationIndex}-0`}
                        conversation={currentConversation}
                        perspectiveIndex={0}
                        className="transform rotate-[10deg] -translate-x-24 sm:-translate-x-36 z-10 scale-[2.4] sm:scale-[3]"
                        phoneStyle="android"
                        theme="dark"
                      />
                  </div>
              </div>
              
              {/* Text, Form Content */}
              <InstaVerseLogo className="mb-8" />
              <h1 className="text-5xl font-extrabold tracking-tighter leading-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-500">
                {t('hero.title.line1')}
                <br />
                {t('hero.title.line2')}
              </h1>
              <p className="mt-6 text-lg text-gray-600 max-w-xl">
                {t('hero.description')}
              </p>
              {submitted ? (
                  <div className="mt-8 w-full max-w-md bg-green-100 border border-green-200 text-green-800 p-4 rounded-lg animate-fade-in-up">
                      <p className="font-bold">{t('form.success.title')}</p>
                      <p className="mt-1">{confirmationMessage || t('form.success.fallback')}</p>
                  </div>
              ) : (
                  <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 w-full max-w-md">
                  <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('form.placeholder')}
                      className="flex-grow w-full px-5 py-3 text-base text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                      required
                      disabled={isLoading}
                  />
                  <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-base px-6 py-3 rounded-md shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                      {isLoading ? (
                          <>
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              {t('form.loading')}
                          </>
                      ) : t('form.button')}
                  </button>
                  </form>
              )}
               {error && <p className="mt-3 text-red-600 text-sm w-full max-w-md">{error}</p>}
            </div>
          </section>

          {/* How It Works Section */}
          <section className="py-16 sm:py-24 bg-gray-50/70">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl font-extrabold text-center text-gray-900 tracking-tight">{t('howItWorks.title')}</h2>
                <div className="mt-12 grid md:grid-cols-3 gap-12 text-center">
                    {howItWorks.map((item) => (
                        <div key={item.num} className="flex flex-col items-center">
                            <div className="w-12 h-12 flex items-center justify-center bg-blue-600 text-white font-bold text-xl rounded-full mb-4">{item.num}</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                            <p className="text-gray-600">{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
          </section>

          {/* Languages Section */}
          <section className="py-16 sm:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">{t('languages.title')}</h2>
                     <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600">
                        {t('languages.description')}
                    </p>
                </div>
                <div className="mt-12 max-w-4xl mx-auto flex flex-wrap justify-center gap-x-4 gap-y-4">
                    {supportedLanguages.map((lang) => (
                        <div key={lang} className="bg-gray-100 border border-transparent rounded-full px-5 py-2 text-base font-medium text-gray-700 hover:bg-gray-200 hover:border-gray-300 transition-colors cursor-default">
                            {lang}
                        </div>
                    ))}
                    <div className="bg-blue-100 border border-transparent text-blue-800 rounded-full px-5 py-2 text-base font-medium cursor-default">
                        {t('languages.moreSoon')}
                    </div>
                </div>
            </div>
          </section>
          
          {/* Bottom Phones Showcase */}
          <section className="py-16 sm:py-24 bg-gray-50/70">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
                <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">{t('showcase.title')}</h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">{t('showcase.description')}</p>
            </div>
            <div className="relative w-full overflow-hidden">
                <div className="flex animate-marquee">
                    {[...conversations, ...conversations].map((convo, index) => (
                        <div key={`marquee-${index}`} className="mx-4 flex-shrink-0">
                            <PhoneMockup
                                conversation={convo}
                                perspectiveIndex={index % 2 as (0 | 1)}
                                phoneStyle={(index % 4 < 2) ? 'ios' : 'android'}
                                theme={(index % 2 === 0) ? 'light' : 'dark'}
                            />
                        </div>
                    ))}
                </div>
            </div>
          </section>
        </main>
        <footer className="border-t border-gray-200 py-6 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} InstaVerse. {t('footer.copyright')}</p>
                <LanguageSwitcher />
            </div>
        </footer>
      </div>
    </div>
  );
};


const AppWrapper: React.FC = () => (
  <Suspense fallback="Loading...">
    <App />
  </Suspense>
);

export default AppWrapper;
