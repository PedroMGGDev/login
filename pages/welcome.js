        firebase.auth().onAuthStateChanged(user => {
            if (!user) {
                window.location.href = "../index.html";
            }
        });

        document.getElementById("logoutButton").addEventListener("click", function() {
            console.log("Logout clicado");
            firebase.auth().signOut().then(() => {
                window.location.href = "../index.html";
            }).catch((error) => {
                console.error("Erro ao fazer logout: ", error);
                alert("Ocorreu um erro ao tentar fazer logout.");
            });
        });
