firebase.auth().onAuthStateChanged(user => {
    if (user) {
    }
});

function onChangeEmail() {
    toggleButtonsDisable();
    toggleEmailErrors();
}

function onChangePassword() {
    toggleButtonsDisable();
    togglePasswordErrors();
}

function login() {
    const email = form.getEmail().value;
    const password = form.getPassword().value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log("Usuário logado com sucesso:", userCredential.user);
            window.location.href = "ai/home.html";
        })
        .catch((error) => {
            console.error("Erro ao logar:", error.message);
            alert("Erro ao logar: " + error.message);
        });
}

function redirectToRegisterPage() {
    window.location.href = "pages/register/register.html";
}

function recoverPassword() {
    const email = form.getEmail().value;
    if (!email) {
        alert('Por favor, insira o email.');
        return;
    }

    showLoading();
    firebase.auth().sendPasswordResetEmail(email)
        .then(() => {
            hideLoading();
            alert('Email de recuperação enviado com sucesso!');
        })
        .catch((error) => {
            hideLoading();
            alert(getErrorMessage(error));
        });
}

function getErrorMessage(error) {
    switch (error.code) {
        case "auth/user-not-found":
            return "Usuário não encontrado.";
        case "auth/invalid-email":
            return "Email inválido.";
        case "auth/wrong-password":
            return "Senha inválida.";
        default:
            return error.message;
    }
}

function toggleEmailErrors() {
    const email = form.getEmail().value;
    form.getEmailRequiredError().style.display = email ? "none" : "block";
    form.getEmailInvalidError().style.display = validateEmail(email) ? "none" : "block";
}

function togglePasswordErrors() {
    const password = form.getPassword().value;
    form.getPasswordRequiredError().style.display = password ? "none" : "block";
}

function toggleButtonsDisable() {
    const emailValid = isEmailValid();
    const passwordValid = isPasswordValid();

    form.getRecoverPasswordButton().disabled = !emailValid; 
    form.getLoginButton().disabled = !(emailValid && passwordValid); 
}

function isEmailValid() {
    const email = form.getEmail().value;
    return email && validateEmail(email);
}

function isPasswordValid() {
    const password = form.getPassword().value;
    return password && password.length >= 6;
}

const form = {
    getEmail: () => document.getElementById("email"),
    getEmailInvalidError: () => document.getElementById("email-invalid-error"),
    getEmailRequiredError: () => document.getElementById("email-required-error"),
    getLoginButton: () => document.getElementById("login-button"),
    getPassword: () => document.getElementById("password"),
    getPasswordRequiredError: () => document.getElementById("password-required-error"),
    getRecoverPasswordButton: () => document.getElementById("recover-password-button"),
};

function showLoading() {
    const div = document.createElement("div");
    div.classList.add("loading", "centralize");

    const spinner = document.createElement("div");
    spinner.classList.add("spinner");

    div.appendChild(spinner);

    const label = document.createElement("label");
    label.innerText = "Carregando...";
    div.appendChild(label);

    document.body.appendChild(div);
}

function hideLoading() {
    const loadings = document.getElementsByClassName("loading");
    if (loadings.length) {
        loadings[0].remove();
    }
}

function validateEmail(email) {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
}

function validatePassword(password) {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/; 
    return regex.test(password);
}

function checkAuthentication() {
    showLoading();  

    firebase.auth().onAuthStateChanged(user => {
        hideLoading();  

        if (user) {
            window.location.href = "ai/home.html"; 
        }
    });
}

document.addEventListener('DOMContentLoaded', checkAuthentication);
