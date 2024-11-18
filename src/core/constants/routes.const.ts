type PublicRoutes = {
  LOGIN: string;
  //     REGISTER: string;
  //     FORGOT_PASSWORD: string;
  //     RESET_PASSWORD: string;
  //     VERIFY_EMAIL: string;
  //     DASHBOARD: string;
  //     PROFILE: string;
  //     SETTINGS: string;
  //     NOT_FOUND: string;
};

type PrivateRoutes = {
  DASHBOARD: string;
  QUOTES: string;
  NEW_QUOTE: string;

  //     HOME: string;
  //     LOGIN: string;
  //     REGISTER: string;
  //     FORGOT_PASSWORD: string;
  //     RESET_PASSWORD: string;
  //     VERIFY_EMAIL: string;
  //     NOT_FOUND: string;
};

type Routes = {
  public: PublicRoutes;
  private: PrivateRoutes;
};

export const constantRoutes: Routes = {
  public: {
    LOGIN: "/login",
    //     REGISTER: PublicRoutes.REGISTER,
    //     FORGOT_PASSWORD: PublicRoutes.FORGOT_PASSWORD,
    //     RESET_PASSWORD: PublicRoutes.RESET_PASSWORD,
    //     VERIFY_EMAIL: PublicRoutes.VERIFY_EMAIL,
    //     DASHBOARD: PublicRoutes.DASHBOARD,
    //     PROFILE: PublicRoutes.PROFILE,
    //     SETTINGS: PublicRoutes.SETTINGS,
    //     NOT_FOUND: PublicRoutes.NOT_FOUND,
  },

  private: {
    DASHBOARD: "/dashboard",
    QUOTES: "/quotes",
    NEW_QUOTE: "/new-quote",
  },
  //     HOME: PublicRoutes.HOME,
  //     LOGIN: PublicRoutes.LOGIN,
  //     REGISTER: PublicRoutes.REGISTER,
  //     FORGOT_PASSWORD: PublicRoutes.FORGOT_PASSWORD,
  //     RESET_PASSWORD: PublicRoutes.RESET_PASSWORD,
  //     VERIFY_EMAIL: PublicRoutes.VERIFY_EMAIL,
  //     NOT_FOUND: PublicRoutes.NOT_FOUND,
};
