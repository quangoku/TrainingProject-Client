import { User } from "./user";

export interface Post {
  id: number;
  content: string;
  author: User;
  likes_count: number;
  replies_count: number;
  time?: string;
  media?: Media[];
}
export interface Media {
  id: number;
  url: string;
  type: string;
}
