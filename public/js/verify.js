document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('verifyOTPForm').addEventListener('submit', function(event) {
        event.preventDefault();
        var enteredOTP = document.getElementById('otp').value;

        // Here, you can validate the entered OTP with the OTP sent to the user's email address
        // In a real scenario, you would send the entered OTP to your server for verification
        // Below is a placeholder code for demonstration purpose only

        // Placeholder OTP for demonstration purpose
        var sentOTP = "123456"; // This should be replaced with the actual OTP sent to the user's email address

        if (enteredOTP === sentOTP) {
            Swal.fire({
                icon: 'success',
                title: 'OTP Verified!',
                text: 'You have successfully verified your OTP.',
                confirmButtonText: 'OK'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Redirect the user to the password reset page
                    window.location.href = 'resetpassword.html';
                }
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Invalid OTP',
                text: 'Please enter the correct OTP.',
                confirmButtonText: 'OK'
            });
        }
    });
});