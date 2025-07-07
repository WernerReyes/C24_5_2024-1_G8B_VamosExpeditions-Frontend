import type { VersionQuotationEntity } from "@/domain/entities";

type PublicRoutes = {
  LOGIN: string;
  FORGET_PASSWORD: string;
  RESET_PASSWORD: (token?: string) => string;
  TWO_FACTOR_AUTHENTICATION: (tempToken?: string) => string;
  VERIFY_F2A_EMAIL: string;
};

type PrivateRoutes = {
  BASE: string;
  DASHBOARD: string;
  QUOTES: string;
  NEW_QUOTE: string;
  EDIT_QUOTE: (id?: VersionQuotationEntity["id"]) => string;
  RESERVATIONS: string;
  PROFILE: string;
  HOTEL: string;
  COUNTRY: string;
  NOTIFICATIONS: string;
  CLIENT: string;
  PARTNER: string;
  USERS: string;
  SERVICES: string;
};

type Routes = {
  public: PublicRoutes;
  private: PrivateRoutes;
};

const PRIVATE_BASE = "/app";

export const constantRoutes: Routes = {
  public: {
    LOGIN: "/login",
    FORGET_PASSWORD: "/forget-password",
    RESET_PASSWORD: (token?: string) =>
      token ? `/reset-password/${token}` : "/reset-password/:token",
    TWO_FACTOR_AUTHENTICATION: (tempToken?: string) =>
      tempToken ? `/two-factor-authentication/${tempToken}` : "/two-factor-authentication/:tempToken",
    VERIFY_F2A_EMAIL: "/verify-2fa-email/:tempToken",
  },

  private: {
    BASE: PRIVATE_BASE,
    USERS: `${PRIVATE_BASE}/users`,
    DASHBOARD: "/app/dashboard",
    QUOTES: `${PRIVATE_BASE}/quotes`,
    NEW_QUOTE: `${PRIVATE_BASE}/quote/new`,
    EDIT_QUOTE: (id?: VersionQuotationEntity["id"]) =>
      id
        ? `${PRIVATE_BASE}/quote/${id.quotationId}/${id.versionNumber}`
        : "/quote/:quoteId/:version",
    RESERVATIONS: `${PRIVATE_BASE}/reservations`,
    PROFILE: `${PRIVATE_BASE}/profile`,
    HOTEL: `${PRIVATE_BASE}/hotel`,
    COUNTRY: `${PRIVATE_BASE}/country`,
    CLIENT: `${PRIVATE_BASE}/client`,
    PARTNER: `${PRIVATE_BASE}/partner`,
    SERVICES: `${PRIVATE_BASE}/services`,
    NOTIFICATIONS: `${PRIVATE_BASE}/notifications`,
  },
};
