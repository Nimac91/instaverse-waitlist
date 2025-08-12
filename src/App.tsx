
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { PhoneMockup, conversations } from './components/PhoneMockup';
import { InstaVerseLogo } from './components/InstaVerseLogo';

const App: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [currentConversationIndex, setCurrentConversationIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentConversationIndex(prevIndex => (prevIndex + 1) % conversations.length);
    }, 5000); // Change conversation every 5 seconds
    
    return () => clearInterval(timer);
  }, []);

  /**
   * Sends the user's email to a Google Apps Script endpoint, which then
   * logs it to a Google Sheet. This is a "fire-and-forget" request.
   */
  const logEmailToSheet = async (emailToLog: string) => {
    const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwwrJ9_qVrrMFsoQeKEdFnqgLIRXIZFaeZWbxqUYVcalZ2A61BpjMCbQ8KKKnMfZDK6/exec";

    try {
      // We use 'no-cors' mode because a cross-origin request to a simple
      // Apps Script endpoint will be blocked by CORS policies otherwise.
      // This sends the data without needing to read the response.
      await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailToLog }),
      });
    } catch (error) {
      // This error is for developers and won't be shown to the user.
      console.error('Failed to log email to Google Sheet:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || isLoading) return;

    setIsLoading(true);
    setError(null);

    // Log the email to the Google Sheet without waiting for a response.
    await logEmailToSheet(email);

    // Proceed to generate a confirmation message with the Gemini API.
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `A user with the email ${email} just signed up for the waitlist for "InstaVerse", our new AI chat app that offers real-time translation. Generate a short, enthusiastic, and friendly confirmation message (2-3 sentences). Confirm they're on the waitlist and build excitement for the launch.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      setConfirmationMessage(response.text);
      setSubmitted(true);
      setEmail('');
    } catch (err) {
      console.error("API Error:", err);
      setError("We couldn't add you to the waitlist right now. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const howItWorks = [
    { num: 1, title: 'Write Naturally', description: 'Type in your native language. Our AI understands the nuance and context.' },
    { num: 2, title: 'Instant AI Translation', description: 'Your message is translated in real-time with stunning accuracy, making conversation flow.' },
    { num: 3, title: 'Build Connections', description: 'Read both the translation and original text to learn, connect, and make friends globally.' },
  ];
  
  const supportedLanguages = [
    'English', 'Spanish', 'Japanese', 'French', 'German', 'Korean', 'Mandarin',
    'Russian', 'Arabic', 'Portuguese', 'Italian', 'Hindi', 'Dutch', 'Turkish', 'Polish'
  ];

  const currentConversation = conversations[currentConversationIndex];

  return (
    <div className="bg-white text-gray-800 antialiased" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="overflow-x-hidden">
        <main>
          {/* Hero Section */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="lg:col-span-1 text-center lg:text-left">
                <InstaVerseLogo className="mb-8 mx-auto lg:mx-0" />
                <h1 className="text-5xl font-extrabold tracking-tighter leading-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-500">
                  Chat in Any Language.
                  <br />
                  Your Words, Their Language.
                </h1>
                <p className="mt-6 text-lg text-gray-600 max-w-xl mx-auto lg:mx-0">
                  Experience the magic of real-time AI translation. InstaVerse helps you build genuine connections by breaking down language barriers, effortlessly.
                </p>
                {submitted ? (
                    <div className="mt-8 max-w-md mx-auto lg:mx-0 bg-green-100 border border-green-200 text-green-800 p-4 rounded-lg animate-fade-in-up">
                        <p className="font-bold">🎉 Welcome to the future!</p>
                        <p className="mt-1">{confirmationMessage}</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto lg:mx-0">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
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
                                Joining...
                            </>
                        ) : 'Get Early Access'}
                    </button>
                    </form>
                )}
                 {error && <p className="mt-3 text-red-600 text-sm max-w-md mx-auto lg:mx-0 text-center sm:text-left">{error}</p>}
              </div>
              
              <div className="lg:col-span-1 relative h-[600px] hidden lg:flex items-center justify-center -mr-20">
                  <div className="absolute inset-0 flex items-center justify-center">
                      <PhoneMockup 
                        key={`${currentConversationIndex}-1`}
                        conversation={currentConversation}
                        perspectiveIndex={1} 
                        className="transform -rotate-[10deg] translate-x-12"
                        phoneStyle="ios"
                        theme="light" 
                      />
                      <PhoneMockup 
                        key={`${currentConversationIndex}-0`}
                        conversation={currentConversation}
                        perspectiveIndex={0}
                        className="transform rotate-[10deg] -translate-x-12 z-10"
                        phoneStyle="android"
                        theme="dark"
                      />
                  </div>
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="py-16 sm:py-24 bg-gray-50/70">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl font-extrabold text-center text-gray-900 tracking-tight">Connect in 3 Simple Steps</h2>
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
                    <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Everything You Need to Connect Globally</h2>
                     <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600">
                        We support a growing list of major world languages, making it easier than ever to find new friends and explore new cultures. And we're always adding more!
                    </p>
                </div>
                <div className="mt-12 max-w-4xl mx-auto flex flex-wrap justify-center gap-x-4 gap-y-4">
                    {supportedLanguages.map((lang) => (
                        <div key={lang} className="bg-gray-100 border border-transparent rounded-full px-5 py-2 text-base font-medium text-gray-700 hover:bg-gray-200 hover:border-gray-300 transition-colors cursor-default">
                            {lang}
                        </div>
                    ))}
                    <div className="bg-blue-100 border border-transparent text-blue-800 rounded-full px-5 py-2 text-base font-medium cursor-default">
                        + More Soon
                    </div>
                </div>
            </div>
          </section>
          
          {/* Bottom Phones Showcase */}
          <section className="py-16 sm:py-24 bg-gray-50/70">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
                <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Your World, Connected</h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">InstaVerse opens up a universe of new friends and experiences. See how easy it is to start a conversation.</p>
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
                <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} InstaVerse. All rights reserved.</p>
            </div>
        </footer>
      </div>
    </div>
  );
};

export default App;