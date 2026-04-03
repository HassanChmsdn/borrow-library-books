"use client";

import {
  getCurrentRole,
  getCurrentUser,
  isAdmin,
  isAuthenticated,
  isMember,
} from "@/lib/auth/mock-auth";
import { useMockAuthContext } from "@/components/auth/mock-auth-provider";

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