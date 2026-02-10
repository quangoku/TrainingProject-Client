export const getNotification = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/notifications`,
      {
        credentials: "include",
      },
    );
    const result = await response.json();
    console.log(result);
    return result.data;
  } catch (error) {
    console.log(error);
  }
};

export const markAsRead = async (notificationId: string) => {
  try {
    console.log(notificationId);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/notifications/${notificationId}/read`,
      {
        method: "PATCH",
        credentials: "include",
      },
    );
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.log(error);
  }
};
