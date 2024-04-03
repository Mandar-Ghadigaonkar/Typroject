
let  sendbtn=document.getElementById('sendbtn')
let otpInput = document.getElementById("otp")
let unameInput = document.getElementById("uname")
const sendOTP = () => {
  // e.preventDefault();
  // alert("click")
  let otp = document.getElementById("otp").value;
  let uname = document.getElementById("uname").value;

  const userData = {
    uname: uname,
  }; 

  if (uname.length!=0) {
    
  

  fetch("http://localhost:8001/sendotp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      sendbtn.disabled=true
      otpInput.disabled=false
      // unameInput.disabled=true
      return response.json();
    })
    .catch((error) => {
      console.error("Forgot error:", error);
      // err.innerHTML="password not tmatch";
      // Optionally, you can display an error message to the user
    });

  }

//   alert(otp + "send btn");
};


const forgot = (e) => {
  // e.preventDefault(); // Prevent the default form submission
  let uname = document.getElementById("uname").value;
  let otp = document.getElementById("otp").value;

  const userData = {
      uname: uname,
      otp: otp,
  };

  fetch("http://localhost:8001/forgott", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
  })
  .then((response) => {
      if (response.redirected) {
          // If the response is a redirect, manually redirect the client
          // window.location.href = response.url; // Redirect to the provided URL
      } else {
          // Handle JSON response or other scenarios
          return response.json();
      }
  })
  .then((data) => {
      // Handle JSON data if needed
  })
  .catch((error) => {
      console.error("Forgot error:", error);
      // Handle error scenarios
  });
};
