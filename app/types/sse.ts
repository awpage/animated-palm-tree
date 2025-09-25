export interface ServerMessage {
  type: 'welcome' | 'connected' | 'message' | 'ping';
  recipientId: string | null
  senderId: string | null
  content: string
  id: string
  createdAt: string
}

export interface UserNotification {
  title: string
  body: string
  callback: any
}