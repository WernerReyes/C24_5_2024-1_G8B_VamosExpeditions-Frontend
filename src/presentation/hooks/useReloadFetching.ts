import { useEffect, useState } from "react";

export const useReloadFetching = (startFetching: () => Promise<void>) => {
  const [reload, setReload] = useState(false);
  useEffect(() => {
    if (!reload) return;
    startFetching()
      .then(() => {
        setReload(false);
      })
      .catch(() => {
        setReload(false);
      });
  }, [reload]);

    return { reload, setReload };
};
