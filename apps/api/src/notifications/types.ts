export type NotificationChannel = "IN_APP" | "EMAIL" | "SMS" | "WHATSAPP" | "PUSH";
export type Notification = { id: string; recipientId: string; eventKey: string; channel: NotificationChannel; title: string; body: string; status: "PENDING" | "SENT" | "FAILED" | "READ"; createdAt: string; sentAt?: string };
export interface NotificationAdapter { send(notification: Notification): Promise<void>; }
