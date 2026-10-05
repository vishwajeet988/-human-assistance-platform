import { AppError } from "../errors.js";

export interface DocumentStorage {
  putPrivate(providerId: string, documentType: string, content: Uint8Array): Promise<{ storageRef: string }>;
  createPrivateDownloadUrl(storageRef: string, expiresInSeconds: number): Promise<string>;
}

export class DevelopmentDocumentStorage implements DocumentStorage {
  async putPrivate(providerId: string, documentType: string, _content: Uint8Array) { return { storageRef: `private://development/${providerId}/${documentType}/${Date.now()}` }; }
  async createPrivateDownloadUrl(storageRef: string, _expiresInSeconds: number) { if (!storageRef.startsWith("private://")) throw new AppError("INVALID_STORAGE_REF", "Only private document references are supported.", 400); return `development-private-url:${storageRef}`; }
}

export const documentStorage: DocumentStorage = new DevelopmentDocumentStorage();
