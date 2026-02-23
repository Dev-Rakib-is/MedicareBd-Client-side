const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

/*
=====================================================
 PRESCRIPTION PDF GENERATOR (BANGLADESH STYLE)
=====================================================
*/
exports.generatePrescriptionPDF = async (prescription) => {
  return new Promise((resolve, reject) => {
    try {
      const pdfDir = path.join(__dirname, "../uploads/prescriptions");

      if (!fs.existsSync(pdfDir)) {
        fs.mkdirSync(pdfDir, { recursive: true });
      }

      const fileName = `prescription_${prescription._id}.pdf`;
      const filePath = path.join(pdfDir, fileName);

      const doc = new PDFDocument({
        size: "A4",
        margin: 40,
      });

      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      /*
      =============================
      HEADER
      =============================
      */

      doc.fontSize(24).fillColor("#15803d").text("Medical Prescription", {
        align: "center",
      });

      doc.moveDown();

      doc
        .fontSize(12)
        .fillColor("#000")
        .text(`Doctor: Dr. ${prescription?.doctorId?.name || ""}`);

      doc.text(`Department: ${prescription?.doctorId?.department || ""}`);

      doc.text(
        `Patient: ${prescription?.patientId?.name || ""} | Date: ${new Date(
          prescription.createdAt,
        ).toLocaleDateString("en-GB")}`,
      );

      doc.moveDown();

      /*
      =============================
      DIAGNOSIS SECTION
      =============================
      */

      doc.fontSize(16).fillColor("red").text("C / C", { underline: true });

      doc
        .fontSize(11)
        .fillColor("#333")
        .text(prescription?.layout?.cc || "No complaint recorded");

      doc.moveDown();

      doc.fontSize(16).fillColor("blue").text("O / E", { underline: true });

      doc.fontSize(11).text(prescription?.layout?.oe || "No examination note");

      doc.moveDown();

      /*
      =============================
      RX MEDICINE LIST
      =============================
      */

      doc.fontSize(18).fillColor("red").text("RX", { underline: true });

      doc.moveDown(0.5);

      prescription?.medications?.forEach((med, index) => {
        doc
          .fontSize(11)
          .fillColor("#000")
          .text(`${index + 1}. ${med.name} - ${med.dose} - ${med.frequency}`);
      });

      doc.moveDown();

      /*
      =============================
      ADVICE
      =============================
      */

      doc.fontSize(14).fillColor("blue").text("Advice", { underline: true });

      doc
        .fontSize(11)
        .fillColor("#333")
        .text(
          prescription?.layout?.advice ||
            prescription?.notes ||
            "No advice given",
        );

      /*
      =============================
      SIGNATURE
      =============================
      */

      if (prescription?.signature) {
        doc.moveDown(3);

        doc.text("Doctor Signature", { align: "right" });

        try {
          doc.image(prescription.signature, {
            fit: [150, 80],
            align: "right",
          });
        } catch (err) {
          console.log("Signature load error");
        }
      }

      doc.end();

      stream.on("finish", () => {
        resolve(filePath);
      });
    } catch (error) {
      reject(error);
    }
  });
};
