var currentUser; //put this right after you start script tag before writing any functions.

function populateInfo() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if user is signed in:
        if (user) {

            //go to the correct user document by referencing to the user uid
            currentUser = db.collection("users").doc(user.uid)
            //get the document for current user.
            currentUser.get()
                .then(userDoc => {
                    //get the data fields of the user
                    var userAddedhabits = userDoc.data().addedhabits;
                    if (userAddedhabits != null) {
                        document.getElementById("addedhabits").value = userAddedhabits;
                    }
                })
        } else {
            // No user is signed in.
            console.log("No user is signed in");
        }
    });
}

// //call the function to run it 
// populateInfo();

function editHabit() {
    //Enable the form fields
    document.getElementById('personalInfoFields').disabled = false;
}

function saveHabit() {
    userAddedhabits = document.getElementById('addedhabits').value;

    console.log(userAddedhabits)
    $("#addedhabits").text(userAddedhabits);

    currentUser.update({
            manualhabits: userAddedhabits
        })
        .then(() => {
            console.log("Document successfully updated!");
        })

    document.getElementById('personalInfoFields').disabled = true;
}



function checkboxListen() {
    console.log("inside checkboxListen");
    document.getElementById("enterHabit").addEventListener("click", function () {
        var poortime = document.getElementById("poor-time").checked;
        var lacksleep = document.getElementById("lack-sleep").checked;
        var lackexercise = document.getElementById("lack-sleep").checked;
        var lackwater = document.getElementById("lack-water").checked;
        var lackposture = document.getElementById("lack-posture").checked;
        var phoneaddiction = document.getElementById("phone-addict").checked;
        var gameaddiction = document.getElementById("game-addict").checked;
        var gamblingaddiction = document.getElementById("gamble-addict").checked;
        console.log(poortime, lacksleep, lackexercise, lackwater, lackposture, phoneaddiction,
            gameaddiction, gamblingaddiction);


        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                db.collection("users").doc(user.uid).set({
                    poortime: poortime,
                    lacksleep: lacksleep,
                    lackexercise: lackexercise,
                    lackwater: lackwater,
                    lackposture: lackposture,
                    phoneaddiction: phoneaddiction,
                    gameaddiction: gameaddiction,
                    gamblingaddiction: gamblingaddiction
                }, {
                    merge: true
                })
            } else {
                // No user is signed in.
            }
        });
    })
}
checkboxListen();


function saveHabit() {
    console.log("inside write habit");
    var poortime = document.getElementById("poor-time").value;
    var lacksleep = document.getElementById("lack-sleep").value;
    var lackexercise = document.getElementById("lack-sleep").value;
    var lackwater = document.getElementById("lack-water").value;
    var lackposture = document.getElementById("lack-posture").value;
    var phoneaddiction = document.getElementById("phone-addict").value;
    var gameaddiction = document.getElementById("game-addict").value;
    var gamblingaddiction = document.getElementById("gamble-addict").value;

    console.log(poortime, lacksleep, lackexercise, lackwater, lackposture, phoneaddiction,
        gameaddiction, gamblingaddiction);

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            var currentUser = db.collection("users").doc(user.uid)
                .update({
                    time: poortime,
                    sleep: lacksleep,
                    exercise: lackexercise,
                    water: lackwater,
                    posture: lackposture,
                    phone: phoneaddiction,
                    game: gameaddiction,
                    gamble: gamblingaddiction,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()

                }).then(() => {
                    window.location.href = "viewhabits.html"; //new line added
                })

        } else {
            // No user is signed in.
        }
    });

}