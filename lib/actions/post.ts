export const getPost = async (cursor: string = "") => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/posts?cursor=${cursor}`
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
