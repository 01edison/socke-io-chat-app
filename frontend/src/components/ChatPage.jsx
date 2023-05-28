import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { userActions } from "../store/user-slice";
import { Box } from "@chakra-ui/react";
import SideDrawer from "./chat/SideDrawer";
import MyChats from "./chat/MyChats";
import ChatBox from "./chat/ChatBox";
import { io } from "socket.io-client";
import { Url } from "../constants";

const ChatPage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(userActions.setSocket(io(Url)));
  }, []);

  const {
    user: { user, token },
  } = useSelector((state) => state.user);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("user"));
    dispatch(userActions.setUser(userInfo));
  }, []);

  return (
    <div>
      {user && <SideDrawer user={user} token={token} />}

      <Box
        display="flex"
        justifyContent="space-between"
        width="100vw"
        h="91.5vh"
        p={"10px"}
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox
            fetchAgain={fetchAgain}
            setFetchAgain={setFetchAgain}
            // socket={socket}
          />
        )}
      </Box>
    </div>
  );
};

export default ChatPage;
