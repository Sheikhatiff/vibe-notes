import crypto from "node:crypto";

const ALGORITHM = "aes-256-cbc";
const ENC_PREFIX = "ENC:";

const rawKey = process.env.KEY || "";
const rawIv = process.env.IV || "";

const key = crypto.createHash("sha256").update(rawKey, "utf8").digest();
const iv = crypto
  .createHash("sha256")
  .update(rawIv, "utf8")
  .digest()
  .slice(0, 16);

export const encrypt = (text) => {
  if (typeof text !== "string") text = String(text);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return ENC_PREFIX + encrypted;
};

export const decrypt = (encryptedText) => {
  if (!encryptedText || typeof encryptedText !== "string") {
    throw new Error("decrypt: invalid input");
  }

  if (!encryptedText.startsWith(ENC_PREFIX)) {
    throw new Error("decrypt: data is not encrypted (missing ENC: prefix)");
  }

  const hex = encryptedText.slice(ENC_PREFIX.length);

  if (!/^[0-9a-fA-F]+$/.test(hex) || hex.length % 2 !== 0) {
    throw new Error("decrypt: ciphertext is not valid hex");
  }

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  let decrypted = decipher.update(hex, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

export const isEncrypted = (text) => {
  return typeof text === "string" && text.startsWith(ENC_PREFIX);
};
