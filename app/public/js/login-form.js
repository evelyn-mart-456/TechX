async function checkLoginStatus() {
    const res = await fetch('/api/session');
    const data = await res.json();

    const loginFormContainer = document.getElementById("loginFormContainer");
    const loginForm = document.getElementById("loginForm");

loginForm.addEventListener('submit', async(e) => {
        e.preventDefault();

        const formData = new FormData(loginForm);

        const loginRes = await fetch('/login', {
            method: 'POST',
            body: new URLSearchParams(formData)
        });
        
        const loginData = await loginRes.json();

        if(loginData.error)
            alert(loginData.error);
        else
            location.reload();
    });

    if(data.loggedIn) {
        loginFormContainer.innerHTML = `
            <span>Hello, ${data.username}!</span><button class="logout-button" id="logoutButton">Logout</button>
        `;

        document.getElementById("logoutButton").addEventListener('click', async () => {
            const logoutRes = await fetch('/logout');
            const logoutData = await logoutRes.json();

            if(logoutData.loggedOut) {
                location.reload();
            } else {
                alert("Logout failed");
            }
        });
    }
}


checkLoginStatus();