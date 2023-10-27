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
  ButtonGroup,
} from "@chakra-ui/react";
import "../styles/AdminDashBoard.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { navam ,userpurchase } from "../../store/atoms/navbaratom";


const AdminDashBoard = () => {
  const [courses, setCourses] = useState<string | undefined>();
  const [title, setTitle] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [price, setPrice] = useState<string>();
  const [imageLink, setImageLink] = useState<string>();
  const [Published, setPublished] = useState<string | boolean>();
  const toast = useToast();
  const navigate = useNavigate();
  const navamset = useSetRecoilState(navam);
  const navbtn =  useSetRecoilState(userpurchase)
  const { isOpen, onOpen, onClose } = useDisclosure();
  navamset("Dash");
  navbtn("admin")

  const getData = async () => {
    try {
      const response = await axios.get(`${process.env.BACKEND_URL}/admin/courses`, {
        headers: {
          authorization: localStorage.getItem(process.env.LOCAL_KEY),
        },
      });
      setCourses(response.data.courses);
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
                          <Button onClick={onOpen}>Edit</Button>
                          <Modal onClose={onClose} isOpen={isOpen} isCentered>
                            <ModalOverlay />
                            <ModalContent>
                              <ModalHeader>Edit Course</ModalHeader>
                              
                              <ModalCloseButton />
                              <ModalBody>
                                <FormControl >
                                  <FormLabel>Title</FormLabel>
                                  <Input
                                    placeholder={course.title}
                                    onChange={(e) => {
                                      setTitle(e.target.value);
                                    }}
                                  />
                                  <FormLabel>Description</FormLabel>
                                  <Input
                                    placeholder={course.description}
                                    onChange={(e) => {
                                      setDescription(e.target.value);
                                    }}
                                  />
                                  <FormLabel>Price</FormLabel>
                                  <Input
                                    placeholder={course.price.toString()}
                                    onChange={(e) => {
                                      setPrice(e.target.value);
                                    }}
                                  />
                                  <FormLabel>Image Link</FormLabel>
                                  <Input
                                    placeholder={course.imageLink}
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
                                    <option
                                      value={course.published ? true : false}
                                    >
                                      {course.published ? "true" : "false"}
                                    </option>
                                    <option
                                      value={course.published ? false : true}
                                    >
                                      {course.published ? "false" : "true"}
                                    </option>
                                  </Select>
                                </FormControl>
                              </ModalBody>
                              <ModalFooter>
                                <Button
                                  onClick={async () => {
                                    let publishedstatus: boolean | string;
                                    if (Published == undefined) {
                                      publishedstatus = course.published;
                                    } else {
                                      publishedstatus = Published;
                                    }
                                    const response = await axios.put(
                                      `${process.env.BACKEND_URL}/admin/updateCourse/${course._id}`,
                                      {
                                        title: title,
                                        description: description,
                                        price: price,
                                        imageLink: imageLink,
                                        published: publishedstatus,
                                      },
                                      {
                                        headers: {
                                          authorization:
                                            localStorage.getItem(process.env.LOCAL_KEY),
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
                              </ModalFooter>
                            </ModalContent>
                          </Modal>
                          <Button variant="ghost" colorScheme={course.published == true ? "blue" : "blackAlpha"}>
                            {course.published == true ? "published" : "Not published"}
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

export default AdminDashBoard;
