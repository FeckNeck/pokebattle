const express = require("express");
const jwt = require("jsonwebtoken");
const db = require("../database");
const router = express.Router();
const cookie = require("cookie-parser");

require("dotenv").config();
process.env.ACCESS_TOKEN_SECRET;

router.get("/", async (req, res) => {
  const response = await db.promise().query("SELECT * from users");
  res.status(200).send(response);
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const response = await db
      .promise()
      .query(
        `SELECT *, COUNT(*) as count FROM users WHERE email='${email}' AND password='${password}'`
      );
    const parsedResponse = response[0][0];
    if (parsedResponse.count == 1) {
      const user = {
        id: parsedResponse.iduser,
        name: parsedResponse.firstName,
        email: email,
      };
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        expires: new Date(Date.now() + 30 * 24 * 3600000),
      });
      res.status(200).send({
        accessToken: accessToken,
      });
    } else {
      console.log("xd");
      res.status(403).send("Invalid email or password");
    }
  } catch (error) {
    console.log("error:", error);
  }
});

router.post("/register", async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  try {
    const response = await db
      .promise()
      .query(`SELECT COUNT(*) as count FROM users WHERE email='${email}'`);
    const parsedResponse = response[0][0].count;
    if (parsedResponse == 0) {
      db.promise().query(`INSERT INTO users (email,password,firstName,lastName)
            VALUES('${email}','${password}','${firstName}','${lastName}')`);
      res.status(201).send({ msg: "Created user" });
    } else {
      res.status(403).send("Account already exists");
    }
  } catch (error) {
    console.log("error:", error);
  }
});

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1800s",
  });
}

function generateRefreshToken(user) {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "1y",
  });
}

function authentificateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).send();
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(401);
    }
    req.user = user;
    next();
  });
}

router.get("/account", authentificateToken, (req, res) => {
  res.send(req.user);
});

router.get("/logout", authentificateToken, (req, res) => {
  res.clearCookie("refreshToken");
  res.status(200).send("Deleted cookie");
});

router.get("/refreshToken", (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(401).send();
  }

  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(401).send();
    }
    delete user.iat;
    delete user.exp;
    const refreshToken = generateAccessToken(user);
    res.send({
      accessToken: refreshToken,
    });
  });
});

// router.post('/checkTokenValidity',authentificateToken,(req,res) =>{
//     res.status(201).send({msg:'Valid token'});
// });

// router.get("/cookie", function(req, res){
//     res.cookie('refreshToken','LMAO',{httpOnly:true});
//     res.status(200).send({
//         msg:'cookie send'
//     });
// })

router.get("/checkCookie", authentificateToken, function (req, res) {
  res.status(200).send("XD");
});

module.exports = router;
