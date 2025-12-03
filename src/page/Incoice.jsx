// src/components/invoice/Invoice.jsx
import  { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { motion } from 'framer-motion';


const Invoice = ({ invoiceId }) => {
  const [invoice, setInvoice] = useState(null);
  const [loading,setLoading]= useState("")

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const { data } = await axios.get(`/invoices/${invoiceId}`);
        setInvoice(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchInvoice();
  }, [invoiceId]);

  const handleDownloadPDF = () => {
    if (!invoice) return;
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Medicare BD Invoice", 14, 20);
    doc.setFontSize(12);
    doc.text(`Invoice #: ${invoice._id ?? "N/A"}`, 14, 30);
    doc.text(
      `Date: ${invoice.createdAt ? new Date(invoice.createdAt).toLocaleDateString() : "N/A"}`,
      14,
      36
    );

    doc.text(`Patient: ${invoice.patient?.name ?? "N/A"}`, 14, 46);
    doc.text(`Doctor: ${invoice.doctor?.name ?? "N/A"}`, 14, 52);

    const tableColumn = ["Item", "Qty", "Price", "Total"];
    const tableRows =
      invoice.items?.map((item) => [
        item.name ?? "N/A",
        item.quantity ?? 0,
        (item.price ?? 0).toFixed(2),
        ((item.price ?? 0) * (item.quantity ?? 0)).toFixed(2),
      ]) || [];

    doc.autoTable({
      startY: 60,
      head: [tableColumn],
      body: tableRows,
    });

    const finalY = doc.lastAutoTable?.finalY || 60;
    doc.text(`Subtotal: ${(invoice.subTotal ?? 0).toFixed(2)}`, 14, finalY + 10);
    doc.text(`Tax: ${(invoice.tax ?? 0).toFixed(2)}`, 14, finalY + 16);
    doc.text(`Discount: ${(invoice.discount ?? 0).toFixed(2)}`, 14, finalY + 22);
    doc.text(`Total: ${(invoice.total ?? 0).toFixed(2)}`, 14, finalY + 28);
    doc.text(`Status: ${invoice.status ?? "N/A"}`, 14, finalY + 34);

    doc.save(`Invoice_${invoice._id ?? "N/A"}.pdf`);
  };

  if (!invoice) return <p>Loading invoice...</p>;

  return (
    <div className="p-4 bg-white rounded shadow-md max-w-3xl mx-auto mt-16">
      <h2 className="text-2xl font-bold mb-4">Invoice</h2>
      <div className="mb-4">
        <p><strong>Invoice :</strong> {invoice._id ?? "N/A"}</p>
        <p><strong>Date:</strong> {invoice.createdAt ? new Date(invoice.createdAt).toLocaleDateString() : "N/A"}</p>
        <p><strong>Patient:</strong> {invoice.patient?.name ?? "N/A"}</p>
        <p><strong>Doctor:</strong> {invoice.doctor?.name ?? "N/A"}</p>
      </div>

      <table className="w-full table-auto border-collapse border border-gray-300 mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-2 py-1">Item</th>
            <th className="border border-gray-300 px-2 py-1">Qty</th>
            <th className="border border-gray-300 px-2 py-1">Price</th>
            <th className="border border-gray-300 px-2 py-1">Total</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items?.map((item) => (
            <tr key={item._id}>
              <td className="border border-gray-300 px-2 py-1">{item.name ?? "N/A"}</td>
              <td className="border border-gray-300 px-2 py-1">{item.quantity ?? 0}</td>
              <td className="border border-gray-300 px-2 py-1">{(item.price ?? 0).toFixed(2)}</td>
              <td className="border border-gray-300 px-2 py-1">{((item.price ?? 0) * (item.quantity ?? 0)).toFixed(2)}</td>
            </tr>
          )) || (
            <tr>
              <td colSpan={4} className="text-center py-2">No items found</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="text-right mb-4">
        <p><strong>Subtotal:</strong> {(invoice.subTotal ?? 0).toFixed(2)}</p>
        <p><strong>Tax:</strong> {(invoice.tax ?? 0 ).toFixed(2)}</p>
        <p><strong>Discount:</strong> {(invoice.discount ?? 0).toFixed(2)}</p>
        <p className="text-lg font-bold"><strong>Total:</strong> {(invoice.total ?? 0).toFixed(2)}</p>
        <p><strong>Status:</strong> {invoice.status ?? "N/A"}</p>
      </div>

      <motion.button
      disabled={loading}
        whileTap={{scale:0.95}}
        onClick={handleDownloadPDF}
        className={`px-4 py-2  text-white rounded  ${loading? "bg-green-300 cursor-not-allowed" :"bg-green-600 hover:bg-green-700 cursor-pointer"}`}
      >
        Download PDF
      </motion.button>
    </div>
  );
};

export default Invoice;
