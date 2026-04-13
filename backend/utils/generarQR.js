import crypto from "crypto";

export const generarQR = () => {
  return crypto.randomBytes(16).toString("hex");
};
