import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { userActions } from "../../store/user-slice";
import axios from "axios";
import { Url } from "../../constants";
import { Box, Button, Stack } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { getSender } from "../../config/chat";
import GroupChatModal from "../group/GroupChatModal";

const MyChats = ({ setFetchAgain, fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState("");
  const [typingUser, setTypingUser] = useState({});
  const {
    user: { user, token },
    currentChat,
    chats,
    socket,
  } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const fetchChats = async () => {
    try {
      const { data } = await axios.get(`${Url}/api/chat`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      dispatch(userActions.setChats(data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setLoggedUser(user);
    fetchChats();
    socket.emit("join-user-room", { userId: user._id });
  }, [fetchAgain]);

  useEffect(() => {
    if (socket) {
      socket.on("start-typing-server", ({ userName, userId }) => {
        console.log(userName + " is typing...");
      });
    }
  }, [socket]);
  return (
    <Box
      display={{ base: currentChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal setFetchAgain={setFetchAgain}>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>

      <Box
        d="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY={"scroll"}>
            {chats.map((chat) => {
              return (
                <Box
                  onClick={() => {
                    dispatch(userActions.setCurrentChat(chat));
                    // was trying to create a room anytime a chat was clicked on using the sender's id
                    console.log(getSender(user, chat.users, true))
                    // socket.emit(
                    //   "join-user-room",
                    //   getSender(user, chat.users, true)
                    // );
                  }}
                  cursor={"pointer"}
                  bg={currentChat == chat ? "#38b2ac" : "e8e8e8"}
                  color={currentChat == chat ? "white" : "black"}
                  px={3}
                  py={2}
                  borderRadius={"lg"}
                  key={chat._id}
                >
                  {!chat.isGroupChat
                    ? getSender(user, chat.users)
                    : chat.chatName}
                </Box>
              );
            })}
          </Stack>
        ) : (
          <ChatsLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
