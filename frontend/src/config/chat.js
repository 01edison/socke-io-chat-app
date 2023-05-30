export const getSender = (loggedUser, users, id = false) => {
  const sender = users?.find((user) => user._id !== loggedUser._id);

  return id ? sender?._id : sender?.name;
};

export const getSenderFull = (loggedUser, users) => {
  return users?.find((user) => user._id !== loggedUser._id);
};

export const isSameSender = (messages, m, i, userId) => {
  return (
    i < messages.length &&
    (messages[i + 1]?.sender._id !== m.sender._id ||
      messages[i + 1]?.sender._id === undefined) &&
    messages[i]?.sender._id !== userId
  );
};

export const isLastMessage = (messages, i, userId) => {
  return (
    i == messages?.length - 1 &&
    messages[messages?.length - 1]?.sender._id !== userId &&
    messages[messages?.length - 1]?.sender._id
  );
};
