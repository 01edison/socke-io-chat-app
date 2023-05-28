import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import { useSelector } from "react-redux";
import { isLastMessage, isSameSender } from "../../config/chat";
import { Avatar, Tooltip } from "@chakra-ui/react";
import { Url } from "../../constants";

const ScrollableChat = ({ messages }) => {
  const {
    user: { user, token },
    currentChat,
  } = useSelector((state) => state.user);

  return (
    <ScrollableFeed>
      {messages?.map((message, i) => {
        return (
          <div
            style={{
              display: "flex",
              flexDirection: `${
                message.sender._id == user._id ? "row-reverse" : "row"
              }`,
            }}
            key={i}
          >
            {message?.sender.name !== user.name && (
              <Tooltip
                label={message?.sender.name}
                placement="bottom-start"
                hasArrow
              >
                <Avatar
                  src={`${Url}/api/user/image/${message?.sender?._id}`}
                  name={message?.sender.name}
                  mr={1}
                  mt={"7px"}
                  cursor="pointer"
                />
              </Tooltip>
            )}

            <span
              style={{
                backgroundColor: `${
                  message.sender._id == user._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
                marginBottom: "10px",
              }}
            >
              {message.content}
            </span>
          </div>
        );
      })}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
