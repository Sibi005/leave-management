// app.js

let userId; // Store user ID globally

// Function to handle user registration
async function registerUser(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('reg-email').value;
    const rollNumber = document.getElementById('roll-number').value;
    const casualLeave = document.getElementById('casual-leave').value;
    const medicalLeave = document.getElementById('medical-leave').value;

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                email,
                rollNumber,
                casualLeave: parseInt(casualLeave),
                medicalLeave: parseInt(medicalLeave),
            }),
        });

        const data = await response.json();

        if (response.ok) {
            document.getElementById('registration-response').innerText = data.message;
            document.getElementById('registration-form').reset(); // Reset the form
            // Hide the registration section and show the login section
            document.getElementById('registration-section').style.display = 'none';
            document.getElementById('login-section').style.display = 'block';
        } else {
            document.getElementById('registration-response').innerText = data.message || 'Error registering user';
        }
    } catch (error) {
        console.error('Error registering user:', error);
        document.getElementById('registration-response').innerText = 'Server error';
    }
}

// Function to handle user login
async function loginUser(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (response.ok) {
            userId = data.userId; // Store user ID for future requests
            document.getElementById('username-display').innerText = data.username;
            document.getElementById('roll-number-display').innerText = data.rollNumber;
            document.getElementById('casual-leave-display').innerText = data.casualLeave;
            document.getElementById('medical-leave-display').innerText = data.medicalLeave;
            document.getElementById('balance-section').style.display = 'block';
            document.getElementById('apply-leave-section').style.display = 'block';
            document.getElementById('login-section').style.display = 'none';
            document.getElementById('registration-section').style.display = 'none'; // Hide registration if it was visible
            document.getElementById('logout-button').style.display = 'block'; // Show logout button
        } else {
            document.getElementById('response-message').innerText = data.message || 'Error logging in';
        }
    } catch (error) {
        console.error('Error logging in:', error);
        document.getElementById('response-message').innerText = 'Server error';
    }
}

// Function to handle user logout
function logoutUser() {
    // Hide user-related sections
    document.getElementById('balance-section').style.display = 'none';
    document.getElementById('apply-leave-section').style.display = 'none';
    document.getElementById('logout-button').style.display = 'none'; // Hide logout button
    document.getElementById('login-section').style.display = 'block'; // Show login section
    document.getElementById('registration-section').style.display = 'none'; // Hide registration section
    document.getElementById('response-message').innerText = ''; // Clear response messages

    // Reset user info
    document.getElementById('username-display').innerText = '';
    document.getElementById('roll-number-display').innerText = '';
    document.getElementById('casual-leave-display').innerText = 'Loading...';
    document.getElementById('medical-leave-display').innerText = 'Loading...';
}

// Function to refresh leave balance
async function refreshLeaveBalance() {
    try {
        const response = await fetch(`/api/leave-balance/${userId}`);
        const data = await response.json();
        if (response.ok) {
            document.getElementById('casual-leave-display').innerText = data.casualLeave;
            document.getElementById('medical-leave-display').innerText = data.medicalLeave;
        } else {
            document.getElementById('response-message').innerText = data.message || 'Error fetching balance';
        }
    } catch (error) {
        console.error('Error refreshing balance:', error);
        document.getElementById('response-message').innerText = 'Server error';
    }
}

// Function to apply for leave
async function applyLeave(event) {
    event.preventDefault();

    const type = document.getElementById('leave-type').value;
    const days = parseInt(document.getElementById('leave-days').value);

    try {
        const response = await fetch(`/api/apply-leave/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ type, days }),
        });

        const data = await response.json();

        if (response.ok) {
            document.getElementById('casual-leave-display').innerText = data.casualLeave;
            document.getElementById('medical-leave-display').innerText = data.medicalLeave;
            document.getElementById('response-message').innerText = data.message;
            document.getElementById('leave-form').reset(); // Reset leave form
        } else {
            document.getElementById('response-message').innerText = data.message || 'Error applying for leave';
        }
    } catch (error) {
        console.error('Error applying for leave:', error);
        document.getElementById('response-message').innerText = 'Server error';
    }
}

// Event listeners
document.getElementById('registration-form').addEventListener('submit', registerUser);
document.getElementById('login-form').addEventListener('submit', loginUser);
document.getElementById('refresh-balance').addEventListener('click', refreshLeaveBalance);
document.getElementById('logout-button').addEventListener('click', logoutUser); // Logout event listener
document.getElementById('leave-form').addEventListener('submit', applyLeave); // Apply leave event listener

// Show Login Section
document.getElementById('show-login').addEventListener('click', function () {
    document.getElementById('login-section').style.display = 'block';
    document.getElementById('registration-section').style.display = 'none';
});

// Show Registration Section
document.getElementById('show-registration').addEventListener('click', function () {
    document.getElementById('registration-section').style.display = 'block';
    document.getElementById('login-section').style.display = 'none';
});
