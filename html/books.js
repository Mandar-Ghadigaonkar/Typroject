var express = require('express');
var ejs = require("ejs");
var bodyparser=require("body-parser");
var mysql =require('mysql');
const path =require('path');
const static_path=path.join(__dirname,"../public");
var session =require('express-session');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'books'
});

var app = express();

app.use(express.static('public'));
app.set('views', path.join(__dirname, '..', 'public'));
app.use(express.static(path.join(__dirname, '..', 'public')));
app.set('view engine','ejs'); 
app.listen(8080);
console.log("Server is running at http");
app.use(bodyparser.urlencoded({extended:true}));
app.use(session({secret:"secret"}))


function isProductInCart(cart,id){
  for(let i=0; i<cart.length; i++){
    if (cart[i].id == id){
        return true;
    }
  }
  return false;
}

function calculateTotal(cart,req){
    total = 0;
    for(let i=0 ; i<cart.length;i++) {
    
  
        total = total + (cart[i].price*cart[i].quantity);
    
    }
    req.session.total = total;
    return total;
}


// Home Page
app.get('/', function(req,res){
    connection.query("SELECT * FROM arrivals", (error, result) => {
        if(error){
            console.log(error);
            res.status(401).send("Internal Server Error");
        } else {
            console.log(result);
            res.render('homepage', { result: result });
        }
    });
});

app.get('/it',function(req,res){
    connection.query("SELECT * FROM test", (error, result) => {
        if(error){
            console.log(error);
            res.status(401).send("Internal Server Error");
        } else {
            console.log(result);
            res.render('itsem1', { result: result });
        }
    });
})

app.post('/addtocart',function(req,res){

var id = req.body.id;
var name = req.body.name;
var publisher =req.body.publisher;
var price = req.body.price;
var image = req.body.image;
var  quantity = req.body.quantity;
// var saleprice = req.body.saleprice;
console.log(req.body);

var product ={id:id,name:name,publisher:publisher,price:price,image:image,quantity:quantity,}

if(req.session.cart){
    var cart = req.session.cart;

    if(!isProductInCart(cart,id)){
        cart.push(product);
    }
} else{
        req.session.cart = [product];
        var cart = req.session.cart;
    }


     //calculate total
     calculateTotal(cart,req);

     //return to cart
     res.redirect("/cart");

});

app.get('/cart',function(req,res){
var cart = req.session.cart;
var total = req.session.total;

res.render('cart',{cart:cart,total:total});
})

app.post("/remove", function(req, res) {
    var id = req.body.id;
    var cart = req.session.cart;

    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id == id) {
            // Remove the item at index i directly
            cart.splice(i, 1);
            break; // Stop the loop after removing the item
        }
    }

    // Recalculate total
    calculateTotal(cart, req);

    // Go back to the cart page
    res.redirect("/cart");
});



app.post('/checkout', function(req, res) {
    // Retrieve form data from request body
    const { name, email, contact, rentalDays, items, total } = req.body;

    // Process the data as needed (e.g., save to database, send confirmation email)
    // For demonstration purposes, we'll just log the data
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Contact:', contact);
    console.log('Rental Days:', rentalDays);
    console.log('Items:', items);
    console.log('Total:', total);

    // Redirect the user to a success page or display a confirmation message
    res.send('Checkout successful!'); // You can also redirect the user to a success page
});


app.get('/check', function(req, res) {

    res.render('checkout');
});

