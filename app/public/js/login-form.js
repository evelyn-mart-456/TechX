async function checkLoginStatus() {
    const res = await fetch('/api/session');
    const data = await res.json();

    const loginFormContainer = document.getElementById("loginFormContainer");
    const loginForm = document.getElementById("loginForm");

    loginForm.addEventListener('submit', async(e) => {
        e.preventDefault();

        const formData = new FormData(loginForm);

        const res = await fetch('/login', {
            method: 'POST',
            body: new URLSearchParams(formData)
        });
        
        const data = await res.json();

        if(data.error)
            document.alert(data.error);
        else
            location.reload();
    });

    if(data.loggedIn) {
        loginFormContainer.innerHTML = `
            <span>Hello, ${data.username}!</span><button class="logout-button" id="logoutButton">Logout</button>
        `;

        document.getElementById("logoutButton").addEventListener('click', async () => {
            const res = await fetch('/logout');
            const data = await res.json();

            if(data.loggedOut) {
                location.reload();
            } else {
                document.alert("Logout failed");
            }
        });
    }
}

checkLoginStatus();