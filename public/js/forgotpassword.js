document.getElementById('forgotPasswordForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var email = document.getElementById('email').value;

    // Here, you can send an AJAX request to your server to send the OTP to the provided email address
    // Below is a placeholder code for demonstration purpose only

    // Simulating OTP generation and sending
    var otp = generateOTP();
    // In a real scenario, you would send this OTP to the provided email address

    // Show a confirmation dialog
    Swal.fire({
        icon: 'success',
        title: 'OTP Sent!',
        text: 'An OTP has been sent to your email address.',
        confirmButtonText: 'OK'
    }).then((result) => {
        if (result.isConfirmed) {
            // Redirect the user to the OTP verification page
            window.location.href = 'verifyotp.html';
        }
    });
});

// Function to generate a random 6-digit OTP
function generateOTP() {
    var digits = '0123456789';
    var otp = '';
    for (var i = 0; i < 6; i++) {
        otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
}
