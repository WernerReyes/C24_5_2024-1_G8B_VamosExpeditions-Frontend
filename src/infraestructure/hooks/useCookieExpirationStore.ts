import { AppState } from "@/app/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { onSetCookieExpiration, onSetExpired } from "../store";

export const useCookieExpirationStore = () => {
  const dispatch = useDispatch();
  const { expiration, isExpired } = useSelector((state: AppState) => state.cookieExpiration);


  useEffect(() => {
    if (!expiration.length) return;

    const timeLeft = new Date(expiration).getTime() - Date.now();
    console.log(timeLeft / 1000);
    if (timeLeft <= 0) {
      dispatch(onSetExpired(true));
      console.log(timeLeft / 1000);
    } else {
      console.log(timeLeft / 1000);
      // Set a timer to alert when the cookie expires
      const timer = setTimeout(() => {
        dispatch(onSetExpired(true));
        console.log(timeLeft / 1000);
      }, timeLeft);

      return () => clearTimeout(timer); // Cleanup timer on unmount
    }
  }, [expiration, dispatch]);

  const init = (expirationTime: string) => {
    dispatch(onSetCookieExpiration(expirationTime));
  };

  return { 
     //* Atributtes
     expiration,
      isExpired,
     
     //* Functions
     init,
   };
};
