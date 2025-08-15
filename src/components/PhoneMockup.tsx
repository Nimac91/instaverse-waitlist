
import React from 'react';
import { ChatMessage, ChatMessageProps } from './ChatMessage';
import { ArrowLeftIcon, MoreHorizontalIcon, PaperAirplaneIcon } from './Icons';

// --- NEW MOCK DATA FOR MULTI-LANGUAGE SLIDESHOW ---

interface User {
    name: string;
    avatarUrl: string;
    language: string;
}

interface Message {
    senderIndex: 0 | 1;
    text: { [key: string]: string };
}

export interface Conversation {
    partners: [User, User];
    messages: Message[];
}

export const conversations: Conversation[] = [
    // 1. English <> Japanese
    {
        partners: [
            { name: 'Sofia', language: 'English', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&h=256&fit=crop' },
            { name: 'Kenji', language: 'Japanese', avatarUrl: 'https://images.unsplash.com/photo-1593104547489-5cfb3839a3b5?q=80&w=256&h=256&fit=crop' }
        ],
        messages: [
            { senderIndex: 0, text: { English: "Hi Kenji! I saw your profile. I'm learning Japanese and would love to practice.", Japanese: "こんにちは、ケンジさん！プロフィールを見ました。日本語を勉強しているので、ぜひ練習したいです。" } },
            { senderIndex: 1, text: { English: "Hello! That sounds great. I'd be happy to help you with Japanese.", Japanese: "こんにちは！それは素晴らしいですね。喜んで日本語の練習をお手伝いしますよ。" } },
            { senderIndex: 0, text: { English: "Awesome! It's so cool we can chat even with the language difference. What are your hobbies?", Japanese: "すごい！言葉が違っても話せるなんて、とてもクールですね。趣味は何ですか？" } },
        ]
    },
    // 2. Spanish <> German
    {
        partners: [
            { name: 'Mateo', language: 'Spanish', avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=256&h=256&fit=crop' },
            { name: 'Lukas', language: 'German', avatarUrl: 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?q=80&w=256&h=256&fit=crop' }
        ],
        messages: [
            { senderIndex: 0, text: { Spanish: "Hola Lukas, ¿te gusta el fútbol?", German: "Hallo Lukas, magst du Fußball?" } },
            { senderIndex: 1, text: { Spanish: "¡Hola Mateo! Sí, me encanta. ¿Cuál es tu equipo favorito?", German: "Hallo Mateo! Ja, ich liebe es. Was ist dein Lieblingsteam?" } },
            { senderIndex: 0, text: { Spanish: "Soy un gran fan del Real Madrid. ¿Y tú?", German: "Ich bin ein großer Fan von Real Madrid. Und du?" } },
        ]
    },
    // 3. French <> Korean
    {
        partners: [
            { name: 'Chloé', language: 'French', avatarUrl: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=256&h=256&fit=crop' },
            { name: 'Hana', language: 'Korean', avatarUrl: 'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?q=80&w=256&h=256&fit=crop' }
        ],
        messages: [
            { senderIndex: 0, text: { French: "Salut Hana ! J'adore la musique coréenne. Des recommandations ?", Korean: "안녕하세요 하나! 저는 한국 음악을 정말 좋아해요. 추천해줄 만한 거 있어요?" } },
            { senderIndex: 1, text: { French: "Bonjour Chloé ! Bien sûr, tu devrais écouter IU. Sa voix est incroyable.", Korean: "안녕하세요 클로에! 물론이죠, 아이유 노래 한번 들어보세요. 목소리가 정말 놀라워요." } },
        ]
    },
    // 4. Russian <> Arabic
    {
        partners: [
            { name: 'Ivan', language: 'Russian', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&fit=crop' },
            { name: 'Fatima', language: 'Arabic', avatarUrl: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=256&h=256&fit=crop' }
        ],
        messages: [
            { senderIndex: 0, text: { Russian: "Привет, Фатима. Какая твоя любимая еда?", Arabic: "مرحباً يا فاطمة. ما هو طعامك المفضل؟" } },
            { senderIndex: 1, text: { Russian: "Привет, Иван! Я люблю кускус. А ты?", Arabic: "مرحباً إيفان! أحب الكسكس. وأنت؟" } },
        ]
    },
];


// --- DYNAMIC CHAT SCREEN COMPONENT ---

type PhoneStyle = 'ios' | 'android';
type Theme = 'light' | 'dark';

interface ChatScreenProps {
    conversation: Conversation;
    perspectiveIndex: 0 | 1;
    theme: Theme;
    phoneStyle: PhoneStyle;
}

const messagePlaceholders: { [key: string]: string } = {
    English: 'Message...',
    Japanese: 'メッセージ...',
    Spanish: 'Mensaje...',
    German: 'Nachricht...',
    French: 'Message...',
    Korean: '메시지...',
    Russian: 'Сообщение...',
    Arabic: 'رسالة...',
};

const ChatScreen: React.FC<ChatScreenProps> = ({ conversation, perspectiveIndex, theme, phoneStyle }) => {
    const currentUser = conversation.partners[perspectiveIndex];
    const otherUser = conversation.partners[perspectiveIndex === 0 ? 1 : 0];
    const isDark = theme === 'dark';

    const headerPadding = phoneStyle === 'ios' ? 'pt-8' : 'pt-9';
    const placeholderText = messagePlaceholders[currentUser.language] || `Message in ${currentUser.language}...`;

    return (
        <div className={`flex flex-col h-full ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
            {/* Header */}
            <div className={`flex items-center justify-between px-4 pb-3 ${headerPadding} ${isDark ? 'bg-gray-800 border-b border-gray-700' : 'bg-gray-50 border-b border-gray-200'} z-10`}>
                <ArrowLeftIcon className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                <div className="flex flex-col items-center">
                    <span className={`font-bold text-sm ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{otherUser.name}</span>
                    <span className="text-xs text-green-500">online</span>
                </div>
                <MoreHorizontalIcon className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
            
            {/* Chat Area */}
            <div className="flex-grow p-4 space-y-4 overflow-y-auto">
                {conversation.messages.map((msg, index) => {
                    const isSender = msg.senderIndex === perspectiveIndex;
                    const chatMsgProps: ChatMessageProps = {
                        isSender,
                        translatedText: msg.text[currentUser.language],
                        originalText: msg.text[otherUser.language],
                        avatarUrl: isSender ? currentUser.avatarUrl : otherUser.avatarUrl,
                        theme,
                    };
                    return <ChatMessage key={index} {...chatMsgProps} />;
                })}
            </div>

            {/* Input Bar */}
            <div className={`p-2 z-10 ${isDark ? 'bg-gray-800 border-t border-gray-700' : 'bg-gray-50 border-t border-gray-200'}`}>
                <div className={`flex items-center rounded-full p-1 ${isDark ? 'bg-gray-700 border border-gray-600' : 'bg-white border border-gray-300'}`}>
                   <input type="text" placeholder={placeholderText} className={`flex-grow bg-transparent text-sm px-3 focus:outline-none ${isDark ? 'text-gray-200 placeholder-gray-400' : 'text-gray-700'}`} readOnly />
                   <button className="bg-blue-500 rounded-full p-2 ml-2 flex-shrink-0" aria-label="Send message">
                       <PaperAirplaneIcon className="w-4 h-4 text-white" />
                   </button>
                </div>
            </div>
        </div>
    );
};


interface PhoneMockupProps {
    conversation: Conversation;
    perspectiveIndex: 0 | 1;
    className?: string;
    phoneStyle?: PhoneStyle;
    theme?: Theme;
}

export const PhoneMockup: React.FC<PhoneMockupProps> = ({ conversation, perspectiveIndex, className, phoneStyle = 'ios', theme = 'light' }) => {
    const isIOS = phoneStyle === 'ios';

    const frameClasses = isIOS 
      ? 'border-gray-900 bg-gray-900 rounded-[2.5rem]' 
      : 'border-black bg-black rounded-[1.5rem]';
    
    const screenBg = theme === 'dark' ? 'bg-gray-900' : 'bg-white';
    const screenRadius = isIOS ? 'rounded-[2rem]' : 'rounded-[1.2rem]';


    return (
        <div className={`relative mx-auto border-[8px] ${frameClasses} h-[600px] w-[300px] shadow-2xl ${className}`}>
            {/* Notch or Hole-punch */}
            {isIOS ? (
                <div className="w-32 h-5 bg-gray-900 rounded-b-xl absolute -top-px left-1/2 -translate-x-1/2 z-20" />
            ) : (
                <div className="w-3 h-3 bg-black rounded-full absolute top-3 left-1/2 -translate-x-1/2 z-20" />
            )}
            
            {/* Screen */}
            <div className={`${screenRadius} overflow-hidden w-full h-full ${screenBg} flex flex-col`}>
                <div className="flex-1 relative">
                     <ChatScreen conversation={conversation} perspectiveIndex={perspectiveIndex} theme={theme} phoneStyle={phoneStyle} />
                </div>
            </div>
        </div>
    );
};
