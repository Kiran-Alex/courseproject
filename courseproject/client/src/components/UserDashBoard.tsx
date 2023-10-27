import {
  SimpleGrid,
  Heading,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Image,
  Text,
  Button,
  useToast,
  useDisclosure,
  ButtonGroup,
} from "@chakra-ui/react";
import "../styles/AdminDashBoard.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { navam,userpurchase  } from "../../store/atoms/navbaratom";

const UserDashBoard = () => {
  const [courses, setCourses] = useState<string | undefined>();
  const toast = useToast();
  const navigate = useNavigate();
  const navamset = useSetRecoilState(navam);
  const navbtn =  useSetRecoilState(userpurchase);
  navamset("Dash");
  navbtn("user")

  const getData = async () => {
    try {
      const response = await axios.get(`${process.env.BACKEND_URL}/admin/courses`, {
        headers: {
          authorization: localStorage.getItem(process.env.LOCAL_KEY),
        },
      });
      const filteredCourses = response.data.courses.filter(
        (cr: { published: boolean }) => cr.published === true
      );
      setCourses(filteredCourses);
    } catch (err: any) {
      if (err.response.status >= 400 && err.response.status <= 409) {
        toast({
          title: "Please Signin",
          description: "You'll be redirected to signin please wait ",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });

        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    }
  };

  useEffect(() => {
    getData();
  }, [courses]);

  return (
    <>
      <div className="mcont">
        <div className="mc">
          <br />
          <Heading style={{ paddingLeft: "10px" }}>All Courses</Heading>
          <br />
          <br />
          <SimpleGrid
            spacing={20}
            templateColumns="repeat(auto-fill, minmax(300px, 1fr))"
          >
            {courses &&
              courses.map(
                (course: {
                  price: number | string;
                  imageLink: string;
                  title: string;
                  description: string;
                  published: boolean;
                  _id: string;
                }) => {
                  return (
                    <Card key={course._id}>
                      <CardHeader>
                        <Heading size="md"> {course.title}</Heading>
                      </CardHeader>
                      <CardBody>
                        <Image
                          src={course.imageLink}
                          alt="Green double couch with wooden legs"
                          borderRadius="sm"
                        />
                        <br />
                        <Text as="b">{course.price}</Text>
                        <br />
                        <br /> <Text>{course.description}</Text> <br />{" "}
                      </CardBody>
                      <CardFooter>
                        <ButtonGroup spacing="4">
                          <Button
                            onClick={async () => {
                              try {
                                const res = await axios.post(
                                  `${process.env.BACKEND_URL}/create-checkout-session`,
                                  {
                                    coursedata: {
                                      title: course.title,
                                      price: course.price,
                                    },
                                  }
                                );
                                console.log(res.status);
                                if (res.status == 200) {
                                  localStorage.setItem(process.env.COURSE_KEY,course._id)
                                  toast({
                                    title:
                                      "You will be using below card details since it's in Test mode ",
                                    description:
                                      "Card Number : 4000007840000001 , cvv and expiry date of your choice ",
                                    status: "loading",
                                    duration: 6000,
                                    isClosable: true,
                                  });
                                  await setTimeout(
                                    () => (window.location.href = res.data.url),
                                    6000
                                  );
                                }
                              } catch (err) {
                                console.log(err);
                              }
                            }}
                          >
                            Buy
                          </Button>
                        </ButtonGroup>
                      </CardFooter>
                    </Card>
                  );
                }
              )}
          </SimpleGrid>
          <br></br>
        </div>
      </div>
    </>
  );
};

export default UserDashBoard;
