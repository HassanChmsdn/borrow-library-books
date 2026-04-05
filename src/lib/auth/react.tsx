"use client";

import { createContext, useContext, type PropsWithChildren } from "react";

import {
  createMockAuthState,
  getCurrentRole,
  getCurrentUser,
  isAdmin,
  isAuthenticated,
  isMember,
  type MockAuthState,
} from "./index";

const MockAuthContext = createContext<MockAuthState>(createMockAuthState(null));

interface MockAuthProviderProps extends PropsWithChildren {
  value: MockAuthState;
}

export function MockAuthProvider({
  children,
  value,
}: MockAuthProviderProps) {
  return <MockAuthContext.Provider value={value}>{children}</MockAuthContext.Provider>;
}

export function useMockAuthContext() {
  return useContext(MockAuthContext);
}

export function useMockAuth() {
  const authState = useMockAuthContext();

  return {
    ...authState,
    currentUser: getCurrentUser(authState),
    currentRole: getCurrentRole(authState),
    isAuthenticated: isAuthenticated(authState),
    isMember: isMember(authState),
    isAdmin: isAdmin(authState),
  };
}

export function useCurrentUser() {
  return useMockAuth().currentUser;
}

export function useCurrentRole() {
  return useMockAuth().currentRole;
}

export function useIsAuthenticated() {
  return useMockAuth().isAuthenticated;
}

export function useIsMember() {
  return useMockAuth().isMember;
}

export function useIsAdmin() {
  return useMockAuth().isAdmin;
}