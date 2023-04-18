import React, { useContext, useState } from "react";
import axios from "axios";
import { Url } from "../../constants";
import { VStack, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button,
} from "@chakra-ui/react";


const Register = () => {
  
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    image: "",
  });

  const { name, email, password, confirmPassword, image } = userData;

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name !== "userImage") {
      setUserData({ ...userData, [name]: value });
    } else {
      console.log(files[0]);
      setUserData({ ...userData, image: files[0] });
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (!name || !email || !password || !confirmPassword) {
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

      if (password !== confirmPassword) {
        toast({
          title: "Passwords do not match",
          status: "error",
          duration: 9000,
          isClosable: true,
          position: "top-right",
          onCloseComplete: () => setLoading(false),
        });
        return;
      }

      const formData = new FormData();

      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("image", image);

      const res = await axios.post(`${Url}/api/register`, formData);
      console.log(res);

      toast({
        title: "Account created.",
        description: "We've created your account for you.",
        status: "success",
        duration: 9000,
        isClosable: true,
        position: "top-right",
      });

      navigate("/");
    } catch (err) {
      console.log(err);
      toast({
        title: err.response.data.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }

    setLoading(false);
  };

  return (
    <VStack>
      <p>{JSON.stringify(userData)}</p>
      <FormControl isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          type="name"
          placeholder="Enter your Name"
          name="name"
          required
          onChange={handleChange}
          value={userData.name}
        />
      </FormControl>
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
      <FormControl isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={!show ? "password" : "text"}
            placeholder="Enter your password"
            name="confirmPassword"
            required
            onChange={handleChange}
            value={userData.confirmPassword}
          />
          <InputRightElement>
            <Button size="sm" h="1.75rem" onClick={() => setShow(!show)}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl>
        <FormLabel>Upload your picture</FormLabel>
        <Input
          type="file"
          accept="image/*"
          onChange={handleChange}
          name="userImage"
        />
      </FormControl>
      <Button
        width={"100%"}
        colorScheme="blue"
        onClick={handleSubmit}
        disabled={loading}
        isLoading={loading}
      >
        Submit
      </Button>
    </VStack>
  );
};

export default Register;
