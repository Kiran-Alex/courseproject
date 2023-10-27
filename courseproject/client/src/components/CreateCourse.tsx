import {useState}from "react";
import { FormControl, FormLabel, Input,Select,Heading, Button, ButtonGroup,useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const CreateCourse = () => {
    const [title, setTitle] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [price, setPrice] = useState<string>();
  const [imageLink, setImageLink] = useState<string>();
  const [Published, setPublished] = useState<string | boolean>();
  const navigate = useNavigate();
  const toast = useToast()
  
  return (
    <>
      {" "}
      <div className="mcont" style={{height : 600,flexDirection : "column"}}>
       
      <Heading style={{ paddingLeft: "10px" }}>Create Course</Heading>
      &nbsp;&nbsp;
      <FormControl width={300} isRequired>
        <FormLabel>Title</FormLabel>
        <Input
        isRequired
          onChange={(e)=>{setTitle(e.target.value)}}
        />
        <FormLabel>Description</FormLabel>
        <Input
        isRequired
          onChange={(e)=>{setDescription(e.target.value)}}
        />
        <FormLabel>Price</FormLabel>
        <Input
        isRequired
          onChange={(e)=>{setPrice(e.target.value)}}
        />
        <FormLabel>Image Link</FormLabel>
        <Input
        isRequired
          onChange={(e)=>{setImageLink(e.target.value)}}
        />
        <FormLabel>Published</FormLabel>
        <Select
        isRequired
          variant="outline"
          onChange={(e)=>{setPublished(e.target.value)}}
        >
          <option value="true">
           true
          </option>
          <option value= "false">
           false
          </option>
        </Select>
            <br/>
            <ButtonGroup spacing="28">
        <Button
         onClick={async()=>{  try{
            let publishedstatus:boolean;
            if(Published ==  undefined) {
                publishedstatus =  true
            }
            else if (Published == false){
                publishedstatus =  false
            }
            else {
                publishedstatus = true
            }
            const response  = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/createCourse`,{
                title: title,
                description: description,
                price: price,
                imageLink: imageLink,
                published: publishedstatus,
            },{
                headers : {
                    Authorization : localStorage.getItem(import.meta.env.VITE_LOCAL_KEY)
                }
            })

            if(response.status == 200 ) {
                toast({
                    title: "Course Created",
                    description: "Please Continue",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                  });
            }
            else {
                toast({
                    title: "Something went Wrong",
                    description:
                      "Please Try again later or Sigin again",
                    status: "warning",
                    duration: 3000,
                    isClosable: true,
                  });
            }

        }
        catch(err){
            toast({
                title: "Something went Wrong",
                description:
                  "Please Try again later or Signin again",
                status: "warning",
                duration: 3000,
                isClosable: true,
              });
            setTimeout(() => { 
                navigate("/admin/login");
              }, 3000);
        }}}>Create</Button>
        <Button variant="link" onClick={()=>navigate("/admin/dashboard")}>{"<- Back"}</Button> 
        </ButtonGroup>
      </FormControl>
      </div>
    </>
  );
};

export default CreateCourse;
