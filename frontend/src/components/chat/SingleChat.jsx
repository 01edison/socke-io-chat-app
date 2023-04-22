import { Box, Text, IconButton } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { userActions } from "../../store/user-slice";
import { getSender, getSenderFull } from "../../config/chat";
import ProfileModal from "../user/ProfileModal";
import UpdateGroupModal from "../group/UpdateGroupModal";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const {
    user: { user },
    currentChat,
  } = useSelector((state) => state.user);

  const dispatch = useDispatch();
console.log(currentChat)
  return (
    <div style={{ width: "100%" }}>
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
            height="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {/* {messages here} */}
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
