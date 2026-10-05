import { randomUUID } from "node:crypto";
import type { Notification, NotificationAdapter, NotificationChannel } from "./types.js";
import { AppError } from "../errors.js";
class DevelopmentAdapter implements NotificationAdapter { async send(_notification: Notification) { return; } }
export class NotificationService { private records: Notification[] = []; private adapter = new DevelopmentAdapter(); emit(recipientId: string, eventKey: string, title: string, body: string, channels: NotificationChannel[] = ["IN_APP"]) { const created: Notification[] = []; for (const channel of channels) { if (this.records.some((item) => item.recipientId === recipientId && item.eventKey === eventKey && item.channel === channel)) continue; const item: Notification = { id: randomUUID(), recipientId, eventKey, channel, title, body, status: "PENDING", createdAt: new Date().toISOString() }; this.records.push(item); void this.adapter.send(item).then(() => { item.status = "SENT"; item.sentAt = new Date().toISOString(); }); created.push(item); } return created; }
  list(recipientId: string) { return this.records.filter((item) => item.recipientId === recipientId).map((item) => ({ ...item })); }
  markRead(recipientId: string, id: string) { const item = this.records.find((candidate) => candidate.id === id && candidate.recipientId === recipientId); if (!item) throw new AppError("NOT_FOUND", "Notification not found.", 404); item.status = "READ"; return { ...item }; }
}
export const notificationService = new NotificationService();
