import crypto from "crypto";
import QRCode from "qrcode";

export const generarQR = async () => {

  const codigo = crypto
    .randomBytes(16)
    .toString("hex");

  const qr = await QRCode.toDataURL(codigo);

  return qr;

};
