import { useState, useEffect } from "react";
import api from "../api/api";

export const useNotices = (initialRole) => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterVisible, setFilterVisible] = useState("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  const fetchNotices = async (opts = {}) => {
    try {
      setLoading(true);
      setError("");
      const q = new URLSearchParams({
        search: opts.search ?? search,
        visibleTo: opts.visibleTo ?? (filterVisible !== "all" ? filterVisible : ""),
        page: opts.page ?? page,
        limit,
      }).toString();
      const res = await api.get(`/notices?${q}`);
      setNotices(res.data.notices || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load notices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotices({ page: 1 }); }, [filterVisible]);

  useEffect(() => {
    const t = setTimeout(() => fetchNotices({ search, page: 1 }), 400);
    return () => clearTimeout(t);
  }, [search]);

  return {
    notices,
    loading,
    error,
    search, setSearch,
    filterVisible, setFilterVisible,
    page, setPage,
    limit, total,
    fetchNotices,
    setNotices
  };
};
