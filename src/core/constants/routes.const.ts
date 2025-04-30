import type { VersionQuotationEntity } from "@/domain/entities";

type PublicRoutes = {
  LOGIN: string;
  FORGET_PASSWORD: string;
  RESET_PASSWORD: (token?: string) => string;
};

type PrivateRoutes = {
  BASE: string;
  DASHBOARD: string;
  QUOTES: string;
  NEW_QUOTE: string;
  EDIT_QUOTE: (id?: VersionQuotationEntity["id"]) => string;
  VIEW_QUOTE: (id?: VersionQuotationEntity["id"]) => string;
  RESERVATIONS: string;
  PROFILE: string;
  HOTEL: string;
  COUNTRY: string;
  NOTIFICATIONS: string;
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
  },

  private: {
    BASE: PRIVATE_BASE,
    DASHBOARD: "/app/dashboard",
    QUOTES: `${PRIVATE_BASE}/quotes`,
    NEW_QUOTE: `${PRIVATE_BASE}/quote/new`,
    EDIT_QUOTE: (id?: VersionQuotationEntity["id"]) =>
      id
        ? `${PRIVATE_BASE}/quote/${id.quotationId}/${id.versionNumber}`
        : "/quote/:quoteId/:version",
    VIEW_QUOTE: (id?: VersionQuotationEntity["id"]) =>
      id
        ? `${PRIVATE_BASE}/quote/${id.quotationId}/${id.versionNumber}/view`
        : "/quote/:quoteId/:version/view",
    RESERVATIONS: `${PRIVATE_BASE}/reservations`,
    PROFILE: `${PRIVATE_BASE}/profile`,
    HOTEL: `${PRIVATE_BASE}/hotel`,
    COUNTRY: `${PRIVATE_BASE}/country`,
    NOTIFICATIONS: `${PRIVATE_BASE}/notifications`,
  },
};
