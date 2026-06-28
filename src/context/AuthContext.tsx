import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Profile } from '../types/supabase';

interface AuthContextType {
    session: Session | null;
    user: User | null;
    profile: Profile | null;
    isLoading: boolean;
    /** @deprecated use isLoading */
    loading: boolean;
    signOut: () => Promise<void>;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    session: null,
    user: null,
    profile: null,
    isLoading: true,
    loading: true,
    signOut: async () => {},
    refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Ensures we only stop the loading state once — on the very first auth event
    // (INITIAL_SESSION), which Supabase JS v2 fires synchronously after registration.
    const initialEventFired = useRef(false);

    const fetchProfile = async (userId: string) => {
        try {
            const { data } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();
            setProfile(data ?? null);
        } catch {
            setProfile(null);
        }
    };

    useEffect(() => {
        /**
         * SINGLE SOURCE OF TRUTH — only onAuthStateChange.
         *
         * Supabase JS v2 fires an INITIAL_SESSION event right after the listener
         * is registered, which replaces the need for a separate getSession() call.
         * Calling both causes duplicate state updates and the loading flag being
         * cleared at unpredictable moments, which is the root cause of the login
         * persistence bug.
         */
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, newSession) => {
            // 1. Update session immediately — this unblocks AuthGuard navigation
            setSession(newSession);

            // 2. Mark loading done after the FIRST event only.
            //    Do NOT await fetchProfile() here — profile is fetched in the
            //    background so isLoading resolves as soon as session is known.
            if (!initialEventFired.current) {
                initialEventFired.current = true;
                setIsLoading(false);
            }

            // 3. Fetch profile from DB in background (non-blocking)
            if (newSession?.user) {
                fetchProfile(newSession.user.id);
            } else {
                setProfile(null);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const refreshProfile = async () => {
        const userId = session?.user?.id;
        if (userId) {
            await fetchProfile(userId);
        }
    };

    const signOut = async () => {
        setProfile(null);
        await supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider
            value={{
                session,
                user: session?.user ?? null,
                profile,
                isLoading,
                loading: isLoading, // backward-compat alias
                signOut,
                refreshProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
