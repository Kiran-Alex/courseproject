"use client";

import {
  Box,
  Flex,
  Stack,
  Heading,
  Text,
  Container,
  Input,
  Button,
  SimpleGrid,
  Avatar,
  AvatarGroup,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import adminpng from "../assets/admin.png"

const avatars = [
  {
    name: "Ryan Florence",
    url: "https://bit.ly/ryan-florence",
  },
  {
    name: "Segun Adebayo",
    url: "https://bit.ly/sage-adebayo",
  },
  {
    name: "Kent Dodds",
    url: "https://bit.ly/kent-c-dodds",
  },
  {
    name: "Prosper Otemuyiwa",
    url: "https://bit.ly/prosper-baba",
  },
  {
    name: "Christian Nwamba",
    url: "https://bit.ly/code-beast",
  },
];

export default function JoinOurTeam() {
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();
  const navigate = useNavigate()

  return (
    <Box position={"relative"}>
      <Container
        as={SimpleGrid}
        maxW={"7xl"}
        columns={{ base: 1, md: 2 }}
        spacing={{ base: 10, lg: 32 }}
        py={{ base: 10, sm: 20, lg: 32 }}
      >
        <Stack spacing={{ base: 10, md: 20 }}>
          <Stack direction={"row"} spacing={4} align={"center"}>
          <img src={adminpng} width={390}/>
          </Stack>
        </Stack>
        <Stack
          bg={"gray.50"}
          rounded={"xl"}
          p={{ base: 4, sm: 6, md: 8 }}
          spacing={{ base: 8 }}
          maxW={{ lg: "lg" }}
        >
          <Stack spacing={4}>
            <Heading
              color={"gray.800"}
              lineHeight={1.1}
              fontSize={{ base: "2xl", sm: "3xl", md: "4xl" }}
            >
              Admin Sign Up
              <Text
                as={"span"}
                bgGradient="linear(to-r, red.400,pink.400)"
                bgClip="text"
              >
                !
              </Text>
            </Heading>
            <Text color={"gray.500"} fontSize={{ base: "sm", sm: "md" }}>
              Be the next Top Mentor
            </Text>
          </Stack>
          <Box as={"form"} mt={1}>
            <Stack spacing={4}>
            <Input
                type="email"
                placeholder="email"
                bg={"gray.100"}
                border={0}
                color={"gray.500"}
                _placeholder={{
                  color: "gray.500",
                }}
              />      
              <Input
                placeholder="Username"
                bg={"gray.100"}
                border={0}
                color={"gray.500"}
                _placeholder={{
                  color: "gray.500",
                }}
                onChange={(e) => {
                  setusername(e.target.value);
                }}
              />
              <Input
                type="password"
                placeholder="Password"
                bg={"gray.100"}
                border={0}
                color={"gray.500"}
                _placeholder={{
                  color: "gray.500",
                }}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </Stack>
            <Button
              fontFamily={"heading"}
              mt={8}
              w={"full"}
              bgGradient="linear(to-r, red.400,pink.400)"
              color={"white"}
              _hover={{
                bgGradient: "linear(to-r, red.400,pink.400)",
                boxShadow: "xl",
              }}
              onClick={async () => {
                try {
                  const response = await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/admin/signup`,
                    {
                      username: username,
                      password: password,
                    }
                  );

                  const status = response.status;

                  if (status >= 200 && status <= 209) {
                    toast({
                      title: "Successfully Registered",
                      description:
                        "You'll be redirected to signin please wait ",
                      status: "success",
                      duration: 3000,
                      isClosable: true,
                    });

                    setTimeout(()=>{
                      navigate("/admin/login")
                    },3000)
                  } 
                   
                  
                } catch (err:any) {
                  if(err.response.status>= 400 &&err.response.status<= 409 )
                  {
                    toast({
                      title: "User Already Exists Please Signin",
                      description:
                        "You'll be redirected to signin please wait ",
                      status: "warning",
                      duration: 3000,
                      isClosable: true,
                    });
                    setTimeout(()=>{
                      navigate("/admin/login")
                    },3000)
                  }
                  else{
                  toast({
                    title: "Please Signup in a minute ",
                    description:
                      "We are experiencing high requests",
                    status: "info",
                    duration: 3000,
                    isClosable: true,
                  });}
                }
              }}
            >
              Submit
            </Button>
          </Box>
          form
        </Stack>
      </Container>
    </Box>
  );
}
