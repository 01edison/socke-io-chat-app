import React from "react";
import { Badge } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

const UserBadgeItem = ({ user, handleClick }) => {
  return (
    <Badge
      colorScheme="purple"
      m={2}
      onClick={handleClick}
      borderRadius={"lg"}
      display={"flex"}
      alignItems={"center"}
      p={2}
    >
      {user.name} {user && <CloseIcon pl={1} cursor={"pointer"} />}
    </Badge>
  );
};

export default UserBadgeItem;
