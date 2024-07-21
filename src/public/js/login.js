document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');

  const token = localStorage.getItem('token');

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => (obj[key] = value));
    try {
      const response = await fetch('/api/sessions/login', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
          'Content-Type': 'application/json',
           Authorization: `Bearer ${token}`
        },
      });

      const result = await response.json();
      if (result.status === 'success') {
        // Redirect to the home page after successful login
        window.location.replace('/');
      } else {
        // Handle login failure (display error message, etc.)
        alert('Login failed. Please check your credentials and try again.');
      }
    } catch (error) {
      // Handle any network errors or exceptions during login
      alert('An error occurred during login.');
      console.error('Login error:', error);
    }
  });

  const recoverEmailInput = document.getElementById("recoverEmailInput");
  const recoverEmailButton = document.getElementById("recoverEmailButton");

  recoverEmailButton.addEventListener("click", function () {
    const email = recoverEmailInput.value;

    // Send an HTTP GET request to the recovery endpoint with the email
    fetch(`/api/sessions/send-recover-mail/${email}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          // Request was successful, show a success message or redirect the user
          console.log("Recovery email sent successfully!");
        } else {
          // Handle error, show an error message, or handle the response accordingly
          console.error("Error sending recovery email.");
        }
      })
      .catch((error) => {
        // Handle network-related errors
        console.error("Network error:", error);
      });
  });
});