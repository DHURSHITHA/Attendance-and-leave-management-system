import { useEffect, useState } from "react";

export default function useAsyncData(loader, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    loader()
      .then((res) => {
        if (active) setData(res);
      })
      .catch((err) => {
        if (active) setError(err.message || "Failed to load data");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, deps);

  return { data, loading, error, setData };
}
