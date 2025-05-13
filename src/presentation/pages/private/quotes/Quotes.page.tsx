import { useGetUsersQuery } from "@/infraestructure/store/services";
import { NewQuotationDialog } from "../components";
import { QuotesTable } from "./components";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setLoadingUsers,
  setUsersPagination,
} from "@/infraestructure/store";
import type { AppState } from "@/app/store";

const QuotesPage = () => {
  const dispatch = useDispatch();
  const { newLimit } = useSelector((state: AppState) => state.users);
  const {
    data: usersData,
    isFetching,
    isLoading,
  } = useGetUsersQuery({
    page: 1,
    limit: newLimit,
    showDevices: false,
    select: {
      id_user: true,
      fullname: true,
      email: true,
    },
  });

  useEffect(() => {
    dispatch(setLoadingUsers(isLoading || isFetching));
  }, [isLoading, isFetching]);


  useEffect(() => {
    if (!usersData?.data) return;
    dispatch(setUsersPagination(usersData?.data));
  }, [usersData]);

  return (
    <div className="bg-white p-10 rounded-lg shadow-md overflow-x-hidden">
      <div className="flex justify-end flex-wrap gap-y-5 space-x-4">
        <NewQuotationDialog />
      </div>

      <QuotesTable />
    </div>
  );
};

export default QuotesPage;
