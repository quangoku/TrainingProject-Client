import { Post } from "@/types/api/Post";

export const getPosts = async (cursor: string = "") => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/posts?cursor=${cursor}`,
  );
  const result = await response.json();
  return result.data;
};
export const getSavedPosts = async (): Promise<Post[]> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/posts/saved`,
    {
      credentials: "include",
    },
  );
  const result = await response.json();
  return result.data;
};

export const getPostById = async (id: number): Promise<Post> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`,
  );
  const result = await response.json();
  return result.data;
};

export const getPostByUserId = async (userId: number): Promise<Post[]> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/posts/users/${userId}`,
  );
  const result = await response.json();
  return result.data;
};

export const getRepliesByPostId = async (id: number): Promise<Post[]> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/posts/${id}/replies`,
  );
  const result = await response.json();
  return result.data;
};

export const toggleLike = async (postId: number) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}/like`,
    {
      method: "POST",
      credentials: "include",
    },
  );
  const result = await response.json();
  return result.data;
};

export const toggleSave = async (postId: number) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}/save`,
    {
      method: "POST",
      credentials: "include",
    },
  );
  const result = await response.json();
  return result.data;
};

export const getLikeStatus = async (postId: number) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}/is-like`,
    {
      method: "GET",
      credentials: "include",
    },
  );
  const result = await response.json();
  return result.data;
};
export const getSavedStatus = async (postId: number) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}/is-saved`,
    {
      method: "GET",
      credentials: "include",
    },
  );
  const result = await response.json();
  return result.data;
};
