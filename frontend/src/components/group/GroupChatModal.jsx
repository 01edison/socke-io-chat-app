import { Box, useDisclosure, useToast } from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  Input,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { userActions } from "../../store/user-slice";
import axios from "axios";
import { Url } from "../../constants";
import UserListItem from "../user/UserListItem";
import UserBadgeItem from "../user/UserBadgeItem";

const GroupChatModal = ({ children, setFetchAgain }) => {
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    user: { user, token },
    chats,
  } = useSelector((state) => state.user);

  const dispatch = useDispatch();

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

  const addToGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "User already selected",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleDelete = (user) => {
    setSelectedUsers((selectedUsers) =>
      selectedUsers.filter((s) => s !== user)
    );
  };

  const handleSubmit = async () => {
    try {
      if (!groupChatName || !selectedUsers) {
        toast({
          title: "Please fill all required fields",
          status: "error",
        });
        return;
      }
      if (selectedUsers.length < 2) {
        toast({
          title: "Not enough participants",
          status: "error",
        });
        return;
      }
      setLoading(true);
      const body = {
        name: groupChatName,
        users: selectedUsers,
      };
      const { data } = await axios.post(`${Url}/api/group`, body, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      console.log(data);
      setGroupChatName("");
      setSelectedUsers([]);

      dispatch(userActions.setChats([...chats, data]));
      onClose();
      toast({
        title: "New Group chat created",
        status: "success",
      });
    } catch (err) {
      toast({
        title: "Failed to create group chat",
        status: "error",
      });
    }
  };

  return (
    <div>
      <span onClick={onOpen}>{children}</span>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign={"center"}>Create Group Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDir={"column"} alignItems={"center"}>
            <FormControl>
              <Input
                placeholder="Group Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
                value={groupChatName}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add users"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {/* selected users */}
            <Box display={"flex"} flexWrap="wrap">
              {selectedUsers.map((user) => (
                <UserBadgeItem
                  user={user}
                  handleClick={() => handleDelete(user)}
                />
              ))}
            </Box>

            {/* users from the search */}
            {loading ? (
              <p>Loading...</p>
            ) : (
              searchResult
                .slice(0, 6)
                .map((user) => (
                  <UserListItem
                    user={user}
                    handleClick={() => addToGroup(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              onClick={handleSubmit}
              colorScheme="blue"
              isLoading={loading}
            >
              Create Group Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default GroupChatModal;
