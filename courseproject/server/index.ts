import dotenv from 'dotenv';
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();
const stripe = require('stripe')(process.env.STRIPE_KEY);
const port:number = 3000;
const adminschema = new mongoose.Schema({
  username: String,
  password: String,
});

const userschema = new mongoose.Schema({
  username: String,
  password: String,
  purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
});

const courseschema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  imageLink: String,
  published: Boolean,
});

const User = mongoose.model("User", userschema);
const Admin = mongoose.model("Admin", adminschema);
const Course = mongoose.model("Course", courseschema);

mongoose.connect(
  process.env.DATABASE_URL
);
const secret = process.env.SECRET;

interface inputs {
  username: String;
  password: String;
}
interface Courseinput {
  title: String;
  description: String;
  price: Number;
  imageLink: String;
  published: Boolean;
}

const authinecatejwt = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const auth = req.headers.authorization;
    if (auth === undefined) {
      return res.status(401).json({
        message: "authorization Missing",
      });
    }
    const token = auth.split(" ")[1];
    jwt.verify(token, secret, (err, user) => {
      if (err) {
        return res.status(401).json({
          message: "The authorization is not valid",
        });
      }
      if (user === undefined) {
        return res.status(400);
      }
      if (typeof user === "string") {
        return res.status(401);
      }
      req.headers["user"] = user.username;
      next();
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({message : "Server Error please Check Logs"})
  }
};



app.post("/admin/signup", async (req: Request, res: Response) => {
  try {
    const data: inputs = req.body;
    const existadmin = await Admin.findOne({
      username: data.username,
      password: data.password,
    });
    if (existadmin) {
      res.status(400).json({
        message: "The user already exists",
      });
    } else {
      const newadmin = new Admin({
        username: data.username,
        password: data.password,
      });
      await newadmin.save();
      const token = jwt.sign({ username: data.username }, secret, {
        expiresIn: "1h",
      });
      res.status(200).json({
        message: "Admin created successfully",
        token,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({message : "Server Error please Check Logs"})
  }
});

app.post("/admin/signin", async (req: Request, res: Response) => {
  try {
    const data = req.headers;

    const existadmin = await Admin.findOne({
      username: data.username,
      password: data.password,
    });
    if (existadmin) {
      const token = jwt.sign({ username: data.username }, secret, {
        expiresIn: "1h",
      });

      res.status(200).json({
        message: "Logged in Successfully",
        token,
      });
    } else {
      res.status(400).json({
        message: "please sign up",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({message : "Server Error please Check Logs"})
  }
});

app.post(
  "/admin/createCourse",
  authinecatejwt,
  async (req: Request, res: Response) => {
    try {
      const data: Courseinput = req.body;
      if (data != undefined || null) {
        const newCourse = new Course(data);
        await newCourse.save();
        res.status(200).json({
          message: "Course Created",
        });
      } else {
        res.status(401).json({
          message: "please enter corse details",
        });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({message : "Server Error please Check Logs"})
    }
  }
);

app.put(
  "/admin/updateCourse/:courseId",
  authinecatejwt,
  async (req: Request, res: Response) => {
    try {
      const courseId = req.params.courseId;
      const data = req.body;
      if (courseId === undefined || null) {
        res.status(401).json({
          message: "please provide the courseId",
        });
      }
      if (data === undefined || null) {
        res.status(401).json({
          message: "please provide the body",
        });
      }
      const updatedcourse = await Course.findByIdAndUpdate(courseId, data, {
        new: true,
      });
      if (updatedcourse) {
        res.status(200).json({
          message: "Course Updated",
        });
      } else {
        res.status(400).json("Course Not Updated");
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({message : "Server Error please Check Logs"})
    }
  }
);

app.get(  "/admin/courses",  authinecatejwt,  async (req: Request, res: Response) => {try{
    const Courses = await Course.find({});
    res.status(200).json({
      courses: Courses,
    });}
    catch(err){
      console.log(err)
      res.status(500).json({message : "Server Error please Check Logs"})
    }
  }
);

// users
app.post("/user/signup", async (req: Request, res: Response) => {
  try {
    const data: inputs = req.body;
    let existUser = await User.findOne({
      username: data.username,
      password: data.password,
    });
    if (existUser) {
      res.status(401).json({ message: "the user already exits" });
    }
    const newuser = new User(data);
    newuser.save();
    res.status(200).json({
      message: "Successfully signed up ",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({message : "Server Error please Check Logs"})
  }
});

app.post("/user/login", async (req: Request, res: Response) => {
  try {
    const data = req.headers;
    const existuser = await User.findOne({
      username: data.username,
      password: data.password,
    });
    if (existuser) {
      const token = jwt.sign({ username: data.username }, secret, {
        expiresIn: "1h",
      });
      res.status(200).json({ message: "Successfully logged in ", token });
    } else{
    res.status(401).json({ message: "Invalid Credentials" });}
  } catch (err) {
    console.log(err);
    res.status(500).json({message : "Server Error please Check Logs"})
  }
});
app.post("/user/purchaseCourse/:courseId", authinecatejwt, async (req: Request, res: Response) => {
  try {
    const courseId = req.params.courseId;
    if (courseId) {
      const existcourse = await Course.findById(courseId);
      if (existcourse) {
        const usern = req.headers["user"];
        if (usern) {
          const existuser = await User.findOne({ username: usern });
          if (existuser) {
            if (existuser.purchasedCourses.includes(existcourse._id)) {
              res.status(401).json({ message: "Course already purchased" });
            } else {
              existuser.purchasedCourses.push(existcourse._id);
              await existuser.save();
              res.status(200).json({ message: "Course Purchased Successfully" });
            }
          } else {
            res.status(401).json({ message: "Please Login" });
          }
        }
      } else {
        res.status(401).json({ message: "Invalid Course ID" });
      }
    } else {
      res.status(401).json({ message: "Course ID is invalid" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error, please check logs" });
  }
});


app.post("/create-checkout-session",async(req:Request,res:Response) => {
  try {
    const coursedata = req.body.coursedata;
    const session =  await stripe.checkout.sessions.create({
     
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: coursedata.title,
            },
            unit_amount:coursedata.price*100,
          },
          quantity: 1,
        },
      ],
      mode : "payment",
      success_url: 'http://localhost:5173/success',
      cancel_url: 'http://localhost:5173/cancel',
    })
    res.json({
      url : session.url
    })
    
  }
  catch(err) {
    console.log(err)
  }
})

app.get("/user/purchasedCourses",  authinecatejwt,  async (req: Request, res: Response) => {
   try {
    const existUser = req.headers["user"];
    if (existUser) {
      const existuser1 = await User.findOne({ username: existUser }).populate(
        "purchasedCourses"
      );
      if (existuser1) {
        const allcourses = existuser1.purchasedCourses;
        res.status(201).json({ purchasedCourses: allcourses });
      } else {
        res
          .status(401)
          .json({ message: "please provide username,  please signin" });
      }
    } else {
      res
        .status(401)
        .json({ message: "please provide username,  please signin" });
    }
  }
  catch(err){
    console.log(err);
    res.status(500).json({message : "Server Error please Check Logs"})
  }}
);

app.get("/user/Courses",authinecatejwt,async(req:Request,res:Response)=>{
  try{
  const allCourses = await  Course.find({})
  if(allCourses) {
    res.status(200).json({courses  :allCourses})
  }
  else {
    res.status(401).json({message :" please signin"})
  }
}
catch(err) {
  console.log(err)
  res.status(500).json({message : "Server Error please Check Logs"})
}

})

app.get("/user/name",authinecatejwt,async(req:Request,res:Response)=>{
  try{
  const username = req.headers["user"]
  res.status(200).json({username})}
  catch(err){
    console.log(err)
    res.status(500).json({message : "Server Error please Check Logs"})
  }
})

if (isNaN(port)) {
  console.error("Invalid PORT value in .env file");
  process.exit(1); 
}


app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
