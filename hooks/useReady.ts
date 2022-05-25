import { useEffect, useState } from "react";

export const useReady = (): boolean => {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true));
  return ready;
};
