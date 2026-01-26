import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_STORAGE_KEY = 'hateintel_users';
const SESSION_STORAGE_KEY = 'hateintel_session';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const sessionData = localStorage.getItem(SESSION_STORAGE_KEY);
    if (sessionData) {
      try {
        const session = JSON.parse(sessionData);
        setUser(session.user);
      } catch {
        localStorage.removeItem(SESSION_STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const getUsers = (): Record<string, { password: string; name: string }> => {
    try {
      const data = localStorage.getItem(USERS_STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  };

  const saveUsers = (users: Record<string, { password: string; name: string }>) => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  };

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const users = getUsers();
    const userRecord = users[email.toLowerCase()];

    if (!userRecord) {
      return { success: false, error: 'No account found with this email' };
    }

    if (userRecord.password !== password) {
      return { success: false, error: 'Incorrect password' };
    }

    const loggedInUser: User = {
      id: email.toLowerCase().replace(/[^a-z0-9]/g, '_'),
      email: email.toLowerCase(),
      name: userRecord.name,
    };

    setUser(loggedInUser);
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ user: loggedInUser }));

    return { success: true };
  };

  const signUp = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    const users = getUsers();
    const emailKey = email.toLowerCase();

    if (users[emailKey]) {
      return { success: false, error: 'An account with this email already exists' };
    }

    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' };
    }

    users[emailKey] = { password, name };
    saveUsers(users);

    const newUser: User = {
      id: emailKey.replace(/[^a-z0-9]/g, '_'),
      email: emailKey,
      name,
    };

    setUser(newUser);
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ user: newUser }));

    return { success: true };
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem(SESSION_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
