"use client";

import { createContext, useContext, type PropsWithChildren } from "react";

import {
  createGuestAuthState,
  hasAdminAccess,
  getCurrentRole,
  getCurrentStatus,
  getCurrentUser,
  isAdmin,
  isAuthenticated,
  isMember,
  isStaff,
  isSuspended,
  type AppAuthState,
} from "./index";

const MockAuthContext = createContext<AppAuthState>(createGuestAuthState());

interface MockAuthProviderProps extends PropsWithChildren {
  value: AppAuthState;
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
    currentStatus: getCurrentStatus(authState),
    hasAdminAccess: hasAdminAccess(authState),
    isAuthenticated: isAuthenticated(authState),
    isMember: isMember(authState),
    isAdmin: isAdmin(authState),
    isStaff: isStaff(authState),
    isSuspended: isSuspended(authState),
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

export function useHasAdminAccess() {
  return useMockAuth().hasAdminAccess;
}

export function useIsStaff() {
  return useMockAuth().isStaff;
}

export function useIsSuspended() {
  return useMockAuth().isSuspended;
}