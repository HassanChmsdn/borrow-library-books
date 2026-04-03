"use client";

import {
  createContext,
  useContext,
  type PropsWithChildren,
} from "react";

import {
  createMockAuthState,
  type MockAuthState,
} from "@/lib/auth/mock-auth";

const MockAuthContext = createContext<MockAuthState>(createMockAuthState(null));

interface MockAuthProviderProps extends PropsWithChildren {
  value: MockAuthState;
}

export function MockAuthProvider({
  children,
  value,
}: MockAuthProviderProps) {
  return (
    <MockAuthContext.Provider value={value}>{children}</MockAuthContext.Provider>
  );
}

export function useMockAuthContext() {
  return useContext(MockAuthContext);
}