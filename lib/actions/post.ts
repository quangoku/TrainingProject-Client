export const getPost = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {});
  const result = await response.json();
  return result.data;
};
