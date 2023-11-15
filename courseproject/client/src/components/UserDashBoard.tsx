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
  ButtonGroup,
  Spinner
} from "@chakra-ui/react";
import { Alertdg } from "./alertDialog";
import "../styles/AdminDashBoard.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { navam,userpurchase  } from "../../store/atoms/navbaratom";

const UserDashBoard = () => {
  const [courses, setCourses] = useState<course>();
  const [purchasedc,setPurchasedc] = useState<any>();
  const toast = useToast();
  const navigate = useNavigate();
  const navamset = useSetRecoilState(navam);
  const navbtn =  useSetRecoilState(userpurchase);
  navamset("Dash");
  navbtn("user")

  type course = {
                  map(arg0: (course: { price: string | number; imageLink: string; title: string; description: string; published: boolean; _id: string; }) => import("react/jsx-runtime").JSX.Element): import("react").ReactNode;
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
      const filteredCourses = response.data.courses.filter(
        (cr: { published: boolean }) => cr.published === true
      );
      setCourses(filteredCourses);
        // user purchased
      const response1 = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/purchasedCourses`, {
        headers: {
          authorization: localStorage.getItem(import.meta.env.VITE_LOCAL_KEY),
        },
      });

      setPurchasedc(response1.data.purchasedCourses)



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
  }, []);

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
                  _id: string;
                }) => {
                  let buytoggle;
                  try{
                    let purchasedcourse = purchasedc.find((obj: { _id: string; }) =>obj._id == course._id)
                    if(purchasedcourse) {
                      buytoggle = true
                    }
                    else {
                      buytoggle = false
                    }
                  }
                  catch(err) {

                  }
                  
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
                          {!buytoggle ?<Alertdg  title={course.title} price={course.price} id={course._id} /> : "Paid"}
                        </ButtonGroup>
                      </CardFooter>
                    </Card>
                  );
                }
              ) : <Spinner/>}
          </SimpleGrid>
          <br></br>
        </div>
      </div>
    </>
  );
};

export default UserDashBoard;
