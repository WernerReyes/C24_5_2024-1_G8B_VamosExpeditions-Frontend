import { AppState } from "@/app/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { onSetCookieExpiration, onSetExpired } from "../store";

const sessionChannel = new BroadcastChannel("session");


export const useCookieExpirationStore = () => {
  const dispatch = useDispatch();
  const { expiration, isExpired } = useSelector((state: AppState) => state.cookieExpiration);

  useEffect(() => {
    if (!expiration) return;
  
    const timeLeft = new Date(expiration).getTime() - Date.now();
    if (timeLeft <= 0) {
      dispatch(onSetExpired(true));
      sessionChannel.postMessage("expired"); // Notify all windows
    } else {
      const timer = setTimeout(() => {
        dispatch(onSetExpired(true));
        sessionChannel.postMessage("expired"); // Notify all windows
      }, timeLeft);
  
      return () => clearTimeout(timer);
    }
  }, [expiration, dispatch]);
  

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data === "expired") {
        dispatch(onSetExpired(true)); // Open modal in all windows
      } else if (event.data === "relogged") {
        dispatch(onSetExpired(false)); // Close modal in all windows
      }
    };
  
    sessionChannel.addEventListener("message", handleMessage);
    return () => sessionChannel.removeEventListener("message", handleMessage);
  }, [dispatch]);
  

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
