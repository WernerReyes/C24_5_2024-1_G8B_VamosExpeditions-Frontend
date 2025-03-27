import type { VersionQuotationEntity } from "@/domain/entities";

type PublicRoutes = {
  LOGIN: string;
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
};

type Routes = {
  public: PublicRoutes;
  private: PrivateRoutes;
};

const PRIVATE_BASE = "/app";

export const constantRoutes: Routes = {
  public: {
    LOGIN: "/login",
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
  },
};
