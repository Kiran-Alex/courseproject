import React, { useState, useEffect } from "react";
import axios from "axios";
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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Select,
  Box,
  ButtonGroup,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { navam, userpurchase } from "../../store/atoms/navbaratom";
import {ArrowBackIcon} from '@chakra-ui/icons'

const Adminedit = () => {
  const [courses, setCourses] = useState<course | any>();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>();
  const [price, setPrice] = useState<string>();
  const [imageLink, setImageLink] = useState<string>();
  const [Published, setPublished] = useState<string | boolean>();
  const toast = useToast();
  const navamset = useSetRecoilState(navam);
  const navbtn = useSetRecoilState(userpurchase);
  navamset("Dash");
  navbtn("admin");
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();

  type course = {
    map(
      arg0: (course: {
        price: string | number;
        imageLink: string;
        title: string;
        description: string;
        published: boolean;
        _id: number;
      }) => import("react/jsx-runtime").JSX.Element
    ): import("react").ReactNode;
    price: number | string;
    imageLink: string;
    title: string;
    description: string;
    published: boolean;
    _id: string;
  };

  const getData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/admin/courses`,
        {
          headers: {
            authorization: localStorage.getItem(import.meta.env.VITE_LOCAL_KEY),
          },
        }
      );
      const filterCourse = response.data.courses.filter(
        (v: any) => v._id == courseId
      );
      setCourses(filterCourse);
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
          navigate("/admin/login");
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
        <br/>
        <p id="pq1" onClick={()=>{navigate("/admin/dashboard")}} style={{marginLeft: 10 , marginBottom: 10}}><ArrowBackIcon/> Back</p>
            <Heading style={{ paddingLeft: "10px" }}>Edit Course</Heading>
            <br/>
         {courses ? <SimpleGrid
            height={"fit-content"}
            spacing={300}
            templateColumns="repeat(auto-fill, minmax(300px, 1fr))"
          >
            <Card>
              <FormControl>
                <FormLabel>Title</FormLabel>
                <Input
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                />
                <FormLabel>Description</FormLabel>
                <Input
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                />
                <FormLabel>Price</FormLabel>
                <Input
                  onChange={(e) => {
                    setPrice(e.target.value);
                  }}
                />
                <FormLabel>Image Link</FormLabel>
                <Input
                  onChange={(e) => {
                    setImageLink(e.target.value);
                  }}
                />
                <FormLabel>Published</FormLabel>
                <Select
                  variant="filled"
                  onChange={(e) => {
                    setPublished(e.target.value);
                  }}
                >
                  <option value={courses[0].published ? "true" : "false"}>
                    {courses[0].published ? "true" : "false"}
                  </option>
                  <option value={courses[0].published ? "false" : "true"}>
                    {courses[0].published ? "false" : "true"}
                  </option>
                </Select>
              </FormControl>
              <CardFooter>
                <Button
                  onClick={async () => {
                    const response = await axios.put(
                      `${import.meta.env.VITE_BACKEND_URL}/admin/updateCourse/${
                        courses[0]._id
                      }`,
                      {
                        title: title,
                        description: description,
                        price: price,
                        imageLink: imageLink,
                        published: Published,
                      },
                      {
                        headers: {
                          authorization: localStorage.getItem(
                            import.meta.env.VITE_LOCAL_KEY
                          ),
                        },
                      }
                    );
                    if (response.status === 200) {
                      toast({
                        title: "Course Updated",
                        description: "Please Continue",
                        status: "success",
                        duration: 3000,
                        isClosable: true,
                      });
                      setTimeout(() => {
                        onClose();
                      }, 3000);
                    } else {
                      toast({
                        title: "Something went Wrong",
                        description:
                          "Please Try again later or Check Your details again",
                        status: "warning",
                        duration: 3000,
                        isClosable: true,
                      });
                    }
                  }}
                >
                  Save
                </Button>
              </CardFooter>
            </Card>

            {courses &&
              courses.map(
                (course: {
                  price: number | string;
                  imageLink: string;
                  title: string;
                  description: string;
                  published: boolean;
                  _id: number;
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
                        <Text as="b">{course.published}</Text>
                      </CardBody>
                      <CardFooter>
                        <ButtonGroup spacing="4">
                          <Button
                            onClick={() => {
                              navigate(`/admin/dashboard/edit/${course._id}`);
                            }}
                          >
                            Edit
                          </Button>

                          <Button
                            variant="ghost"
                            colorScheme={
                              course.published == true ? "blue" : "blackAlpha"
                            }
                          >
                            {course.published == true
                              ? "published"
                              : "Not published"}
                          </Button>
                        </ButtonGroup>
                      </CardFooter>
                    </Card>
                  );
                }
              )}
          </SimpleGrid>:<p>Loading...</p>}
        </div>
      </div>
    </>
  );
};

export default Adminedit;
