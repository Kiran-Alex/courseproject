import {
    Box,
    Stack,
    Heading,
    Text,
    Input,
    Button,
    Center,
    useToast
  } from '@chakra-ui/react';
  import { Link,useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { useSetRecoilState } from "recoil";
import { navam } from "../../store/atoms/navbaratom";

  
  export default function JoinOurTeam() {
    const [username, setusername] = useState("");
    const [password, setPassword] = useState("");
    const toast = useToast();
    const navigate = useNavigate()
    const navamset = useSetRecoilState(navam);
    navamset("Landing")
    return (
      <Center h="100vh" backgroundImage="url('../public/BGImage.png')" > {/* Center vertically */}
        <Box  w='400px'   position={'relative'}>
          <Stack
            bg={'gray.50'}
            rounded={'xl'}
            p={{ base: 4, sm: 6, md: 8 }}
            spacing={{ base: 8 }}
            maxW={{ lg: 'lg' }}
          >
            <Stack spacing={4}>
              <Heading
                color={'gray.800'}
                lineHeight={1.1}
                fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}
              >
                Sign In
                <Text as={'span'} bgGradient="linear(to-r, red.400,pink.400)" bgClip="text">
                  !
                </Text>
              </Heading>
              <Text color={'gray.500'} fontSize={{ base: 'sm', sm: 'md' }}>
                Welcome Back! Captian Co 🫡
              </Text>
            </Stack>
            <Box as={'form'} mt={10}>
              <Stack spacing={4}>
                <Input
                  placeholder="Username"
                  bg={'gray.100'}
                  border={0}
                  color={'gray.500'}
                  _placeholder={{
                    color: 'gray.500',
                  }}
                  onChange={(e)=>{setusername(e.target.value)}}
                />
                <Input
                  type='password'
                  placeholder="Password"
                  bg={'gray.100'}
                  border={0}
                  color={'gray.500'}
                  _placeholder={{
                    color: 'gray.500',
                  }}
                  onChange={(e)=>{setPassword(e.target.value)}}
                />
                <Button
                  fontFamily={'heading'}
                  w={'full'}
                  bgGradient="linear(to-r, red.400,pink.400)"
                  color={'white'}
                  _hover={{
                    bgGradient: 'linear(to-r, red.400,pink.400)',
                    boxShadow: 'xl',
                  }}

                  onClick={async () => {
                    try {
                      const response = await axios.post(
                        `${import.meta.env.VITE_BACKEND_URL}/admin/signin`,
                        {},
                        {
                          headers : {
                            username: username,
                            password: password,
                          }
                        }
                        
                      );
    
                      const status = response.status;
    
                      if (status >= 200 && status <= 209) {
                        localStorage.setItem(import.meta.env.VITE_LOCAL_KEY ,"Bearer "+ response.data.token)

                        toast({
                          title: "Successfull",
                          description:
                            "You'll be redirected to Dashboard please wait ",
                          status: "loading",
                          duration: 3000,
                          isClosable: true,
                        });
                            
                        setTimeout(()=>{
                          navigate("/admin/dashboard")
                        },3000)
                      } 
                       
                      
                    } catch (err:any) {
                      if(err.response.status>= 400 &&err.response.status<= 409 )
                      {
                        toast({
                          title: "No account Found Please Sign up",
                          description:
                            "You'll be redirected to Sign Up page please wait ",
                          status: "warning",
                          duration: 3000,
                          isClosable: true,
                        });
                        setTimeout(()=>{
                          navigate("/admin/Signup")
                        },3000)
                      }
                      else{
                      toast({
                        title: "Please Signin in a minute ",
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
                <Text color={'gray.500'} fontSize={{ base: 'sm', sm: 'md' }}>
                New ? Register <Link to={"/admin/signup"} style={{textDecoration :"underline"}}>Here</Link> 
              </Text>

              </Stack>
            </Box>
          </Stack>
        </Box>
      </Center>
    );
  }
  