import React, { useState } from "react";
import {
  Box,
  Button,
  Tooltip,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerCloseButton,
  DrawerBody,
  Input,
  useToast,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import ProfileModal from "../user/ProfileModal";
import { Url } from "../../constants";
import { useNavigate } from "react-router-dom";
import { useDisclosure } from "@chakra-ui/react";
import axios from "axios";
import ChatsLoading from "./ChatsLoading";
import UserListItem from "../user/UserListItem";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../../store/user-slice";
import { Spinner } from "@chakra-ui/react";

const SideDrawer = ({ user, token }) => {
  const [search, setSearch] = useState("");
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();

  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const dispatch = useDispatch();
  const { chats } = useSelector((state) => state.user);

  const handleLogout = () => {
    localStorage.removeItem("user");
    dispatch(userActions.setChats([]));
    dispatch(userActions.setUser({}));
    dispatch(userActions.setCurrentChat(""));
    navigate("/");
  };

  const handleSearch = async () => {
    setLoading(true);
    if (!search) {
      toast({
        title: "Search bar is empty!",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top-right",
        onCloseComplete: () => setLoading(false),
      });
      return;
    }

    try {
      const { data } = await axios.get(`${Url}/api/user`, {
        headers: {
          Authorization: "Bearer " + token,
        },
        params: {
          search,
        },
      });

      setResult(data);
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error Occured!",
        description: error.response.data.error,
        status: "error",
        duration: 9000,
        isClosable: true,
        position: "top-right",
        onCloseComplete: () => setLoading(false),
      });
    }
  };

  const accessChat = async (userId) => {
    setLoadingChat(true);
    try {
      const body = {
        userId,
      };

      const { data } = await axios.post(`${Url}/api/chat`, body, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      console.log(data);
      dispatch(userActions.setCurrentChat(data));

      if (!chats.find((c) => c._id === data._id)) {
        dispatch(userActions.setChats([data, ...chats]));
      }
      setLoadingChat(false);
    } catch (error) {
      toast({
        title: "Error Fetching chat",
        description: error.response.data.error,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
        onCloseComplete: () => setLoadingChat(false),
      });
      console.log(error);
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent={"space-between"}
        alignItems={"center"}
        bg="white"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search for a user" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i className="fa-solid fa-magnifying-glass"></i>
            <Text display={{ base: "none", md: "flex" }} px="4">
              Search
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize={"2xl"} fontFamily="Work sans">
          Edison Chat App
        </Text>

        <div>
          <Menu>
            <MenuButton p={4}>
              <BellIcon fontSize={"2xl"} m={1} />
            </MenuButton>

            {/* <MenuList></MenuList> */}
          </Menu>

          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                src={`${Url}/api/user/image/${user?._id}`}
                name={user?.name}
              />
            </MenuButton>

            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>

              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        // finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottom={"1px"}>Search Users</DrawerHeader>

          <DrawerBody>
            <Box display={"flex"}>
              <Input
                mr={2}
                mb={4}
                placeholder="Search by Name or Email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Search</Button>
            </Box>

            {loading ? (
              <ChatsLoading />
            ) : (
              result.map((user, i) => {
                return (
                  <UserListItem
                    key={i}
                    user={user}
                    handleClick={() => accessChat(user._id)}
                  />
                );
              })
            )}

            {loadingChat && <Spinner ml="auto" display={"flex"} />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
