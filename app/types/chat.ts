export interface User {
  id: string;
  username?: string;
}

export interface Message {
  senderId: string;
  partnerId: string;
  content: string;
  timestamp: number;
}
