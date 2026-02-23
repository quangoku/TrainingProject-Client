export const getUserById = async (id: number) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_INTERNAL_API_URL}/users/${id}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  const result = await response.json();
  return result.data;
};
export const getCurrentUser = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
    credentials: "include",
  });
  const result = await response.json();
  return result.data;
};
