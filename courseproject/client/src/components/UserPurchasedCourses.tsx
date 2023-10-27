import {
    SimpleGrid,
    Heading,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Image,
    Text,
    useToast,
  } from "@chakra-ui/react";
  import "../styles/AdminDashBoard.css";
  import { useState, useEffect } from "react";
  import axios from "axios";
  import { useNavigate } from "react-router-dom";
  import { useSetRecoilState } from "recoil";
  import { navam } from "../../store/atoms/navbaratom";
  import {ArrowBackIcon} from '@chakra-ui/icons'
  
  const UserPurchasedCourses = () => {
    const [courses, setCourses] = useState<course>();
    const toast = useToast();
    const navigate = useNavigate();
    const navamset = useSetRecoilState(navam);
    navamset("Dash");

    type course = {
      map(arg0: (course: { price: string | number; imageLink: string; title: string; description: string; published: boolean; _id: string; }) => import("react/jsx-runtime").JSX.Element): import("react").ReactNode;
      price: number | string;
      imageLink: string;
      title: string;
      description: string;
      published?: boolean;
      _id?: string;
}
  
    const getData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/purchasedCourses`, {
          headers: {
            authorization: localStorage.getItem(import.meta.env.VITE_LOCAL_KEY),
          },
        });
       
        setCourses(response.data.purchasedCourses);
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
            <p id="pq1" onClick={()=>{navigate("/dashboard")}} style={{marginLeft: 10 , marginBottom: 10}}><ArrowBackIcon/> Back</p>
            <Heading style={{ paddingLeft: "10px" }}>Purchased Courses</Heading>
            <br />
            <br />
            <style>
        {`
         .css-1zgvnh  {
            display: none;
          }
        `}</style>
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
  
  export default UserPurchasedCourses;
  