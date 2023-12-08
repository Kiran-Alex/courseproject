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
  const [courses, setCourses] = useState<course>();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>();
  const [price, setPrice] = useState<string>();
  const [imageLink, setImageLink] = useState<string>();
  const [Published, setPublished] = useState<string | boolean>();
  const toast = useToast();
  const navigate = useNavigate();
  const navamset = useSetRecoilState(navam);
  const navbtn =  useSetRecoilState(userpurchase)

  navamset("Dash");
  navbtn("admin")

  type course = {
    map(arg0: (course: { price: string | number; imageLink: string; title: string; description: string; published: boolean; _id: number; }) => import("react/jsx-runtime").JSX.Element): import("react").ReactNode;
    price: number | string;
    imageLink: string;
    title: string;
    description: string;
    published: boolean;
    _id: string;
}

  const getData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/courses`, {
        headers: {
          authorization: localStorage.getItem(import.meta.env.VITE_LOCAL_KEY),
        },
      });
      setCourses(response.data.courses);
    } catch (err:any) {
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
            {courses ?
              courses.map(
                (course: {
                  price: number | string;
                  imageLink: string;
                  title: string;
                  description: string;
                  published: boolean;
                  _id: number;
                }) => {
                  console.log(course)
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
                        {/* onClick={onOpen} */} 
                           <Button onClick={()=>{navigate(`/admin/dashboard/edit/${course._id}`)}}>Edit</Button> 
                        
                          <Button variant="ghost" colorScheme={course.published == true ? "blue" : "blackAlpha"}>
                            {course.published == true ? "published" : "Not published"}
                          </Button>
                        </ButtonGroup>
                      </CardFooter>
                    </Card>
                  );
                }
              ):<p>Loading...</p>}
          </SimpleGrid>
          <br></br>
        </div>
      </div>
    </>
  );
};

export default AdminDashBoard;
