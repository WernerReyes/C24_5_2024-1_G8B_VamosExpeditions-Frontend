type PublicRoutes = {
  LOGIN: string;
};

type PrivateRoutes = {
  BASE: string
  DASHBOARD: string;
  QUOTES: string;
  NEW_QUOTE: string;
  EDIT_QUOTE: string;
  RESERVATIONS: string;
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
    EDIT_QUOTE: `${PRIVATE_BASE}/quote/edit`,
    RESERVATIONS: `${PRIVATE_BASE}/reservations`,
  },
};
