/* Landing Page JavaScript */

"use strict";


const loginForm = document.querySelector("#login"); //References login form, adjust as needed

loginForm.onsubmit = function (event) {
    // Prevent the form from refreshing the page,
    // as it will do by default when the Submit event is triggered:
    event.preventDefault();

    // We can use loginForm.username (for example) to access
    // the input element in the form which has the ID of "username".
    const loginData = {
        username: loginForm.username.value,
        password: loginForm.password.value,
    }

    // Time to actually process the login using the function from auth.js!
    login(loginData)
        .then(response => response.json())
        .then(data => {
            const accessToken = loginData.accessToken;
            const user = loginData.user;

            storeAccessToken(accessToken);
            storeUserData(user);

            console.log(data);
        });
};