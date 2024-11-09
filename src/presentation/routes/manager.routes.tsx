// import { lazy } from "react";
// import { Navigate, Route } from "react-router-dom";
// import { RouterWithNotFound } from "./RouterWithNotFound";
// import { PrivateRoutes } from "../routes";
// import { removeBaseRoute } from "../utilities";

// const HomePage = lazy(() => import("../pages/private/admin/Home/Home.page"));

// const AddDishPage = lazy(
//   () => import("../pages/private/admin/AddDish/AddDish.page"),
// );

// const EditDishPage = lazy(
//   () => import("../pages/private/admin/EditDish/EditDish.page"),
// );

// const ListDishesPage = lazy(
//   () => import("../pages/private/admin/ListDishes/ListDishes.page"),
// );

// const OfferDishPage = lazy(
//   () => import("../pages/private/admin/OfferDish/OfferDish.page"),
// );

// const DishCategoryPage = lazy(
//   () => import("../pages/private/admin/Category/DishCategory.page"),
// );

// //* Common pages
// const ProfilePage = lazy(
//   () => import("../pages/private/common/Profile/Profile.page"),
// );

// const DetailDishPage = lazy(
//   () => import("../pages/private/common/DetailDish/DetailDish.page"),
// );

// const {
//   ADMIN,
//   common: { PROFILE, LIST_DISHES, DETAIL_DISH, HOME },
//   admin: { EDIT_DISH, ...rest },
// } = PrivateRoutes;

// const { ADD_DISH, OFFER_DISH, CATEGORY } = removeBaseRoute(rest, ADMIN + "/");

// const AdminRouter = () => {
//   return (
//     <RouterWithNotFound>
//       <Route path="/" element={<Navigate to={HOME()} />} />
//       <Route path={HOME()} element={<HomePage />} />
//       <Route path={ADD_DISH} element={<AddDishPage />} />
//       <Route path={PROFILE()} element={<ProfilePage />} />
//       <Route path={EDIT_DISH()} element={<EditDishPage />} />
//       <Route path={LIST_DISHES()} element={<ListDishesPage />} />
//       <Route path={DETAIL_DISH()} element={<DetailDishPage />} />
//       <Route path={OFFER_DISH} element={<OfferDishPage />} />
//       <Route path={CATEGORY} element={<DishCategoryPage />} />
//     </RouterWithNotFound>
//   );
// };

// export default AdminRouter;
