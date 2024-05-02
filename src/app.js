const express = require("express");
const mysql = require("mysql");
const ejs = require("ejs");
const cors = require("cors");
const app = express();
const path = require("path");
const PDFDocument = require('pdfkit');
const fs = require('fs');
const bcrypt = require("bcryptjs");

var bodyparser = require("body-parser");
const PORT = process.env.PORT || 8002;
const static_path = path.join(__dirname, "../public");
const jwt = require("jsonwebtoken");
var session = require("express-session");
const cookieParser = require("cookie-parser");
const { log } = require("console");
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");
const emailTemplate = `


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Email Template</title>
</head>
<body>
    <h1>Your OTP for reset password  is: <%= otp %></h1>
    <h2>Please use this OTP to complete your reset password process thanks for login.</h2>
</body>
</html>
`;

// Create a Nodemailer transporter

// app.use(express.static(static_path));
// app.use(express.static(path.join(__dirname, 'public')));
// Set the view engine to EJS
app.set("view engine", "ejs");
app.use(express.json());

app.use(express.static("public")); //booh.js
app.use(express.urlencoded({ extended: false }));
// Set the directory for your views (HTML files)
app.set("views", path.join(__dirname, "..", "public"));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(session({ secret: "secret" }));
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "..", "public")));
// Use cookie-parser middleware
app.use(cookieParser());
app.use(express.json());
app.use(cors());
app.use(bodyparser.json());


/////////////////////////////////////////////////////////////////// MAIN CODE START FROM HERE ///////////////////////////////////////////////////////////////////////////

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "project",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL: " + err);
    return;
  }
  console.log("data base connected");
});

////////////////////////////////////////////////////////////////////////////////   HOME PAGE GET  ////////////////////////////////////////////////////////////////////////

app.get("/", (req, res) => {
  res.render("homepage2");
});

////////////////////////////////////////////////////////////////////   FORGOT PAGE GET AND POST AND ALL LOGIC   /////////////////////////////////////////////////////////

app.get("/forgott", (req, res) => {
  res.render("forgot2", { errorMessage: "" }); // Pass an empty errorMessage initially
});
app.get("/resetpassword", (req, res) => {
  res.render("resetpassword");
});

app.post("/restpass", (req, res) => {
  const { newPassword, confirmPassword, uname } = req.body;
  console.log(newPassword);
  console.log("update for ", uname);

  // Hash both the new password and confirm password
  bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
    if (err) {
      console.error("Error hashing password: ", err);
      return res.status(500).send("Error updating password");
    }

    bcrypt.hash(confirmPassword, 10, (err, hashedConfirmPassword) => {
      if (err) {
        console.error("Error hashing confirm password: ", err);
        return res.status(500).send("Error updating password");
      }

      // Update the hashed passwords in the database
      connection.query(
        `UPDATE cust SET password='${hashedPassword}', confirmpassword='${hashedConfirmPassword}' WHERE email='${uname}';`,
        (error, results, fields) => {
          if (error) {
            console.log(error);
            return res.status(500).send("Error updating password");
          } else {
            console.log(results.affectedRows);
            if (results.affectedRows !== 0) {
              res.redirect("/sign");
            }
          }
        }
      );
    });
  });
});

// kamu

app.post("/forgott", (req, res) => {
  const { uname, otp } = req.body;
  const u = req.session.uname || "";
  console.log(uname + " forgot api 1");
  const errorMessage = "Invaild OTP";

  if (otps[uname] === otp) {
    console.log(otps[uname]);

    res.render("resetpassword", { uname: uname });

    delete otps[uname];
  } else {
    
    res.render("forgot2", { errorMessage: errorMessage });
  }
});

// app.post("/forgott", (req, res) => {
//   const { uname, otp } = req.body;
//   if (otps[uname] === otp) {
//     delete otps[uname];
//     res.render('resetpassword', { uname: uname });
//   } else {
//     res.render('forgot2', { errorMessage: "Invalid OTP" });
//   }
// });

// me

// app.post("/forgott", (req, res) => {
//   const { uname, otp } = req.body;
//   console.log(uname + " forgot api 1");
//   if (otps[uname] === otp) {
//     console.log(otps[uname]);
//     res.render('resetpassword', { uname: uname });
//     delete otps[uname];
//   } else {
//     // Render the forgot template with error message
//     res.render('forgot2', { errorMessage: "Invalid OTP" });
//   }
// })


const otps = {};

app.post("/sendotp", (req, res) => {
  const data = req.body;
  const errorMessage = "User Not Found";

  connection.query(
    `SELECT * FROM cust WHERE email="${data.uname}"; `,
    (error, results, fields) => {
      if (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        if (results[0] === undefined) {
          // User not found
          console.log("user not found");
          res.status(200).json({ errorMessage: "Email doesn't  match" });
        } else {
          // User found
          console.log(results);

          const otp = otpGenerator.generate(6, {
            digits: true,
            alphabets: false,
            upperCase: false,
            specialChars: false,
          });

          otps[data.uname] = otp;
          // Send OTP email
          sendOTPEmail(data.uname, otp);

          res.status(200).json({ successMessage: "OTP sent successfully." });
        }
      }
    }
  );
});




//me
// const otps = {};
// app.post("/sendotp", (req, res) => {
//   const data = req.body;
//   console.log(data + "sendOTP api");
//   connection.query(
//     `SELECT * FROM students WHERE email="${data.uname}"; `,
//     (error, results, fields) => {
//       if (error) {
//         console.log(error);
//         // Handle database error
//         res.status(500).send("Internal Server Error");
//       } else {
//         console.log(typeof results);
//         if (results[0] === undefined) {
//           console.log("user not found");
//           // Render the forgot2 template with error message
//           res.render('forgot2', { errorMessage: "Email not found" });
//         } else {
//           console.log(results);
//           const otp = "1";
//           otps[data.uname] = otp;
//           // Send OTP email
//           sendOTPEmail(data.uname, otp);
//           res.status(200).send("OTP sent successfully.");
//         }
//       }
//     }
//   );
// });

// Other routes and middleware...
const transporter = nodemailer.createTransport({
  // Provide your SMTP settings here
  service: "gmail",
  auth: {
    user: "mandarghadigaonkar7@gmail.com", // Your email address
    pass: "bqat icqg dwng dxfe", // Your password
  },
});

// Function to send OTP email
function sendOTPEmail(toEmail, otp) {
  // Compile the template
  const compiledEmailTemplate = ejs.compile(emailTemplate);
  const htmlEmail = compiledEmailTemplate({ otp: otp });

  // Define email options
  const mailOptions = {
    from: "mandarghadigaonkar7@gmail.com", // Sender address
    to: toEmail, // Receiver address
    subject: "OTP for Login", // Subject line
    html: htmlEmail, // Email content in HTML format
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
}

// POST route for /opt
app.post("/opt", (req, res) => {
  const { email } = req.body;
  console.log(req.body);
  // const email="mandarghadigaonkar@gmail.com"
  // Generate a random OTP
  const otp = otpGenerator.generate(6, {
    digits: true,
    alphabets: false,
    upperCase: false,
    specialChars: false,
  });

  // Send OTP email
  sendOTPEmail(email, otp);

  res.status(200).send("OTP sent successfully.");
});

///////////////////////////////////////////////////////////////// FORGOT PASSWORD END HERE //////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////// POLICY PAGE GET HERE ///////////////////////////////////////////////////////////////////////////////

app.get("/policy", (req, res) => {
  res.render("policy");
});

///////////////////////////////////////////////////////////////////// POLICY END HERE //////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////// USER SIGNIN AND SIGNUP LOGIC START HERE /////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////    ALL GET AND POST AND JWT TOKEN   ////////////////////////////////////////////////////////////

app.get("/users", (req, res) => {
  connection.query("SELECT * FROM students", (error, results, fields) => {
    if (error) {
      console.log(error);
    } else {
      console.log(results);
      // res.json(results);cls
      res.send(results);
    }
  });
});

app.post("/sign", (req, res) => {
  const { name, clas, contact, email, password, confirmpassword, gender } = req.body;

  // Check if password matches confirm password
  if (password !== confirmpassword) {
    return res.render("registration", {
      errorMessage: "Passwords do not match",
    });
  }

  // Hash the password
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error("Error hashing password: ", err);
      return res.status(500).send("Error registering user");
    }

    // Store the hashed password in the database
    connection.query(
      "INSERT INTO cust (name, clas, contact, email, password, gender) VALUES (?, ?, ?, ?, ?, ?)",
      [name, clas, contact, email, hashedPassword, gender],
      (error, results, fields) => {
        if (error) {
          // Handle unique email constraint error
          if (error.code === "ER_DUP_ENTRY") {
            return res.render("registration", {
              errorMessage: "Email already exists",
            });
          } else {
            console.log(error);
            return res.status(500).send("Error registering user");
          }
        }

        // Generate JWT token
        const accessToken = jwt.sign(
          { email: email },
          "mynameismandariamdoingprojectononlinebookrentalsystem",
          { expiresIn: "2h" }
        );
        console.log("Generated token:", accessToken);
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          maxAge: 60 * 60 * 1000,
        });
        res.redirect("/sign");
        console.log("User added:", name, clas, contact, email, hashedPassword, gender);
      }
    );
  });
});

app.get("/regi", (req, res) => {
  res.render("registration", { errorMessage: "" });
});



app.get("/sign", (req, res) => {
  const errorMessage = req.query.error || "";
  res.render("sigin", { errorMessage: errorMessage });
});


// Sign-In Endpoint
app.post("/home", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM cust WHERE email = ?";
  connection.query(sql, [email], (err, results) => {
    if (err) {
      console.error("Error retrieving user: ", err);
      return res.send("Error logging in");
    }
    if (results.length === 0) {
      return res.redirect("/sign?error=Email not registered");
    }

    const user = results[0];
    // Compare the hashed password
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        console.error("Error comparing passwords: ", err);
        return res.send("Error logging in");
      }
      if (!result) {
        // Password doesn't match, redirect to sign-in page with error
        return res.redirect("/sign?error=Incorrect email or password");
      }

      // Password matches, generate JWT token
      const accessToken = jwt.sign(
        { email: user.email },
        "mynameismandariamdoingprojectononlinebookrentalsystem",
        { expiresIn: "2h" }
      );
      console.log("Generated token:", accessToken);

      // Set JWT in a cookie (optional)
      res.cookie("jwt", accessToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000,
      });

      // Store user information in session
      req.session.user = {
        email: user.email,
        name: user.name,
        contact: user.contact,
        clas: user.clas,
        // Add other user information you want to store
      };

      // Redirect to dashboard
      res.redirect("/dashboard");
    });
  });
});

// Verify JWT token
function authenticateToken(req, res, next) {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).send("Token not provided");
  }

  jwt.verify(
    token,
    "mynameismandariamdoingprojectononlinebookrentalsystem",
    (err, decoded) => {
      if (err) {
        console.error("Error verifying token: ", err);
        return res.status(403).send("Invalid token");
      }
      req.user = decoded;
      next();
    }
  );
}

//////////////////////////////////////////////////////////////// JWT AND SIGNIN AND SIGNUP END HERE //////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////// DASHBOARD GET HERE /////////////////////////////////////////////////////////////////////////////////////

app.get("/dashboard", (req, res) => {
  const user = req.session.user; // Retrieve user information from session

  if (!user) {
    // Redirect to sign-in page if user is not logged in
    return res.redirect("/sign");
  }

  connection.query("SELECT * FROM featured ", (error, result) => {
    if (error) {
      console.error(error);
      return res.status(500).send("Internal Server Error");
    }

    console.log(result);
    // Render the dashboard page with the result and user information
    res.render("dashboard", { result: result, user: user });
  });
});

////////////////////////////////////////////////////////////////// DASHBOARD END HERE ///////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////// SEARCH LOGIC FOR ALL BOOKS ///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////// ALL GET AND POST LOGIC HERE //////////////////////////////////////////////////////////////////////////

app.get("/search", function (req, res) {
  let searchQuery = req.query.query;

  const query = `
        (SELECT * FROM bcom1 WHERE name LIKE '%${searchQuery}%')
        UNION
        (SELECT * FROM bcom WHERE name LIKE '%${searchQuery}%')
        UNION
        (SELECT * FROM bcom3 WHERE name LIKE '%${searchQuery}%')
        UNION
        (SELECT * FROM bcom4 WHERE name LIKE '%${searchQuery}%')
        UNION
        (SELECT * FROM bcom5 WHERE name LIKE '%${searchQuery}%')
        UNION
        (SELECT * FROM bcom6 WHERE name LIKE '%${searchQuery}%')
        UNION
        (SELECT * FROM bms1 WHERE name LIKE '%${searchQuery}%')
        UNION
        (SELECT * FROM bms2 WHERE name LIKE '%${searchQuery}%')
        UNION
        (SELECT * FROM bms3 WHERE name LIKE '%${searchQuery}%')
        UNION
        (SELECT * FROM bms4 WHERE name LIKE '%${searchQuery}%')
        UNION
        (SELECT * FROM bms5 WHERE name LIKE '%${searchQuery}%')
        UNION
        (SELECT * FROM bms6 WHERE name LIKE '%${searchQuery}%')
        UNION
        (SELECT * FROM itse1 WHERE name LIKE '%${searchQuery}%')
        UNION
        (SELECT * FROM itse2 WHERE name LIKE '%${searchQuery}%')
        UNION
        (SELECT * FROM itse3 WHERE name LIKE '%${searchQuery}%')
        UNION
        (SELECT * FROM itse4 WHERE name LIKE '%${searchQuery}%')
        UNION
        (SELECT * FROM itse5 WHERE name LIKE '%${searchQuery}%')
        UNION
        (SELECT * FROM itse6 WHERE name LIKE '%${searchQuery}%')
        UNION
        (SELECT * FROM featured WHERE name LIKE '%${searchQuery}%')
    `;

  connection.query(query, (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    } else {
      res.json(results);
    }
  });
});

////////////////////////////////////////////////////////////////////////// SEARCH LOGIC END HERE //////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////// ALL BOOKS GET AND POST LOGIC HERE //////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////// ADD TO CART AND CART TOTAL LOGIC HERE ///////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////// REMOVE BOOK AND RETOTAL LOGIC HERE //////////////////////////////////////////////////////////////

////////////////////////// BOOKS SESSION AND TOTAL FUNCTION /////////////////////////////////////

function isProductInCart(cart, id) {
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id == id) {
      return true;
    }
  }
  return false;
}

function calculateTotal(cart, req) {
  total = 0;
  for (let i = 0; i < cart.length; i++) {
    total = total + cart[i].price * cart[i].quantity;
  }
  req.session.total = total;
  return total;
}

///////////////////////////  ALL DEGREE BOOK GET HERE WITH ALL SEM ///////////////////////

///////////////////////// BCOM START ///////////////////////////////

app.get("/bcom1", function (req, res) {
  const user = req.session.user; // Retrieve user information from session

  if (!user) {
    // Redirect to sign-in page if user is not logged in
    return res.redirect('/sign');
  }
  connection.query("SELECT * FROM bcom1", (error, result) => {
    if (error) {
      console.log(error);
      res.status(401).send("Internal Server Error");
    } else {
      console.log(result);
      res.render("bcomsem1", { result: result,user: user  });
    }
  });
});

app.get("/bcom2", function (req, res) {
  
  const user = req.session.user; // Retrieve user information from session

  if (!user) {
    // Redirect to sign-in page if user is not logged in
    return res.redirect('/sign');
  }
  connection.query("SELECT * FROM bcom", (error, result) => {
    if (error) {
      console.log(error);
      res.status(401).send("Internal Server Error");
    } else {
      console.log(result);
      res.render("bcomsem2", { result: result,user: user  });
    }
  });
});

app.get("/bcom3", function (req, res) {
   const user = req.session.user; // Retrieve user information from session

  if (!user) {
    // Redirect to sign-in page if user is not logged in
    return res.redirect('/sign');
  }
  connection.query("SELECT * FROM bcom3", (error, result) => {
    if (error) {
      console.log(error);
      res.status(401).send("Internal Server Error");
    } else {
      console.log(result);
      res.render("bcomsem3", { result: result ,user: user });
    }
  });
});

app.get("/bcom4", function (req, res) {
   const user = req.session.user; // Retrieve user information from session

  if (!user) {
    // Redirect to sign-in page if user is not logged in
    return res.redirect('/sign');
  }
  connection.query("SELECT * FROM bcom4", (error, result) => {
    if (error) {
      console.log(error);
      res.status(401).send("Internal Server Error");
    } else {
      console.log(result);
      res.render("bcomsem4", { result: result ,user: user  });
    }
  });
});

app.get("/bcom5", function (req, res) {
   const user = req.session.user; // Retrieve user information from session

  if (!user) {
    // Redirect to sign-in page if user is not logged in
    return res.redirect('/sign');
  }
  connection.query("SELECT * FROM bcom5", (error, result) => {
    if (error) {
      console.log(error);
      res.status(401).send("Internal Server Error");
    } else {
      console.log(result);
      res.render("bcomsem5", { result: result,user: user  });
    }
  });
});

app.get("/bcom6", function (req, res) {
   const user = req.session.user; // Retrieve user information from session

  if (!user) {
    // Redirect to sign-in page if user is not logged in
    return res.redirect('/sign');
  }
  connection.query("SELECT * FROM bcom6", (error, result) => {
    if (error) {
      console.log(error);
      res.status(401).send("Internal Server Error");
    } else {
      console.log(result);
      res.render("bcomsem6", { result: result,user: user });
    }
  });
});

//////////////////// BCOM END HERE ///////////////////////////

//////////////////// BMS START HERE /////////////////////////

app.get("/bmssem1", function (req, res) {
   const user = req.session.user; // Retrieve user information from session

  if (!user) {
    // Redirect to sign-in page if user is not logged in
    return res.redirect('/sign');
  }
  connection.query("SELECT * FROM bms1", (error, result) => {
    if (error) {
      console.log(error);
      res.status(401).send("Internal Server Error");
    } else {
      console.log(result);
      res.render("bmssem1", { result: result,user: user  });
    }
  });
});

app.get("/bmssem2", function (req, res) {
   const user = req.session.user; // Retrieve user information from session

  if (!user) {
    // Redirect to sign-in page if user is not logged in
    return res.redirect('/sign');
  }
  connection.query("SELECT * FROM bms2", (error, result) => {
    if (error) {
      console.log(error);
      res.status(401).send("Internal Server Error");
    } else {
      console.log(result);
      res.render("bmssem2", { result: result,user: user  });
    }
  });
});

app.get("/bmssem3", function (req, res) {
   const user = req.session.user; // Retrieve user information from session

  if (!user) {
    // Redirect to sign-in page if user is not logged in
    return res.redirect('/sign');
  }
  connection.query("SELECT * FROM bms3", (error, result) => {
    if (error) {
      console.log(error);
      res.status(401).send("Internal Server Error");
    } else {
      console.log(result);
      res.render("bmssem3", { result: result,user: user  });
    }
  });
});
app.get("/bmssem4", function (req, res) {
   const user = req.session.user; // Retrieve user information from session

  if (!user) {
    // Redirect to sign-in page if user is not logged in
    return res.redirect('/sign');
  }
  connection.query("SELECT * FROM bms4", (error, result) => {
    if (error) {
      console.log(error);
      res.status(401).send("Internal Server Error");
    } else {
      console.log(result);
      res.render("bmssem4", { result: result,user: user  });
    }
  });
});

app.get("/bmssem5", function (req, res) {
   const user = req.session.user; // Retrieve user information from session

  if (!user) {
    // Redirect to sign-in page if user is not logged in
    return res.redirect('/sign');
  }
  connection.query("SELECT * FROM bms5", (error, result) => {
    if (error) {
      console.log(error);
      res.status(401).send("Internal Server Error");
    } else {
      console.log(result);
      res.render("bmssem5", { result: result,user: user  });
    }
  });
});

app.get("/bmssem6", function (req, res) {
   const user = req.session.user; // Retrieve user information from session

  if (!user) {
    // Redirect to sign-in page if user is not logged in
    return res.redirect('/sign');
  }
  connection.query("SELECT * FROM bms6", (error, result) => {
    if (error) {
      console.log(error);
      res.status(401).send("Internal Server Error");
    } else {
      console.log(result);
      res.render("bmssem6", { result: result ,user: user });
    }
  });
});

///////////////////// BMS END HERE ////////////////////////////////

/////////////////// IT START HERE ///////////////////////////////////

app.get("/itsem1", function (req, res) {
   const user = req.session.user; // Retrieve user information from session

  if (!user) {
    // Redirect to sign-in page if user is not logged in
    return res.redirect('/sign');
  }
  connection.query("SELECT * FROM itse1", (error, result) => {
    if (error) {
      console.log(error);
      res.status(401).send("Internal Server Error");
    } else {
      console.log(result);
      res.render("itsem1", { result: result,user: user  });
    }
  });
});

app.get("/itsem2", function (req, res) {
   const user = req.session.user; // Retrieve user information from session

  if (!user) {
    // Redirect to sign-in page if user is not logged in
    return res.redirect('/sign');
  }
  connection.query("SELECT * FROM itse2", (error, result) => {
    if (error) {
      console.log(error);
      res.status(401).send("Internal Server Error");
    } else {
      console.log(result);
      res.render("itsem2", { result: result ,user: user });
    }
  });
});

app.get("/itsem3", function (req, res) {
  connection.query("SELECT * FROM itse3", (error, result) => {
    if (error) {
      console.log(error);
      res.status(401).send("Internal Server Error");
    } else {
      console.log(result);
      res.render("itsem3", { result: result ,user: user });
    }
  });
});

app.get("/itsem4", function (req, res) {
   const user = req.session.user; // Retrieve user information from session

  if (!user) {
    // Redirect to sign-in page if user is not logged in
    return res.redirect('/sign');
  }
  connection.query("SELECT * FROM itse4", (error, result) => {
    if (error) {
      console.log(error);
      res.status(401).send("Internal Server Error");
    } else {
      console.log(result);
      res.render("itsem4", { result: result,user: user  });
    }
  });
});

app.get("/itsem5", function (req, res) {
   const user = req.session.user; // Retrieve user information from session

  if (!user) {
    // Redirect to sign-in page if user is not logged in
    return res.redirect('/sign');
  }
  connection.query("SELECT * FROM itse5", (error, result) => {
    if (error) {
      console.log(error);
      res.status(401).send("Internal Server Error");
    } else {
      console.log(result);
      res.render("itsem5", { result: result ,user: user });
    }
  });
});

app.get("/itsem6", function (req, res) {
   const user = req.session.user; // Retrieve user information from session

  if (!user) {
    // Redirect to sign-in page if user is not logged in
    return res.redirect('/sign');
  }
  connection.query("SELECT * FROM itse6", (error, result) => {
    if (error) {
      console.log(error);
      res.status(401).send("Internal Server Error");
    } else {
      console.log(result);
      res.render("itsem6", { result: result,user: user  });
    }
  });
});

/////////////////////// IT END HERE ////////////////////////////

///////////////// ADD BOOKS TO CART LOGIC //////////////////////
////////////////// CART POST AND GET //////////////////////////

app.post("/addtocart", function (req, res) {
  var id = req.body.id;
  var name = req.body.name;
  var publisher = req.body.publisher;
  var price = req.body.price;
  var image = req.body.image;
  var quantity = req.body.quantity;
  // var saleprice = req.body.saleprice;
  console.log(req.body);

  var product = {
    id: id,
    name: name,
    publisher: publisher,
    price: price,
    image: image,
    quantity: quantity,
  };

  if (req.session.cart) {
    var cart = req.session.cart;

    if (!isProductInCart(cart, id)) {
      cart.push(product);
    }
  } else {
    req.session.cart = [product];
    var cart = req.session.cart;
  }

  //calculate total
  calculateTotal(cart, req);

  //return to cart
  res.redirect("/cart");
});

app.get("/cart", function (req, res) {
  var cart = req.session.cart || [];
  var total = req.session.total || 0;

  res.render("cart", { cart: cart, total: total });
});

/////////////////////// CART END HERE //////////////////////////

///////////////////// REMOVE BOOKS FROM CART AND RETOTAL ///////////////

app.post("/remove", function (req, res) {
  var id = req.body.id;
  var cart = req.session.cart;

  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id == id) {
      cart.splice(i, 1);
      break;
    }
  }

  // Recalculate total
  calculateTotal(cart, req);

  // Go back to the cart page
  res.redirect("/cart");
});

////////////////////////// INSERT BOOK AND USER INFO DATABASE /////////////////////////////
///////////////////////// SHOW USER ORDER ID AND BOOK INFO ////////////////////////////////

app.post("/checkout", (req, res) => {
  const { name, clas, contact, email, rentalDays, items, total } = req.body;

  const currentDate = new Date().toISOString().slice(0, 19).replace("T", " ");

  const sql =
    "INSERT INTO orderss (name, clas, contact, email, rentalDays, items, total, orderDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

  const values = [
    name,
    clas,
    contact,
    email,
    rentalDays,
    JSON.stringify(items),
    total,
    currentDate,
  ];

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error inserting order into MySQL:", err);
      res.status(500).send("An error occurred while processing your request.");
      return;
    }

    if (!result || !result.insertId) {
      console.error("No insert ID returned after inserting order into MySQL.");
      res.status(500).send("An error occurred while processing your request.");
      return;
    }

    console.log("Order inserted into MySQL:", result);

    res.json({ insertId: result.insertId });
  });
});

/////////////////// ORDER DEATAILS FUNCTION /////////////////////////////

function getOrderDetails(orderId, callback) {
  const sql = "SELECT * FROM orderss WHERE id = ?";
  connection.query(sql, [orderId], (err, result) => {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, result[0]);
  });
}

////////////////////////  SHOW ORDER DETAILS TO USER /////////////////////

app.get("/checkoutconfirm/:orderId", (req, res) => {
  const orderId = req.params.orderId;
  getOrderDetails(orderId, (err, order) => {
    if (err) {
      console.error("Error fetching order details:", err);
      res.status(500).send("An error occurred while processing your request.");
      return;
    }

    // Parse order.items only if it's not null
    const items = order.items ? JSON.parse(order.items) : [];

    res.render("checkoutconfirm", {
      name: order.name,
      clas: order.clas,
      contact: order.contact,
      email: order.email,
      rentalDays: order.rentalDays,
      total: order.total,
      items: items, // Pass the items data to the template
      id: order.id,
      userData: null,
    });
  });
});



app.get("/checkoutconfirm", (req, res) => {
  if (!req.session.user) {
    // If not logged in, redirect to the sign-in page
    return res.redirect("/sign");
  }
  // Fetch the userData object from the database or any other source
  getOrderDetailsFromDB((err, userData) => {
    if (err) {
      console.error("Error fetching user data:", err);
      res.status(500).send("An error occurred while processing your request.");
      return;
    }

    res.render("checkoutconfirm", {
      userData: userData // Pass the userData object to the template
    });
  });
});

app.get("/check", function (req, res) {
  var cart = req.session.cart || [];
  var total = req.session.total || 0;
  res.render("checkout", { cart: cart, total: total });
});

////////////////////////////////////////////////////////////////////  DOWNLOAD INVOICE ////////////////////////////////////////////////////
app.get('/downloadInvoice', (req, res) => {
  const id = req.query.id;
  const name = req.query.name;
  const clas = req.query.clas;
  const email = req.query.email;
  const contact = req.query.contact;
  const rentalDays = req.query.rentalDays;
  const items = req.query.items.split(',');
  const total = req.query.total;

  const doc = new PDFDocument();

  const invoicePath = 'invoice.pdf';

  // Pipe the PDF to a writable stream to save it
  const stream = fs.createWriteStream(invoicePath);
  doc.pipe(stream);

  // Add logo and company name
  doc.image('/test project error md/public/image/zz.png', 50, 50, { width: 80, height: 80 })
      .text('Borrow Books', 50, 160, { align: 'left', fontSize: 16 });

  // Add invoice heading
  doc.fontSize(20).text('Invoice', { align: 'center' }).moveDown();
  doc.fontSize(20).text('(Original for Recipient)', { align: 'center' }).moveDown();

  // Add line after heading
  doc.moveTo(50, doc.y)
      .lineTo(550, doc.y)
      .stroke();

  // Add margin top between name and line
  doc.moveDown();

  // Add invoice details
  doc.font('Helvetica').fontSize(12)
      .text(`Order id: ${id}`)
      .text(`Name: ${name}`)
      .text(`Class: ${clas}`)
      .text(`Email: ${email}`)
      .text(`Contact: ${contact}`)
      .text(`Rental Days: ${rentalDays}`)
      .text('Items:')
      .moveDown(0.5)
      .list(items);

  // Add line after heading
  doc.moveTo(50, doc.y)
      .lineTo(550, doc.y)
      .stroke();

  // Add total amount
  doc.moveDown(0.5)
      .fontSize(18)
      .text(`Total: Rs ${total}`, { align: 'right' })
      

  // Add line after heading
  doc.moveTo(50, doc.y)
      .lineTo(550, doc.y)
      .stroke(); 

  // Add additional text
  doc.moveDown(0.5)
      .text('Sold By: Bowrrow Books');

  // Finalize the PDF
  doc.end();

  // Wait for the PDF to be fully written before triggering download
  stream.on('finish', () => {
      const fileName = name || id || 'invoice'; // Use name if available, otherwise use id, or fallback to 'invoice'
      res.download(invoicePath, `${fileName}.pdf`, (err) => {
          if (err) {
              console.error('Error downloading invoice:', err);
          } else {
              // Delete the generated PDF file after download
              fs.unlinkSync(invoicePath);
          }
      });
  });
});


////////////////////////////////////////////////////////////////////// ADD TO CART AND BOOKS GET POST END HERE /////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////// ADMIN PAGE START HERE ///////////////////////////////////////////////////////////////////////////

////////////////// ADMIN LOGIN ////////////////

app.post("/adminlog", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM admin WHERE email = ?";
  connection.query(sql, [email], (err, results) => {
    if (err) {
      console.error("Error retrieving user: ", err);
      res.send("Error logging in");
    } else {
      if (results.length > 0) {
        const user = results[0];
        if (password === user.password) {
          res.render("adminhome");
        } else {
          // Password doesn't match, redirect to sign-in page with error
          res.redirect("/adminlog?error=Incorrect email or password");
        }
      } else {
        // No user found with the given email, redirect to sign-in page with error
        res.redirect("/adminlog?error=Incorrect email or password");
      }
    }
  });
});

app.get("/adminlog", (req, res) => {
  const errorMessage = req.query.error || "";
  res.render("adminlog", { errorMessage });
});

///////////////////////// IN ADMIN PAGE SHOW REGISTER USER INFO //////////////////////////

app.get("/admin/users", (req, res) => {
  connection.query("SELECT * FROM cust", (error, results, fields) => {
    if (error) {
      console.log(error);
      res.status(500).send("Error fetching user data");
    } else {
      const userData = results;
      res.render("adminuser", { userData: userData });
    }
  });
});

/////////////////////////// SHOWING BOOKS DATABASE /////////////////////////////////////////////

app.get("/adminbcom1", (req, res) => {
  connection.query("SELECT * FROM bcom1", (err, rows) => {
    if (err) {
      console.error("Error fetching book data:", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    res.render("adminbcom1", { userData: rows });
  });
});

///////////////////// ADDING NEW BOOKS TO DATABASE ////////////////////////////////////////////////

app.post("/add-book", (req, res) => {
  const { name, publisher, price, image } = req.body;

  connection.query(
    "INSERT INTO bcom1 (name, publisher, price, image) VALUES (?, ?, ?, ?)",
    [name, publisher, price, image],
    (err, result) => {
      if (err) {
        console.error("Error adding book:", err);
        res.status(500).send("Internal Server Error");
        return;
      }
      console.log("Book added successfully");

      res.redirect("/adminbcom1");
    }
  );
});

//////////////////////////////  DETETE BOOKS FROM DATABASE ///////////////////////////////////////

app.post("/delete-book", (req, res) => {
  const bookId = req.body.bookId;

  connection.query(
    "DELETE FROM bcom1 WHERE id = ?",
    [bookId],
    (err, result) => {
      if (err) {
        console.error("Error deleting book:", err);
        res.status(500).send("Internal Server Error");
        return;
      }
      console.log("Book deleted successfully");

      res.redirect("/adminbcom1");
    }
  );
});

//////////////////////////////// SHOW USER ORDER DETAILS //////////////////////////////

app.get("/admin", (req, res) => {
  connection.query("SELECT * FROM orderss", (error, results) => {
    if (error) {
      console.error("Error fetching user data: ", error);
      res.status(500).send("Error fetching user data");
    } else {
      const userData = results; // Assuming 'results' contains the user data from the database
      res.render("adminbbok", { userData: userData });
    }
  });
});

// Route to handle status update
app.put('/update-status/:orderId', (req, res) => {
  const orderId = req.params.orderId;
  const newStatus = req.body.status;

  connection.query(
    "UPDATE orderss SET status = ? WHERE id = ?",
    [newStatus, orderId],
    (error, results) => {
      if (error) {
        console.error("Error updating status: ", error);
        res.status(500).send("Error updating status");
      } else {
        res.sendStatus(200);
      }
    }
  );
});

/////////////////// ADMIN HOME PAGE /////////////////

app.get("/adminhome", (req, res) => {
  res.render("adminhome");
});

////////////////// ADMIN ANALYSIS ///////////////////

app.get("/adminana", (req, res) => {
  res.render("adminana");
});

////////////////// ADMIN PROFILE /////////////////////

app.get("/adminprofile", (req, res) => {
  res.render("adminprofile");
});

/////////////////// USER ORDER SEARCH ////////////////////////

app.get("/searchs", (req, res) => {
  const searchTerm = req.query.searchTerm;

  const sql = `SELECT * FROM orderss WHERE email LIKE ? OR DATE_FORMAT(orderDate, '%Y-%m-%d') = ?`;

  connection.query(sql, [`%${searchTerm}%`, searchTerm], (error, results) => {
    if (error) {
      console.error("Error searching records:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(results);
    }
  });
});

///////////////////////////////////////////////////////////////////////////////// ADMIN PAGE END HERE ///////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////   RUNNING ON PORT NO 8002 ///////////////////////////////////////////////////////////////

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
