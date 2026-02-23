import { useEffect, useState } from "react";
import api from "../api/api";

const usePrescriptionLock = (prescriptionId) => {
  const [loading, setLoading] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [prescription, setPrescription] = useState(null);

  /* Fetch Prescription Status */
  const fetchPrescription = async () => {
    if (!prescriptionId) return;

    try {
      setLoading(true);

      const res = await api.get(`/prescriptions/single/${prescriptionId}`);

      const data = res.data.data;

      setPrescription(data);
      setIsLocked(data?.isFinalized || false);
    } catch (err) {
      console.error("Lock fetch failed");
    } finally {
      setLoading(false);
    }
  };

  /* Initialize */
  useEffect(() => {
    fetchPrescription();
  }, [prescriptionId]);

  /* Finalize Prescription */
  const finalizePrescription = async () => {
    try {
      setLoading(true);

      await api.post(`/prescriptions/finalize/${prescriptionId}`);

      setIsLocked(true);
      await fetchPrescription();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to finalize prescription");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    isLocked,
    prescription,
    finalizePrescription,
    refresh: fetchPrescription,
  };
};

export default usePrescriptionLock;
