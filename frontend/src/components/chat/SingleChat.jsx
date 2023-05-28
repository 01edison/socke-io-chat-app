import { Box, Text, IconButton, Spinner, useToast } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { userActions } from "../../store/user-slice";
import { getSender, getSenderFull } from "../../config/chat";
import ProfileModal from "../user/ProfileModal";
import UpdateGroupModal from "../group/UpdateGroupModal";
import axios from "axios";
import "./style.css";
import ScrollableChat from "./ScrollableChat";
import { Url } from "../../constants";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const {
    user: { user, token },
    currentChat,
    socket,
  } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const toast = useToast();

  const fetchMessages = async () => {
    if (currentChat) {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${Url}/api/messages/${currentChat?._id}`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        setMessages(data);
        setLoading(false);
        // socket?.emit("join chat", currentChat._id);
      } catch (error) {
        console.log(error);
        toast({
          title: "Error Occured",
          description: "Failed to load your message",
          status: "error",
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (newMessage) {
      // setLoading(true);
      try {
        socket.emit("send-message", {newMessage, chatId: currentChat._id});
        return;
        const body = {
          chatId: currentChat._id,
          content: newMessage,
        };
        const { data } = await axios.post(`${Url}/api/messages`, body, {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        });

        console.log(data);

        setNewMessage("");
        setMessages([...messages, data]);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
        toast({
          title: "Error Occured",
          description: "Failed to send the message",
          status: "error",
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    //typing indicator logic
  };

  useEffect(() => {
    fetchMessages();
  }, [currentChat]);

  useEffect(() => {
    console.log("socket do something");
    console.log(socket);
    console.log(currentChat);

    if (currentChat) {
      socket?.emit("join-room", currentChat);
    }
  }, [currentChat]);

  useEffect(() => {
    socket.on("message-from-server", (data) => {
      console.log(data);
    });
  }, [socket]);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {currentChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            width="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              icon={<ArrowBackIcon />}
              display={{ base: "flex", md: "none" }}
              onClick={() => dispatch(userActions.setCurrentChat(""))}
            />

            {!currentChat.isGroupChat ? (
              <>
                {getSender(user, currentChat.users)}
                <ProfileModal user={getSenderFull(user, currentChat.users)} />
              </>
            ) : (
              <>
                {currentChat.chatName.toUpperCase()}
                <UpdateGroupModal
                  currentChat={currentChat}
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            width="100%"
            height="90%"
            borderRadius="lg"
            overflowY=""
          >
            {loading ? (
              <Spinner
                size={"xl"}
                w={20}
                h={20}
                margin={"auto"}
                alignSelf={"center"}
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}

            <form onSubmit={sendMessage} style={{ marginTop: "1rem" }}>
              <input
                placeholder="Enter a message..."
                style={{
                  backgroundColor: "#e0e0e0",
                  width: "100%",
                  height: "2rem",
                }}
                onChange={typingHandler}
                value={newMessage}
              />
            </form>
          </Box>
        </>
      ) : (
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          h={"100%"}
        >
          <Text fontSize={"3xl"} pb={3} fontFamily={"Work sans"}>
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </div>
  );
};

export default SingleChat;
