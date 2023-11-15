import dotenv, { parse } from 'dotenv';
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bodyParser from 'body-parser';
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

interface CustomRequest extends Request {
  rawBody?: any;
}

let userdat: any;


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
      userdat = user.username
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



app.post("/create-checkout-session",async(req:Request,res:Response) => {
  try {
    const coursedata = req.body.coursedata;
    const session =  await stripe.checkout.sessions.create({
      metadata : {
        id : coursedata.id
      },
     
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
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    })
    res.json({
      url : session.url
    })
    
  }
  catch(err) {
    console.log(err)
  }
})

app.get('/checkout-session', async (req, res) => {
  const { sessionId } = req.query;
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  res.send(session);
});


const  purchasecourse = async (cid:object) => {
  const parsecid:any = {cid}
  try {
      const courseId = parsecid.cid.id;
      console.log(courseId , typeof courseId)
      if (courseId) {
        const existcourse = await Course.findById(courseId);
        if (existcourse) {
          const usern =userdat;
          if (usern) {
            const existuser = await User.findOne({ username: usern });
            if (existuser) {
              if (existuser.purchasedCourses.includes(existcourse._id)) {
               console.log({ message: "Course already purchased" });
              } else {
                existuser.purchasedCourses.push(existcourse._id);
                await existuser.save();
               console.log({ message: "Course Purchased Successfully" });
              }
            } else {
             console.log({ message: "Please Login" });
            }
          }
        } else {
         console.log({ message: "Invalid Course ID" });
        }
      } else {
       console.log({ message: "Course ID is invalid" });
      }
    } catch (err) {
      console.log(err);
     console.log({ message: "Server Error, please check logs" });
    }
 
 }

app.post('/webhook', bodyParser.raw({type: 'application/json'}) ,async (req:CustomRequest, res:Response) => {
  // const payload = req.body;
  // let signature = req.headers['stripe-signature'];
  let event = req.body
  let parseevent:any =  {event}
  // console.log(parseevent)
  // console.log(parseevent.event.type)

  if (parseevent.event.type === 'checkout.session.completed') {
    console.log(parseevent.event)
    console.log(`meta => : ${parseevent.event.data.object.metadata}`)
    console.log(`🔔  Payment received!`);
    await  purchasecourse(parseevent.event.data.object.metadata)

    // Note: If you need access to the line items, for instance to
    // automate fullfillment based on the the ID of the Price, you'll
    // need to refetch the Checkout Session here, and expand the line items:
    //
    // const session = await stripe.checkout.sessions.retrieve(
    //   'cs_test_KdjLtDPfAjT1gq374DMZ3rHmZ9OoSlGRhyz8yTypH76KpN4JXkQpD2G0',
    //   {
    //     expand: ['line_items'],
    //   }
    // );
    //
    // const lineItems = session.line_items;
  }
  else {
    
  }

  // Check if webhook signing is configured.
  // if (process.env.STRIPE_WEBHOOK_SECRET) {
  //   // Retrieve the event by verifying the signature using the raw body and secret.


  //   console.log(`rawBody : ${payload}`)
  //   console.log(`signature : ${signature}`)
  //   console.log( `webhook : ${process.env.STRIPE_WEBHOOK_SECRET}`)

  //   try {
  //     event = stripe.webhooks.constructEvent(
  //       payload,
  //       signature,
  //       process.env.STRIPE_WEBHOOK_SECRET
  //     );

     
  //     console.log("webhook signature verified ✅"  )
  //   } catch (err) {
  //     console.log(`⚠️  Webhook signature verification failed. : ${err}`);
  //     console.log(event)
  //     return res.sendStatus(400);
  //   }
  // } else {
  //   // Webhook signing is recommended, but if the secret is not configured in `.env`,
  //   // retrieve the event data directly from the request body.
  //   event = JSON.stringify(req.body.rawBody);
  // }



  res.sendStatus(200);
});


// app.post("/secret",async (req:Request,res:Response)=>{
//   const data:{
//     amount : number,
//     description : string
//   } = req.body 
//   try{
//   const paymentIntent = await stripe.paymentIntents.create({
//     amount: data.amount,
//     currency: 'inr',
//     description : `payment for ${data.description} course`,
//     payment_method_types: ['card'],
//   });
//   res.status(200).json({client_secret: paymentIntent.client_secret});}
//   catch(e) {
//     console.log(e)
//     res.status(401).json({
//       message : "secret error"
//     })
//   }
// })

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
