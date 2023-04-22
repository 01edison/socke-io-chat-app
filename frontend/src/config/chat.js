export const getSender = (loggedUser, users) => {
  const sender = users?.find((user) => user._id !== loggedUser._id);

  return sender?.name;
};

export const getSenderFull = (loggedUser, users) => {
  return users?.find((user) => user._id !== loggedUser._id);
};
