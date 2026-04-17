"use client";

import { createContext, useContext, type PropsWithChildren } from "react";

import {
  canAccessAdminSection,
  canManageAdminSection,
  canManageBooks,
  canManageBorrowings,
  canManageCategories,
  canManageInventory,
  canManageUsers,
  canViewFinancials,
  createGuestAuthState,
  hasAdminAccess,
  getCurrentRole,
  getCurrentStatus,
  getCurrentUser,
  isSuperAdmin,
  isAdmin,
  isEmployee,
  isFinancial,
  isAuthenticated,
  isMember,
  isStaff,
  isSuspended,
  type AppAuthState,
} from "./index";
import type { AppAdminSection } from "./app-user-model";

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
    canManageUsers: canManageUsers(authState),
    canManageBooks: canManageBooks(authState),
    canManageCategories: canManageCategories(authState),
    canManageInventory: canManageInventory(authState),
    canManageBorrowings: canManageBorrowings(authState),
    canViewFinancials: canViewFinancials(authState),
    hasAdminAccess: hasAdminAccess(authState),
    isAuthenticated: isAuthenticated(authState),
    isSuperAdmin: isSuperAdmin(authState),
    isMember: isMember(authState),
    isAdmin: isAdmin(authState),
    isEmployee: isEmployee(authState),
    isFinancial: isFinancial(authState),
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

export function useIsSuperAdmin() {
  return useMockAuth().isSuperAdmin;
}

export function useIsAdmin() {
  return useMockAuth().isAdmin;
}

export function useIsEmployee() {
  return useMockAuth().isEmployee;
}

export function useIsFinancial() {
  return useMockAuth().isFinancial;
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

export function useCanManageUsers() {
  return useMockAuth().canManageUsers;
}

export function useCanManageBooks() {
  return useMockAuth().canManageBooks;
}

export function useCanManageCategories() {
  return useMockAuth().canManageCategories;
}

export function useCanManageInventory() {
  return useMockAuth().canManageInventory;
}

export function useCanManageBorrowings() {
  return useMockAuth().canManageBorrowings;
}

export function useCanViewFinancials() {
  return useMockAuth().canViewFinancials;
}

export function useCanAccessAdminSection(section: AppAdminSection) {
  return canAccessAdminSection(useMockAuthContext(), section);
}

export function useCanManageAdminSection(section: AppAdminSection) {
  return canManageAdminSection(useMockAuthContext(), section);
}