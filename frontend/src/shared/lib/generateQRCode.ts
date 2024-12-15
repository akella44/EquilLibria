import QRCode from "qrcode";

export const generateQRCode = (text) => {
  const canvas = document.getElementById("qrCanvas");
  QRCode.toCanvas(
    canvas,
    text,
    { errorCorrectionLevel: "H" },
    function (error) {
      if (error) console.error(error);
      console.log("QR код сгенерирован!");
    }
  );
};
