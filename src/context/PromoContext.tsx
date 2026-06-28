import React, { createContext, useState, useContext, ReactNode } from 'react';

interface PromoContextType {
    promoCode: string | null;
    setPromoCode: (code: string | null) => void;
}

const PromoContext = createContext<PromoContextType | undefined>(undefined);

export function PromoProvider({ children }: { children: ReactNode }) {
    const [promoCode, setPromoCode] = useState<string | null>(null);

    return (
        <PromoContext.Provider value={{ promoCode, setPromoCode }}>
            {children}
        </PromoContext.Provider>
    );
}

export function usePromo() {
    const context = useContext(PromoContext);
    if (context === undefined) {
        throw new Error('usePromo must be used within a PromoProvider');
    }
    return context;
}
