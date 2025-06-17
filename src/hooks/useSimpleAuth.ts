'use client';

import { useState } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'patient' | 'pharmacy' | 'admin' | 'guest';
}

// Simple global state for auth (not ideal for production, but works for now)
let globalUser: User | null = null;
let globalSetUser: ((user: User | null) => void) | null = null;

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(globalUser);

  // Set the global setter on first use
  if (!globalSetUser) {
    globalSetUser = (newUser: User | null) => {
      globalUser = newUser;
      setUser(newUser);
    };
  }

  const login = (userData: User) => {
    if (globalSetUser) {
      globalSetUser(userData);
    }
  };

  const logout = () => {
    if (globalSetUser) {
      globalSetUser(null);
    }
  };

  return {
    user,
    isAuthenticated: !!user,
    login,
    logout
  };
};
