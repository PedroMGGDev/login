        function showLoading() {
            console.log("Carregando...");
        }

        function hideLoading() {
            console.log("Carregamento concluído.");
        }

        document.addEventListener('DOMContentLoaded', function() {
            showLoading();

            const form = {
                email: () => document.getElementById('email'),
                password: () => document.getElementById('password'),
                confirmPassword: () => document.getElementById('confirmPassword'),
                registerButton: () => document.getElementById('register-button'),
                emailRequiredError: () => document.getElementById('email-required-error'),
                emailInvalidError: () => document.getElementById('email-invalid-error'),
                passwordRequiredError: () => document.getElementById('password-required-error'),
                passwordMinLengthError: () => document.getElementById('password-min-length-error'),
                passwordDoesntMatchError: () => document.getElementById('password-doesnt-match-error')
            };

            firebase.auth().onAuthStateChanged(user => {
                hideLoading();  

                if (user) {
                    window.location.href = "../../../home.html"; 
                }
            });

            function onChangeEmail() {
                const email = form.email().value;
                form.emailRequiredError().style.display = email ? "none" : "block"; 
                form.emailInvalidError().style.display = validateEmail(email) ? "none" : "block"; 
                toggleRegisterButtonDisable(); 
            }

            function onChangePassword() {
                const password = form.password().value;
                form.passwordRequiredError().style.display = password ? "none" : "block"; 
                form.passwordMinLengthError().style.display = password.length >= 6 ? "none" : "block"; 
                validatePasswordsMatch(); 
                toggleRegisterButtonDisable(); 
            }

            function onChangeConfirmPassword() {
                validatePasswordsMatch(); 
                toggleRegisterButtonDisable(); 
            }

            function validatePasswordsMatch() {
                const password = form.password().value;
                const confirmPassword = form.confirmPassword().value;
                form.passwordDoesntMatchError().style.display = password === confirmPassword ? "none" : "block"; // Exibe erro se as senhas não coincidirem
            }

            function toggleRegisterButtonDisable() {
                form.registerButton().disabled = !isFormValid(); 
            }

            function isFormValid() {
                const email = form.email().value;
                const password = form.password().value;
                const confirmPassword = form.confirmPassword().value;

                return email && validateEmail(email) && password && password.length >= 6 && password === confirmPassword;
            }

            function register() {
                const email = form.email().value;
                const password = form.password().value;

                firebase.auth().createUserWithEmailAndPassword(email, password)
                    .then(() => {
                        window.location.href = "../welcome.html"; 
                    })
                    .catch(error => {
                        alert(getErrorMessage(error));
                    });
            }

            function getErrorMessage(error) {
                if (error.code === "auth/email-already-in-use") {
                    return "Email já está em uso";
                }
                return error.message;
            }

            function validateEmail(email) {
                const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                return re.test(email);
            }

            form.email().addEventListener('input', onChangeEmail);
            form.password().addEventListener('input', onChangePassword);
            form.confirmPassword().addEventListener('input', onChangeConfirmPassword);
            form.registerButton().addEventListener('click', register);

        });
