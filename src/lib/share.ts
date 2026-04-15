import pako from "pako";
import type { ContractData } from "../types/contract";

const URL_PARAM = "d";
const URL_SIZE_LIMIT = 8000;

function toBase64Url(data: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < data.length; i++) {
    binary += String.fromCharCode(data[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function fromBase64Url(str: string): Uint8Array {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export function encodeToUrl(data: ContractData): string {
  const json = JSON.stringify(data);
  const compressed = pako.deflate(json);
  const encoded = toBase64Url(compressed);
  const url = new URL(window.location.href);
  url.hash = "";
  url.search = `?${URL_PARAM}=${encoded}`;
  return url.toString();
}

export function decodeFromUrl(): ContractData | null {
  try {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get(URL_PARAM);
    if (!encoded) return null;
    const bytes = fromBase64Url(encoded);
    const json = pako.inflate(bytes, { to: "string" });
    const data = JSON.parse(json) as ContractData;
    if (data.version !== 1) return null;
    return data;
  } catch {
    return null;
  }
}

export function getEncodedSize(data: ContractData): number {
  const json = JSON.stringify(data);
  const compressed = pako.deflate(json);
  return toBase64Url(compressed).length;
}

export function isUrlTooLong(data: ContractData): boolean {
  return getEncodedSize(data) > URL_SIZE_LIMIT;
}
