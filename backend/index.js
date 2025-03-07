const express = require("express");
const app = express();
const cors = require("cors");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const cookieParser = require("cookie-parser");
const session = require("express-session");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const user = require("./Source/login");
const knex = require("./Source/db");
const profile = require("./Source/profile");
// const files = require("./Source/profile");
const multer = require("multer");
const path = require("path");
const { resolveAny } = require("dns/promises");
const flash = require("connect-flash");

app.use(express.static("./public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(cookieParser());

app.use(
  session({
    key: "userId",
    secret: process.env.Session_secret, //any secret password
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 60 * 60 * 24 * 30,
      // expires: new Date(Date.now() + 60*60*12),
    },
  })
);

app.use(flash());

app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

/***********************************************/
//login

app.post("/userReg", (req, res) => {
  user.userRegister(req, res);
});

const loginVerify = async (req) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role;

    const result = await knex("user").where({ email, role }).select();

    if (result.length === 0) {
      return { auth: false, message: "User does not exist" };
    }

    const user = result[0];

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return { auth: false, message: "Invalid Password" };
    }

    const token = jwt.sign({ id: user.id }, "JWT_SECRET", {
      expiresIn: "1h",
    });

    const obj = {
      id: user.id,
      name: user.name,
      token,
    };

    req.session.user = obj;

    return {
      auth: true,
      token,
      message: "Successfully logged in",
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Login failed");
  }
};

app.post("/userVerification", (req, res) => {
  loginVerify(req)
    .then((result) => {
      // req.session.user = result;
      // res.cookie("user_sid", req.sessionID, { httpOnly: true, secure: false });
      res.json(result);
    })
    .catch((err) => console.log(err));
});

app.get("/userVerification", (req, res) => {
  console.log(req.session);
  if (req.session.user) {
    console.log(req.session.user);
    res.send({ loggedIn: true, user: req.session.user });
  } else {
    res.send({ loggedIn: false });
  }
});

// Middleware to check if user is authenticated
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  jwt.verify(token.split(" ")[1], "JWT_SECRET", (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Failed to authenticate token" });
    }

    req.user = decoded;
    next();
  });
};

const verifyJWT = (req, res, next) => {
  const token = req.headers["x-access-token"];
  console.log(req.session.user);
  if (!token) {
    res.send("We need a token please give us next time!");
  } else {
    jwt.verify(token, "JWT_SECRET", (err, decoded) => {
      if (err) {
        res.json({
          auth: false,
          message: "you failed to authenticate",
        });
      } else {
        req.userId = decoded.id;
        next();
      }
    });
  }
};
app.get("/isUserAuthentic", verifyJWT, (req, res) => {
  res.send("You are authenticated, Congrats!!");
});

// app.post("/api/v1/auth/google/verify", (req, res) => {
//   user
//     .gmailVerify(req)
//     .then((result) => {
//       res.json(result);
//     })
//     .catch((err) => console.log(err));
// });

// app.post("/api/v1/auth/google", (req, res) => {
//   user.gmailRegister(req, res);
// });

app.get("/logout", (req, res) => {
  // console.log(`beforeClearCookie: ${req.session}`);
  res.clearCookie("userId");
  // console.log(`afterClearCookie: ${req.session}`);
  res.clearCookie("session-token");
  if (req.session.user) {
    req.session.destroy();
  }
  res.send("done");
});

/*****************************************/

//     Get Profile       //

//Use of Multer
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./public/images/");
  },
  filename: (req, file, callback) => {
    callback(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
});

app.post("/getProfile", authenticateToken, (req, res) => {
  profile.getProfile(req).then((result) => {
    res.send(result);
    // //console.log(result)
  });
});
app.post("/removePhoto", authenticateToken, (req, res) => {
  profile.removePhoto(req);
});

app.post("/upload", authenticateToken, upload.single("file"), (req, res) => {
  // console.log(req.file);
  // console.log(req.body.id);
  let imgsrc = "http://localhost:3002/images/" + req.file.filename;
  knex("user")
    .where({ id: req.body.id })
    .update({
      contact: req.body.contact,
      name: req.body.name,
      photo: imgsrc,
    })
    .then((result) => {
      //console.log(result)
      console.log("file uploaded");
      res.send("updated");
    });
});
app.post("/updateProfile", authenticateToken, (req, res) => {
  knex("user")
    .where({ id: req.body.id })
    .update({
      contact: req.body.contact,
      name: req.body.name,
    })
    .then((result) => {
      //console.log(result)
      console.log("file uploaded");
      res.send("updated");
    });
});
/*************************************************** */
// uploadFile
const storage2 = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./public/file/");
  },
  filename: (req, file, callback) => {
    callback(null, Date.now() + path.extname(file.originalname));
  },
});

const upload2 = multer({
  storage: storage2,
});
app.post(
  "/uploadFile",
  authenticateToken,
  upload2.single("file"),
  (req, res) => {
    // console.log(req.file);
    let fileSrc = "http://localhost:3002/file/" + req.file.filename;
    knex("file")
      .insert({
        courseId: req.body.courseId,
        file: fileSrc,
        file_name: req.body.fileName,
      })
      .then((result) => {
        //console.log(result)
        console.log("file uploaded");
        res.send("ok");
      });
  }
);

app.get("/getFile", (req, res) => {
  knex("file")
    .select("file", "file_name", "fileId")
    .where({ courseId: req.query.courseId })
    .then((result) => res.send(result));
});

/*********************************** */
//upload an assignments

const storage3 = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./public/assignments/");
  },
  filename: (req, file, callback) => {
    callback(null, Date.now() + path.extname(file.originalname));
  },
});

const upload3 = multer({
  storage: storage3,
});
app.post(
  "/uploadAssignment",
  authenticateToken,
  upload3.single("file"),
  (req, res) => {
    let fileSrc = "http://localhost:3002/assignments/" + req.file.filename;
    knex("assignment")
      .insert({
        courseId: req.body.courseId,
        file: fileSrc,
        fileName: req.body.fileName,
        title: req.body.title,
        topic: req.body.topic,
        deadline: req.body.deadline,
      })
      .then((result) => {
        //console.log(result)
        console.log("file uploaded");
        res.send("done");
      });
  }
);

app.post("/getAssignments", authenticateToken, (req, res) => {
  knex("assignment")
    .select()
    .where({ courseId: req.body.id })
    .then((result) => res.send(result));
});
app.post("/getAttemptedAssignments", authenticateToken, (req, res) => {
  const query = `select asg.assignmentId, asg.courseId, asg.file, asg.fileName, title, topic, deadline from assignment as asg,assignment_submission as ass where asg.assignmentId=ass.assignmentId and asg.courseId=${req.body.id} and studentId=${req.body.studentId}`;
  knex.raw(query).then((result) => {
    res.send(result);
  });
});
app.post("/getUnAttemptedAssignments", authenticateToken, (req, res) => {
  const query = `select * from assignment where assignmentId not in (select assignmentId from assignment_submission where studentId=${req.body.studentId}) and courseId=${req.body.id}`;
  knex.raw(query).then((result) => {
    res.send(result);
  });
});

/*************************************/
// upload Submission assignments
const storage4 = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./public/StudentAssignmentSubmission/");
  },
  filename: (req, file, callback) => {
    callback(null, Date.now() + path.extname(file.originalname));
  },
});

const upload4 = multer({
  storage: storage4,
});
app.post(
  "/uploadMyAssignment",
  authenticateToken,
  upload4.single("file"),
  (req, res) => {
    console.log(req.file);
    let fileSrc =
      "http://localhost:3002/StudentAssignmentSubmission/" + req.file.filename;
    knex("assignment_submission")
      .insert({
        courseId: req.body.courseId,
        studentId: req.body.studentId,
        assignmentId: req.body.assignmentId,
        file: fileSrc,
        fileName: req.body.fileName,
        roll: req.body.roll,
        comment: req.body.comment,
        late: req.body.late,
      })
      .then((result) => {
        //console.log(result)
        console.log("file uploaded");
        res.send("hi");
      });
  }
);

app.post("/deleteMyAssignment", authenticateToken, (req, res) => {
  knex("assignment_submission")
    .where({ assignmentId: req.body.assignmentId })
    .del()
    .then((result) => {
      //console.log(result)
      console.log("succesffuly deleted");
      res.send("deleted..");
    });
});

app.post("/getMyAssignments", authenticateToken, (req, res) => {
  knex("assignment_submission")
    .where({
      assignmentId: req.body.assignmentId,
      studentId: req.body.studentId,
    })
    .select("file", "fileName", "comment", "roll", "late")
    .then((result) => {
      //console.log(result)
      res.send(result);
    });
});

app.post("/viewStudentAssignmentSubmission", authenticateToken, (req, res) => {
  const query = `select file,fileName,comment,roll,late,name,photo,assignment_submissionId from assignment_submission as ass, user where ass.studentId=user.id and user.role='Student' and ass.assignmentId=${req.body.assignmentId}`;
  knex
    .raw(query)
    .then((result) => {
      res.send(result);
    })
    .then((err) => {
      console.log(err);
    });
});

/********************************** */
// Add new course

app.post("/publishCourse", authenticateToken, (req, res) => {
  knex("courses")
    .insert({
      courseName: req.body.courseName,
      credits: req.body.credit,
      bio: req.body.desc,
      teacherId: req.body.id,
      prerequisite: req.body.prereq,
    })
    .then((result) => {
      //console.log(result)
      console.log("Inserted");
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/getCourseList", (req, res) => {
  knex("courses")
    .join("user", "teacherId", "=", "id")
    .select(
      "courseId",
      "courseName",
      "credits",
      "bio",
      "prerequisite",
      "name",
      "photo"
    )
    .then((result) => {
      //console.log(result)
      res.send(result);
    });
});

app.post("/enrollMe", authenticateToken, (req, res) => {
  knex("studies")
    .insert({
      studentId: req.body.studentId,
      courseId: req.body.courseId,
      status: req.body.status,
    })
    .then((result) => {
      //console.log(result)
      res.send("You are Successfully enrolled");
    });
});

app.post("/getMyCourses", authenticateToken, (req, res) => {
  knex("courses")
    .join("studies", "courses.courseId", "=", "studies.courseId")
    .where({ studentId: req.body.id })
    .join("user", "teacherId", "=", "id")
    .select(
      "courses.courseId",
      "courseName",
      "credits",
      "bio",
      "prerequisite",
      "name",
      "photo"
    )
    .then((result) => {
      //console.log(result)
      res.send(result);
    });
});

app.post("/getTeacherCourse", authenticateToken, (req, res) => {
  knex("courses")
    .select("courseId", "courseName", "credits", "bio", "prerequisite")
    .where({ teacherId: req.body.id })
    .then((result) => {
      //console.log(result)
      res.send(result);
    });
});

/***************************************************/
//Announcement
app.post("/createAnnouncement", authenticateToken, (req, res) => {
  knex("announce")
    .insert({
      courseId: req.body.id,
      announcement: req.body.announcement,
    })
    .then((result) => {
      //console.log(result)
      res.send(result);
    });
});

app.post("/getAnnouncement", authenticateToken, (req, res) => {
  // console.log(req.body.id);
  knex("announce")
    .select()
    .where({ courseId: req.body.id })
    .then((result) => {
      //console.log(result)
      res.send(result);
    });
});

/************************************ */
// Quiz
app.post("/createQuizInfo", authenticateToken, (req, res) => {
  knex("quiz")
    .insert({
      courseId: req.body.id,
      title: req.body.title,
      instruction: req.body.instruction,
      topic: req.body.topic,
      duration: req.body.duration,
    })
    .then((result) => {
      //console.log(result)
      knex("quiz")
        .max("quizId", { as: "id" })
        .then((resu) => {
          // console.log(resu);
          res.send(resu);
        });
    });
});
app.post("/getQuizInfo", authenticateToken, (req, res) => {
  knex("quiz")
    .where({ quizId: req.body.quizId })
    .select()
    .then((result) => {
      res.send(result);
    });
});
app.post("/getAllQuizes", authenticateToken, (req, res) => {
  knex("quiz")
    .where({ courseId: req.body.id })
    .select()
    .then((result) => {
      res.send(result);
    });
});
app.post("/getUnattemptedQuizes", authenticateToken, (req, res) => {
  const query = `select * from quiz where quizId not in (select quizId from grade where studentId=${req.body.studentId}) and courseId=${req.body.id}`;
  knex.raw(query).then((result) => {
    res.send(result);
  });
});
app.post("/getAttemptedQuizes", authenticateToken, (req, res) => {
  const query = `select quiz.quizId, studentId, score, title, duration, topic, totalQues, totalMarks from quiz,grade where quiz.quizId=grade.quizId and courseId=${req.body.id} and studentId=${req.body.studentId}`;
  knex.raw(query).then((result) => {
    res.send(result);
  });
});
// app.post("updateQuizStats",(req,res)=>{
//   knex("quiz").where({quizId:req.body.quizId}).update({
//     totalQues:req.body.totalQues,
//     totlaMarks:req.body.totalMarks,
//   }).then((result)=>{
//     //console.log(result)
//     // res.send(result);
//   })
// })
app.post("/addQues", authenticateToken, (req, res) => {
  knex("quiz_question")
    .insert(req.body)
    .then((result) => {
      //console.log(result)
      console.log("Sucesfully Inserted");
      knex("quiz")
        .where({ quizId: req.body.quizId })
        .increment({
          totalQues: 1,
          totalMarks: req.body.maxScore,
        })
        .then((resu) => {
          // console.log(resu);
          res.send("Successfully added the question");
        });
    })
    .catch((err) => console.log(err));
});

app.post("/getQues", authenticateToken, (req, res) => {
  // console.log(req.body);
  knex("quiz_question")
    .where({ quizId: req.body.quizId })
    .select()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => console.log(err));
});
app.post("/editQuestion", authenticateToken, (req, res) => {
  knex("quiz_question")
    .where({ questionId: req.body.questionId })
    .update(req.body)
    .then((result) => {
      res.send("hu");
    })
    .catch((err) => console.log(err));
});
app.post("/updateTotalMarks", authenticateToken, (req, res) => {
  knex("quiz")
    .where({ quizId: req.body.quizId })
    .increment({ totalMarks: req.body.diff })
    .then((result) => {
      res.send("incremented");
    })
    .catch((err) => console.log(err));
});
// app.delete("/deleteQues/:questionNo", (req, res) => {
//   console.log("hi server trying to delete");
//   knex("quiz_question")
//     .where("questionNo", req.params.questionNo)
//     .del()
//     .then((result) => {
//       //console.log(result)
//       console.log("succesfuly deleted");
//     });
// });
app.post("/deleteQues", authenticateToken, (req, res) => {
  console.log("hi server trying to delete");
  knex("quiz_question")
    .where({ questionId: req.body.questionId })
    .del()
    .then((result) => {
      //console.log(result)
      console.log("succesfuly deleted");
      knex("quiz")
        .where({ quizId: req.body.quizId })
        .increment({
          totalQues: -1,
          totalMarks: -req.body.maxScore,
        })
        .then((resu) => {
          // console.log(resu);
          res.send("Successfully deleted the question");
        });
    });
});

app.post("/updateMaxScore", authenticateToken, (req, res) => {
  knex("quiz_question")
    .where({ questionId: req.body.questionId })
    .update("maxScore", req.body.score)
    .then((result) => {
      //console.log(result)
      knex("quiz")
        .where({ quizId: req.body.quizId })
        .increment({
          totalMarks: req.body.diff,
        })
        .then((resu) => {
          // console.log(resu);
          res.send("Updated successfully");
        });
    });
});
app.post("/updatePenaltyScore", authenticateToken, (req, res) => {
  knex("quiz_question")
    .where({ questionId: req.body.questionId })
    .update("penaltyScore", req.body.penaltyScore)
    .then((result) => {
      //console.log(result)
    });
});
app.post("/deleteQuiz", authenticateToken, (req, res) => {
  knex("quiz")
    .where({ quizId: req.body.quizId })
    .del()
    .then((result) => {
      console.log("deleted..");
      res.send(200);
    });
});

app.post("/insertQuizResponse", authenticateToken, (req, res) => {
  knex("quiz_response")
    .insert(req.body.arr)
    .then((result) => {
      knex("grade")
        .insert({
          quizId: req.body.quizId,
          studentId: req.body.studentId,
          score: req.body.score,
        })
        .then((resu) => {
          // console.log(resu);
          res.send("done");
        });
    });
});

app.post("/getScoreAndResponse", authenticateToken, (req, res) => {
  // knex("quiz_response AS qr").join("quiz_question As qq").on('qr.quizId','=','qq.quizId').andOn('qr.questionId','=','qq.questionId').andOn('qr.studentId','=',req.body.studentId).andOn('qr.quizId','=',req.body.quizId).select('questionName,maxScore,penaltyScore,answer,opt1,opt2,opt3,opt4,qq.questionId,response,marks')
  const query = `select questionName,maxScore,penaltyScore,answer,opt1,opt2,opt3,opt4,qq.questionId,response,marks from quiz_response AS qr, quiz_question As qq where qr.quizId = qq.quizId and qr.questionId = qq.questionId and qr.studentId=${req.body.studentId} and qq.quizId=${req.body.quizId}`;
  // console.log(query);
  knex.raw(query).then((result) => {
    //console.log(result)
    res.send(result);
  });
});
app.post("/getGrade", authenticateToken, (req, res) => {
  knex
    .raw(
      `select title,duration,topic,totalQues,totalMarks,score from quiz,grade where quiz.quizId=grade.quizid and studentId=${req.body.studentId} and quiz.quizId=${req.body.quizId}`
    )
    .then((result) => {
      //console.log(result)
      res.send(result);
    });
});

/*******************************************/
//Doubt
app.post("/askDoubt", authenticateToken, (req, res) => {
  knex("doubt")
    .insert(req.body)
    .then((result) => {
      //console.log(result)
    });
});

app.get("/getDoubtList", (req, res) => {
  knex("doubt")
    .join("user", "doubt.askerId", "=", "user.id")
    .select(
      "name",
      "photo",
      "doubtId",
      "question",
      "title",
      "topic",
      "status",
      "askerId"
    )
    .then((result) => {
      //console.log(result)
      res.send(result);
    });
});

app.post("/addDoubtAnswer", authenticateToken, (req, res) => {
  knex("doubt_ans")
    .insert(req.body)
    .then((result) => {
      //console.log(result)
      res.send("done");
    });
});
app.post("/getDoubtAnswers", authenticateToken, (req, res) => {
  const query = `select name,photo,doubt_ans,doubt_ansId from doubt_ans as ds, user where ds.replierId=user.id and doubtId=${req.body.doubtId}`;
  knex
    .raw(query)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

/*******************************************/
app.listen(3002, () => {
  console.log("listing on port 3002");
});
