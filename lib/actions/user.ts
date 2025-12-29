export const getUserById = async (id: number) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`
  );
  const result = await response.json();
  return result.data;
};
export const getCurrentUser = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
    method: "GET",
    credentials: "include",
  });
  const result = await response.json();
  return result;
};
