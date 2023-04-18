import React from "react";
import { Stack, Skeleton } from "@chakra-ui/react";

const ChatsLoading = () => {
  return (
    <Stack mt={3}>
      <Skeleton height="45px" />
      <Skeleton height="45px" />
      <Skeleton height="45px" />
      <Skeleton height="45px" />
      <Skeleton height="45px" />
    </Stack>
  );
};

export default ChatsLoading;
