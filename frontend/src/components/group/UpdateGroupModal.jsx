import {
  Box,
  FormControl,
  Input,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { IconButton, Button } from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import UserBadgeItem from "../user/UserBadgeItem";
import { useSelector, useDispatch } from "react-redux";
import { userActions } from "../../store/user-slice";
import { Url } from "../../constants";
import axios from "axios";
import UserListItem from "../user/UserListItem";

const UpdateGroupModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const toast = useToast();

  const {
    user: { user, token },
    currentChat,
  } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const handleRename = async () => {
    try {
      if (!groupChatName) return;
      setRenameLoading(true);
      const body = {
        chatId: currentChat._id,
        chatName: groupChatName,
      };

      const { data } = await axios.patch(`${Url}/api/group`, body, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      dispatch(userActions.setCurrentChat(data));

      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
      setGroupChatName("");
    } catch (err) {
      toast({
        title: "Name update failed",
        status: "error",
        description: err.response.data.err,
      });
    }
  };

  const handleSearch = async (query) => {
    setSearch(query);

    if (!query) return;

    try {
      setLoading(true);
      const { data } = await axios.get(`${Url}/api/user`, {
        params: {
          search,
        },
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      console.log(data);
      setSearchResult(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      toast({
        title: "Error Occured",
        description: "Falied to load the search results",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom-left",
      });

      setLoading(false);
    }
  };

  const addUser = async (userToAdd) => {
    try {
      if (currentChat.groupAdmin._id !== user._id) {
        toast({
          title: "Only Admins can add new users",
          status: "error",
        });
        return;
      }
      setLoading(true);
      const body = {
        chatId: currentChat._id,
        userId: userToAdd._id,
      };
      const { data } = await axios.put(`${Url}/api/group`, body, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      dispatch(userActions.setCurrentChat(data));
      setLoading(false);
    } catch (error) {
      toast({
        title: error.response.data.error,
        status: "error",
      });

      setLoading(false);
    }
  };

  const removeUser = async (userToRemove) => {
    try {
      setLoading(true);
      const body = {
        chatId: currentChat._id,
        userId: userToRemove._id,
      };

      const { data } = await axios.post(`${Url}/api/group/remove`, body, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      dispatch(userActions.setCurrentChat(userToRemove == user ? "" : data));
      setFetchAgain(!fetchAgain);
      fetchMessages()
      onClose();
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast({
        title: "Something went wrong",
        description: error.response.data.error,
      });
      setLoading(false);
    }
  };

  return (
    <div>
      <IconButton onClick={onOpen} icon={<ViewIcon />} />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"35px"}
            textAlign={"center"}
            fontFamily={"Work sans"}
          >
            {currentChat?.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box display={"flex"} flexWrap={"wrap"}>
              {currentChat?.users.map((user) => {
                return (
                  <UserBadgeItem
                    user={user}
                    handleClick={() => removeUser(user)}
                  />
                );
              })}
            </Box>

            <FormControl display={"flex"}>
              <Input
                placeholder="Change Group chat name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant={"solid"}
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add User to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <Spinner />
            ) : (
              searchResult.slice(0, 6).map((user) => {
                return (
                  <UserListItem user={user} handleClick={() => addUser(user)} />
                );
              })
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={() => removeUser(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default UpdateGroupModal;
