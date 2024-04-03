// const restpass=()=>{

//     let newPassword = document.getElementById("newPassword").value;
//     let confirmPassword = document.getElementById("confirmPassword").value;
//     let uname = document.getElementById("uname").value;




//     const newpass = {
//         newPassword: newPassword,
//         confirmPassword:confirmPassword,
//         uname:uname
//       };
//       if (newPassword===confirmPassword) {
        
      
//     fetch("http://localhost:8002/restpass", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(newpass),
//   })
//     .then((response) => {
//       if (response.redirected) {
//         // If the response is a redirect, manually redirect the client
//         window.location.href = response.url; // Redirect to the provided URL
//     } 
//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }
//       return response.json();
//     })
//     .catch((error) => {
//       console.error("Forgot error:", error);
//       // err.innerHTML="password not tmatch";
//       // Optionally, you can display an error message to the user
//     });

// } else {
//         alert("Please eneter same password")
// }
// }


const restpass = (event) => {
  event.preventDefault(); // Prevent default form submission behavior

  let newPassword = document.getElementById("newPassword").value;
  let confirmPassword = document.getElementById("confirmPassword").value;
  let uname = document.getElementById("uname").value;

  const newpass = {
    newPassword: newPassword,
    confirmPassword: confirmPassword,
    uname: uname
  };

  if (newPassword === confirmPassword) {
    fetch("http://localhost:8002/restpass", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newpass),
      })
      .then((response) => {
        if (response.ok) {
          // Password reset successfully, redirect to sign-in page
          window.location.href = "/sign"; // Replace "/signin" with your actual sign-in page URL
        } else {
          // Handle other response scenarios
          return response.json();
        }
      })
      .then((data) => {
        // Handle JSON response if needed
      })
      .catch((error) => {
        console.error("Password reset error:", error);
        // Optionally, you can display an error message to the user
      });
  } else {
    alert("Passwords do not match");
  }
};
