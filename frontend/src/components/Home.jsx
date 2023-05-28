import React, { useEffect } from "react";
import {
  Container,
  Box,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import Login from "./auth/Login";
import Register from "./auth/Register";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { Url } from "../constants";
import { userActions } from "../store/user-slice";
import { useDispatch } from "react-redux";

const Home = () => {
  const navigate = useNavigate();

  
  return (
    <Container maxW="xl" centerContent>
      <Box
        display="flex"
        justifyContent={"center"}
        padding={3}
        bg={"white"}
        w={"100%"}
        margin={"40px 0 15px 0"}
        borderRadius={"lg"}
        borderWidth={"1px"}
      >
        <Text fontSize={"4xl"} fontFamily={"Work Sans"}>
          Edison Chat App
        </Text>
      </Box>

      <Box bg="white" w={"100%"} p={4} borderRadius={"lg"} borderWidth={"1px"}>
        <Tabs variant="soft-rounded" colorScheme="blue" isFitted>
          <TabList>
            <Tab>Login</Tab>
            <Tab>Register</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Register />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Home;
