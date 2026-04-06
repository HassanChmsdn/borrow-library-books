export {
  buildAuth0LoginHref,
  isAuth0Configured,
} from "./auth0";

export {
  MOCK_AUTH_COOKIE,
  buildMockAuthorizeHref,
  buildMockSignInHref,
  buildMockSignOutHref,
  createMockAuthState,
  getCurrentRole,
  getCurrentUser,
  getDefaultRedirectForRole,
  getMockCurrentUser,
  isAdmin,
  isAuthenticated,
  isMember,
  isMockAuthenticatedRole,
  isMockAuthRole,
  mockAuthenticatedRoles,
  sanitizeRedirectTo,
  type MockAuthenticatedRole,
  type MockAuthRole,
  type MockAuthState,
  type MockAuthUser,
  type MockSession,
} from "./mock-auth";