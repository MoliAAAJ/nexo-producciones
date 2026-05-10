import QRCode from "qrcode";

export const generarQR = async (ticketId) => {

  const data = JSON.stringify({
    ticketId
  });

  const qr = await QRCode.toDataURL(data);

  return qr;

};
