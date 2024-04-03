const express = require("express");
const mysql = require("mysql");
const ejs = require("ejs");
const cors = require("cors");
const app = express();
const path = require("path");
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
})
app.get("/resetpassword", (req, res) => {
  res.render("resetpassword");
});

app.post("/restpass",(req,res)=>{
  const { newPassword, confirmPassword, uname } = req.body;
  // UPDATE `students` SET `password`='[value-5]' WHERE email="s@gmail.com";
  console.log(newPassword);
  console.log(`Updating password for user: ${uname}`);


  connection.query(
    `UPDATE students SET password='${newPassword}', confirmpassword='${confirmPassword}' WHERE email='${uname}';`,
    (error, results, fields) => {
      if (error) {
        console.log(error);
      } else {
        console.log( results.affectedRows);
        // res.json(results);cls
        // if (results[0] === undefined) {
        //   console.log("user not found");
        // } else {
        //   console.log(results);

        //   // const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });
        //   const otp = "1";

        //   otps[data.uname] = otp;
        //   // Send OTP email
        //   sendOTPEmail(data.uname, otp);

        //   res.status(200).send("OTP sent successfully.");
        // }
if (results.affectedRows!==0) {
  // res.render("dashboard")
  res.redirect('/sign');
  // res.status(400).send('success OTP'); 
}

      }
    }
  );
})

// kamu

app.post("/forgott", (req, res) => {
  const { uname, otp } = req.body; 
  const u = req.session.uname || ''; 
  console.log(uname + " forgot api 1");

  if (otps[uname] === otp) { 
    console.log(otps[uname]);

    
    res.render('resetpassword', { uname: uname }); 

    delete otps[uname]; 
  } else {
    // res.status(400).send('Invalid OTP'); 
    res.render('forgot2',{ errorMessage: "Invalid OTP" })
  }
});

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








// kamu
const otps = {};
app.post("/sendotp", (req, res) => {
  const data = req.body;
  console.log(data + "sendOTP api");
  connection.query(
    `SELECT * FROM students WHERE email="${data.uname}"; `,
    (error, results, fields) => {
      if (error) {
        console.log(error);
      } else {
        console.log(typeof results);
        // res.json(results);cls
        if (results[0] === undefined) {
          console.log("user not found");
        // Render the forgot2 template with error message
        res.render('forgot2', { errorMessage: "Email not found" });
        } else { 
          console.log(results);

          // const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });
          const otp = "1";

          otps[data.uname] = otp;
          // Send OTP email
          sendOTPEmail(data.uname, otp);

          res.status(200).send("OTP sent successfully.");
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
app.post('/sign', (req, res) => {
  const { name, clas, contact, email, password, confirmpassword, gender } = req.body;

  
  let errorMessage = "";

  // Check if password matches confirm password
  if (password !== confirmpassword) {
     
      errorMessage = "Passwords do not match";
      
      return res.render('registration', { errorMessage });
  }

  
  connection.query('INSERT INTO students (name, clas, contact, email, password, confirmpassword, gender) VALUES (?,?,?,?,?,?,?)', [name, clas, contact, email, password, confirmpassword, gender], (error, results, fields) => {
      if (error) {
          console.log(error);
          return res.status(500).send("Error registering user");
      }

      // Generate JWT token
      const accessToken = jwt.sign({ email: email }, "mynameismandariamdoingprojectononlinebookrentalsystem", { expiresIn: '2h' });
      console.log("Generated token:", accessToken);
      res.cookie('jwt', accessToken, { httpOnly: true, maxAge: 60 * 60 * 1000 });

      
      
      res.redirect('/sign');
      console.log('User added:', name, clas, contact, email, password, confirmpassword, gender);
  });
});

app.get('/sign', (req, res) => {
  const errorMessage = req.query.error || "";
  res.render('sigin', { errorMessage }); 
});


app.get('/regi', (req, res) => {
  res.render('registration', { errorMessage: "" });
});


app.post('/home', (req, res) => {
  const { email, password } = req.body;
  const sql = 'SELECT * FROM students WHERE email = ?';
  connection.query(sql, [email], (err, results) => {
      if (err) {
          console.error('Error retrieving user: ', err);
          res.send('Error logging in');
      } else {
          if (results.length > 0) {
              const user = results[0];
              if (password === user.password) {
                  const accessToken = jwt.sign({ email: user.email }, "mynameismandariamdoingprojectononlinebookrentalsystem", { expiresIn: '2h' });
                  console.log("Generated token:", accessToken);
                  res.cookie('jwt', accessToken, { httpOnly: true, maxAge: 60 * 60 * 1000 }); // Set JWT in a cookie (optional)
                  connection.query("SELECT * FROM featured ", (error, result) => {
                      if (error) {
                          console.log(error);
                          res.status(401).send("Internal Server Error");
                      } else {
                          console.log(result);
                          res.render('dashboard', { result: result });
                      }
                  });

              } else {
                  // Password doesn't match, redirect to sign-in page with error
                  res.redirect('/sign?error=Incorrect email or password');
              }
          } else {
              // No user found with the given email, redirect to sign-in page with error
              res.redirect('/sign?error=Incorrect email or password');
          }

      }

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
  connection.query("SELECT * FROM featured ", (error, result) => {
    if (error) {
      console.log(error);
      res.status(401).send("Internal Server Error");
    } else {
      console.log(result);
      res.render("dashboard", { result: result });
    }
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
  connection.query("SELECT * FROM bcom1", (error, result) => {
    if (error) {
      console.log(error);
      res.status(401).send("Internal Server Error");
    } else {
      console.log(result);
      res.render("bcomsem1", { result: result });
    }
  });
});

app.get("/bcom2", function (req, res) {
  connection.query("SELECT * FROM bcom", (error, result) => {
    if (error) {
      console.log(error);
      res.status(401).send("Internal Server Error");
    } else {
      console.log(result);
      res.render("bcomsem2", { result: result });
    }
  });
});

app.get("/bcom3", function (req, res) {
  connection.query("SELECT * FROM bcom3", (error, result) => {
    if (error) {
      console.log(error);
      res.status(401).send("Internal Server Error");
    } else {
      console.log(result);
      res.render("bcomsem3", { result: result });
    }
  });
});

app.get("/bcom4", function (req, res) {
  connection.query("SELECT * FROM bcom4", (error, result) => {
    if (error) {
      console.log(error);
      res.status(401).send("Internal Server Error");
    } else {
      console.log(result);
      res.render("bcomsem4", { result: result });
    }
  });
});

app.get("/bcom5", function (req, res) {
  connection.query("SELECT * FROM bcom5", (error, result) => {
    if (error) {
      console.log(error);
      res.status(401).send("Internal Server Error");
    } else {
      console.log(result);
      res.render("bcomsem5", { result: result });
    }
  });
});

app.get("/bcom6", function (req, res) {
  connection.query("SELECT * FROM bcom6", (error, result) => {
    if (error) {
      console.log(error);
      res.status(401).send("Internal Server Error");
    } else {
      console.log(result);
      res.render("bcomsem6", { result: result });
    }
  });
});

//////////////////// BCOM END HERE ///////////////////////////

//////////////////// BMS START HERE /////////////////////////

app.get("/bmssem1", function (req, res) {
  connection.query("SELECT * FROM bms1", (error, result) => {
    if (error) {
      console.log(error);
      res.status(401).send("Internal Server Error");
    } else {
      console.log(result);
      res.render("bmssem1", { result: result });
    }
  });
});

app.get("/bmssem2", function (req, res) {
  connection.query("SELECT * FROM bms2", (error, result) => {
    if (error) {
      console.log(error);
      res.status(401).send("Internal Server Error");
    } else {
      console.log(result);
      res.render("bmssem2", { result: result });
    }
  });
});

app.get("/bmssem3", function (req, res) {
  connection.query("SELECT * FROM bms3", (error, result) => {
    if (error) {
      console.log(error);
      res.status(401).send("Internal Server Error");
    } else {
      console.log(result);
      res.render("bmssem3", { result: result });
    }
  });
});
app.get("/bmssem4", function (req, res) {
  connection.query("SELECT * FROM bms4", (error, result) => {
    if (error) {
      console.log(error);
      res.status(401).send("Internal Server Error");
    } else {
      console.log(result);
      res.render("bmssem4", { result: result });
    }
  });
});

app.get("/bmssem5", function (req, res) {
  connection.query("SELECT * FROM bms5", (error, result) => {
    if (error) {
      console.log(error);
      res.status(401).send("Internal Server Error");
    } else {
      console.log(result);
      res.render("bmssem5", { result: result });
    }
  });
});

app.get("/bmssem6", function (req, res) {
  connection.query("SELECT * FROM bms6", (error, result) => {
    if (error) {
      console.log(error);
      res.status(401).send("Internal Server Error");
    } else {
      console.log(result);
      res.render("bmssem6", { result: result });
    }
  });
});

///////////////////// BMS END HERE ////////////////////////////////

/////////////////// IT START HERE ///////////////////////////////////

app.get("/itsem1", function (req, res) {
  connection.query("SELECT * FROM itse1", (error, result) => {
    if (error) {
      console.log(error);
      res.status(401).send("Internal Server Error");
    } else {
      console.log(result);
      res.render("itsem1", { result: result });
    }
  });
});

app.get("/itsem2", function (req, res) {
  connection.query("SELECT * FROM itse2", (error, result) => {
    if (error) {
      console.log(error);
      res.status(401).send("Internal Server Error");
    } else {
      console.log(result);
      res.render("itsem2", { result: result });
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
      res.render("itsem3", { result: result });
    }
  });
});

app.get("/itsem4", function (req, res) {
  connection.query("SELECT * FROM itse4", (error, result) => {
    if (error) {
      console.log(error);
      res.status(401).send("Internal Server Error");
    } else {
      console.log(result);
      res.render("itsem4", { result: result });
    }
  });
});

app.get("/itsem5", function (req, res) {
  connection.query("SELECT * FROM itse5", (error, result) => {
    if (error) {
      console.log(error);
      res.status(401).send("Internal Server Error");
    } else {
      console.log(result);
      res.render("itsem5", { result: result });
    }
  });
});

app.get("/itsem6", function (req, res) {
  connection.query("SELECT * FROM itse6", (error, result) => {
    if (error) {
      console.log(error);
      res.status(401).send("Internal Server Error");
    } else {
      console.log(result);
      res.render("itsem6", { result: result });
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

    res.render("checkoutconfirm", {
      name: order.name,
      clas: order.clas,
      contact: order.contact,
      email: order.email,
      rentalDays: order.rentalDays,
      total: order.total,
      items: JSON.parse(order.items),
      id: order.id,
    });
  });
});

app.get("/checkoutconfirm", (req, res) => {
  res.render("checkoutconfirm");
});

app.get("/check", function (req, res) {
  var cart = req.session.cart || [];
  var total = req.session.total || 0;
  res.render("checkout", { cart: cart, total: total });
});

////////////////////////////////////////////////////////////////////// ADD TO CART AND BOOKS GET POST END HERE /////////////////////////////////////////////////////////



///////////////////////////////////////////////////////////////////// ADMIN PAGE START HERE ///////////////////////////////////////////////////////////////////////////

////////////////// ADMIN LOGIN ////////////////

app.post('/adminlog', (req, res) => {
  const { email, password } = req.body;
  const sql = 'SELECT * FROM admin WHERE email = ?';
  connection.query(sql, [email], (err, results) => {
      if (err) {
          console.error('Error retrieving user: ', err);
          res.send('Error logging in');
      } else {
          if (results.length > 0) {
              const user = results[0];
              if (password === user.password) {
                res.render("adminhome");

              } else {
                  // Password doesn't match, redirect to sign-in page with error
                  res.redirect('/adminlog?error=Incorrect email or password');
              }
          } else {
              // No user found with the given email, redirect to sign-in page with error
              res.redirect('/adminlog?error=Incorrect email or password');
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
  connection.query("SELECT * FROM students", (error, results, fields) => {
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
