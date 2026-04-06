export type AppUserRole = "member" | "admin";
export type AppUserStatus = "active" | "suspended";

export interface AppUserRecord {
  id: string;
  authProvider: "mock" | "auth0";
  authSubject: string;
  email: string;
  fullName: string;
  role: AppUserRole;
  status: AppUserStatus;
  subtitle: string;
}

const mockAppUsers: ReadonlyArray<AppUserRecord> = [
  {
    id: "member-sara-chehab",
    authProvider: "mock",
    authSubject: "member",
    email: "sara.chehab@library.test",
    fullName: "Sara Chehab",
    role: "member",
    status: "active",
    subtitle: "Member account",
  },
  {
    id: "admin-samir-chahine",
    authProvider: "mock",
    authSubject: "admin",
    email: "samir.chahine@library.test",
    fullName: "Samir Chahine",
    role: "admin",
    status: "active",
    subtitle: "Shift lead account",
  },
];

const auth0AppUsers: ReadonlyArray<AppUserRecord> = [
  {
    id: "member-sara-chehab-auth0",
    authProvider: "auth0",
    authSubject: "auth0|member-sara-chehab",
    email: "sara.chehab@library.test",
    fullName: "Sara Chehab",
    role: "member",
    status: "active",
    subtitle: "Member account",
  },
  {
    id: "admin-samir-chahine-auth0",
    authProvider: "auth0",
    authSubject: "auth0|admin-samir-chahine",
    email: "samir.chahine@library.test",
    fullName: "Samir Chahine",
    role: "admin",
    status: "active",
    subtitle: "Shift lead account",
  },
  {
    id: "member-lina-saad-auth0",
    authProvider: "auth0",
    authSubject: "auth0|lina-saad",
    email: "lina.saad@library.test",
    fullName: "Lina Saad",
    role: "member",
    status: "suspended",
    subtitle: "Suspended member account",
  },
];

const appUsers = [...mockAppUsers, ...auth0AppUsers] as const;

function createLookupKey(provider: AppUserRecord["authProvider"], subject: string) {
  return `${provider}:${subject}`;
}

const appUserLookup = new Map(
  appUsers.map((record) => [
    createLookupKey(record.authProvider, record.authSubject),
    record,
  ]),
);

export function getMockAppUserRecord(role: AppUserRole) {
  return appUserLookup.get(createLookupKey("mock", role)) ?? null;
}

export function getAppUserRecordByIdentity(options: {
  provider: AppUserRecord["authProvider"];
  subject: string;
}) {
  return appUserLookup.get(createLookupKey(options.provider, options.subject)) ?? null;
}