"use client";

import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import {
  HamburgerIcon,
  CloseIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { navam ,userpurchase } from "../../store/atoms/navbaratom";

interface NavItem {
  label?: string;
  subLabel?: string;
  children?: Array<NavItem>;
  href?: string;
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: "Teach on CourseCo",
    children: [
      {
        label: "Register",
        subLabel: "Teach 10000+ Students",
        href: "/admin/Signup",
      },
      {
        label: "Login",
        subLabel: "Welcome Back",
        href: "/admin/login",
      },
    ],
  },
  //   {
  //     label: 'Why us',
  //     href: '#',
  //   },
];
const DesktopNav = () => {
  const linkColor = useColorModeValue("gray.600", "gray.200");
  const linkHoverColor = useColorModeValue("gray.800", "white");
  const popoverContentBgColor = useColorModeValue("white", "gray.800");
  const navamvalue: string = useRecoilValue(navam);

  return (
    <Stack direction={"row"} spacing={4}>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          {navamvalue === "Landing" ? (
            <Popover trigger={"hover"} placement={"bottom-start"}>
              <PopoverTrigger>
                <Box
                  as="a"
                  p={2}
                  href={navItem.href ?? "#"}
                  fontSize={"sm"}
                  fontWeight={500}
                  color={linkColor}
                  _hover={{
                    textDecoration: "none",
                    color: linkHoverColor,
                  }}
                >
                  {navItem.label}
                </Box>
              </PopoverTrigger>

              {navItem.children && (
                <PopoverContent
                  border={0}
                  boxShadow={"xl"}
                  bg={popoverContentBgColor}
                  p={4}
                  rounded={"xl"}
                  minW={"sm"}
                >
                  <Stack>
                    {navItem.children.map((child) => (
                      <DesktopSubNav key={child.label} {...child} />
                    ))}
                  </Stack>
                </PopoverContent>
              )}
            </Popover>
          ) : null}
        </Box>
      ))}
    </Stack>
  );
};

const DesktopSubNav = ({ label, href, subLabel }: NavItem) => {
  return (
    <Box
      as="a"
      href={href}
      role={"group"}
      display={"block"}
      p={2}
      rounded={"md"}
      _hover={{ bg: useColorModeValue("pink.50", "gray.900") }}
    >
      <Stack direction={"row"} align={"center"}>
        <Box>
          <Text
            transition={"all .3s ease"}
            _groupHover={{ color: "pink.400" }}
            fontWeight={500}
          >
            {label}
          </Text>
          <Text fontSize={"sm"}>{subLabel}</Text>
        </Box>
        <Flex
          transition={"all .3s ease"}
          transform={"translateX(-10px)"}
          opacity={0}
          _groupHover={{ opacity: "100%", transform: "translateX(0)" }}
          justify={"flex-end"}
          align={"center"}
          flex={1}
        >
          <Icon color={"pink.400"} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Box>
  );
};


export default function WithSubnavigation() {
  const { isOpen, onToggle } = useDisclosure();
  const navigate = useNavigate();
  const navamvalue = useRecoilValue(navam)
  const navbtn = useRecoilValue(userpurchase);

  const MobileNav = (navItem:NavItem) => {
  const navamvalue: string = useRecoilValue(navam);
  const navigate = useNavigate()
  return (
    <Stack
      bg={useColorModeValue("white", "gray.800")}
      p={4}
      display={{ md: "none" }}
    >
      {NAV_ITEMS.map(() => (
        <>
         <Box key={navItem.label}>
          {navamvalue === "Landing" ? (
            <>
           <Button  style={{width : "100%"}}  onClick={()=>{navigate("/admin/Signup");onToggle()}}>
            Creator SignUp
           </Button>
           <br></br>
           <Button style={{marginTop : 5,color : "blue",width : "100%"}}  onClick={()=>{navigate("/admin/login");onToggle()}}>
           Creator Login
          </Button>
          </>
          ) : <Button onClick={()=>{localStorage.setItem("token","") ;navigate("/"); onToggle()}} color={"red"}>Logout</Button>}
        </Box>
       </>
      ))}
    </Stack>
  );
};

  return (
    <Box>
      <Flex
        bg={useColorModeValue("white", "gray.800")}
        color={useColorModeValue("gray.600", "white")}
        minH={"60px"}
        py={{ base: 2 }}
        px={{ base: 4, lg: 58 }}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={useColorModeValue("gray.200", "gray.900")}
        align={"center"}
      >
        <Flex
          flex={{ base: 1, md: "auto" }}
          ml={{ base: -2 }}
          display={{ base: "flex", md: "none" }}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={"ghost"}
            aria-label={"Toggle Navigation"}
          />
        </Flex>
        <Flex flex={{ base: 1 }} justify={{ base: "center", md: "start" }}>
          <Text
            textAlign={useBreakpointValue({ base: "center", md: "left" })}
            fontFamily={"heading"}
            style={{
              color: "#3CCAA1",
              fontWeight: "bolder",
              fontSize: "1.1rem",
              cursor: "pointer",
            }}
            onClick={() => navigate("/")}
            color={useColorModeValue("gray.800", "white")}
          >
            CourseCo
          </Text>

          <Flex display={{ base: "none", md: "flex" }} ml={10}>
            <DesktopNav />
          </Flex>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={"flex-end"}
          direction={"row"}
          spacing={6}
        >
          {navamvalue === "Landing" ? (
            <Button
              as={"a"}
              onClick={() => navigate("/login")}
              fontSize={"sm"}
              fontWeight={400}
              variant={"link"}
            >
              Sign In
            </Button>
          ) : (
            <Button
              as={"a"}
              size={{base: "xs", md:"sm", xl:"md"}}
              onClick={() =>{navbtn == "user" ?  navigate("/purchasedCourses") : navigate("/admin/createcourse") }}
              fontSize={"sm"}
              variant={"button"}
              fontWeight={600}
             
              color={"white"}
            bg={"#3CCAA6"}
            >
             {navbtn == "user" ?  "Purchased Courses" : "create Courses"}
            </Button>
          )}
         {navamvalue === "Landing" ? <Button
            as={"a"}
            display={{ base: "none", md: "inline-flex" }}
            fontSize={"sm"}
            fontWeight={600}
            color={"white"}
            bg={"#EE8EA0"}
            onClick={() => navigate("/signup")}
            _hover={{
              bg: "pink.300",
              color: "white",
            }}
          >
            Sign Up
          </Button> : <Button
            as={"a"}
            display={{ base: "none", md: "inline-flex" }}
            fontSize={"sm"}
            fontWeight={600}
            color={"white"}
            bg={"#EE8EA0"}
            onClick={() =>{ localStorage.setItem(import.meta.env.VITE_LOCAL_KEY,""), navigate("/")}}
            _hover={{
              bg: "pink.300",
              color: "white",
            }}
          >
            Logout
          </Button>}
        </Stack>
      </Flex>

      

      <Collapse in={isOpen} animateOpacity >
        <MobileNav />
      </Collapse>
    </Box>
  );

  
}





