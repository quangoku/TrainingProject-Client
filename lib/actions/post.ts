export const getPosts = async (cursor: string = "") => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/posts?cursor=${cursor}`
  );
  const result = await response.json();
  return result.data;
};

export const getPostById = async (id: number) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`
  );
  const result = await response.json();
  return result.data;
};

export const getPostByUserId = async (userId: number) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/posts/users/${userId}`
  );
  const result = await response.json();
  return result.data;
};

export const getRepliesByPostId = async (id: number) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/posts/${id}/replies`
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
    }
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
    }
  );
  const result = await response.json();
  return result.data;
};
