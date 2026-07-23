import { useState, useEffect } from 'react';
import apiClient from '../services/axios.js';

export const useAxios = (config) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!config) return;
    apiClient(config)
      .then((res) => setData(res.data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [JSON.stringify(config)]);

  return { data, loading, error };
};
