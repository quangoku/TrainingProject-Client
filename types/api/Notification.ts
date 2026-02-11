export interface Notification {
  _id: string;
  content: string;
  createdAt: Date;
  isRead: boolean;
  senderId: number;
  postId: number;
}
