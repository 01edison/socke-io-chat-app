import React, { useState } from "react";
import axios from "axios";
import { Url } from "../../constants";
import { VStack, useToast } from "@chakra-ui/react";
import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = userData;

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (!email || !password) {
        toast({
          title: "Please fill all required fields",
          status: "error",
          duration: 9000,
          isClosable: true,
          position: "top-right",
          onCloseComplete: () => setLoading(false),
        });
        return;
      }

      const formData = new FormData();

      formData.append("email", email);
      formData.append("password", password);

      const { data } = await axios.post(`${Url}/api/login`, formData);
      console.log(data);
      localStorage.setItem("user", JSON.stringify(data))
      toast({
        title: "Login Successful!",
        status: "success",
        duration: 9000,
        isClosable: true,
        position: "top-right",
        onCloseComplete: () => setLoading(false),
      });
      navigate("/chats");
    } catch (error) {
      console.log(error);
      toast({
        status: "error",
        title: error.response.data.error,
        onCloseComplete: () => setLoading(false),
        isClosable: true,
      });
    }
  };

  return (
    <VStack>
      <p>{JSON.stringify(userData)}</p>
      <FormControl isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          placeholder="Enter your email"
          name="email"
          required
          onChange={handleChange}
          value={userData.email}
        />
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={!show ? "password" : "text"}
            placeholder="Enter your password"
            name="password"
            required
            onChange={handleChange}
            value={userData.password}
          />
          <InputRightElement>
            <Button size="sm" h="1.75rem" onClick={() => setShow(!show)}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        width={"100%"}
        colorScheme="blue"
        onClick={handleSubmit}
        isLoading={loading}
        disabled={loading}
      >
        Login
      </Button>
      <Button
        variant="solid"
        colorScheme="red"
        width="100%"
        onClick={() => {
          setUserData({ email: "edison@gmail.com", password: "edi123" });
        }}
      >
        Guest user Credentials
      </Button>
    </VStack>
  );
};

export default Login;
