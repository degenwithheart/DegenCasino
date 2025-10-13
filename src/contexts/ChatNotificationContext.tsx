import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ChatNotificationContextType {
    unreadCount: number;
    hasNewMessages: boolean;
    incrementUnread: () => void;
    resetUnread: () => void;
    setTotalMessages: (count: number) => void;
}

const ChatNotificationContext = createContext<ChatNotificationContextType | undefined>(undefined);

const STORAGE_KEY = 'trollbox-unread-count';

export const ChatNotificationProvider: React.FC<{ children: ReactNode; }> = ({ children }) => {
    const [unreadCount, setUnreadCount] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? parseInt(saved, 10) : 0;
        } catch {
            return 0;
        }
    });

    const [lastKnownTotal, setLastKnownTotal] = useState(0);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, unreadCount.toString());
        } catch {
            // Ignore localStorage errors
        }
    }, [unreadCount]);

    const incrementUnread = () => {
        setUnreadCount(prev => prev + 1);
    };

    const resetUnread = () => {
        setUnreadCount(0);
        setLastKnownTotal(0);
    };

    const setTotalMessages = (total: number) => {
        if (total > lastKnownTotal) {
            // New messages arrived
            const newMessages = total - lastKnownTotal;
            setUnreadCount(prev => prev + newMessages);
        }
        setLastKnownTotal(total);
    };

    const hasNewMessages = unreadCount > 0;

    return (
        <ChatNotificationContext.Provider
            value={{
                unreadCount,
                hasNewMessages,
                incrementUnread,
                resetUnread,
                setTotalMessages,
            }}
        >
            {children}
        </ChatNotificationContext.Provider>
    );
};

export const useChatNotifications = () => {
    const context = useContext(ChatNotificationContext);
    if (context === undefined) {
        throw new Error('useChatNotifications must be used within a ChatNotificationProvider');
    }
    return context;
};