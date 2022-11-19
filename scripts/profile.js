var currentUser;
var imagefile = "./images/elmo.jpg";

// I want to get the user information from the database and put them in the form
function populateInfo() {
    firebase.auth().onAuthStateChanged(user => {
            if (user) {
                // go and get the curret user info from firestore
                currentUser = db.collection("users").doc(user.uid);

                currentUser.get()
                    .then(userDoc => {
                        let userName = userDoc.data().name;
                        let userSchool = userDoc.data().school;
                        let userCity = userDoc.data().city;
                        let picUrl = userDoc.data().profilePic; 

                        if (userName != null) {
                            document.getElementById("nameInput").value = userName;
                        }
                        if (userSchool != null) {
                            document.getElementById("schoolInput").value = userSchool;
                        }
                        if (userCity != null) {
                            console.log(userCity)
                            document.getElementById("cityInput").value = userCity;
                        }
                        if (picUrl != null){
                            console.log(picUrl);
                            $("#mypic-goes-here").attr("src", picUrl);
                        }
                        else
                        console.log("picURL is null");
                    })

            } else {
                console.log("no user is logged in")
            }
        }

    )

}
populateInfo();

function editUserInfo() {
    //Enable the form fields
    document.getElementById('personalInfoFields').disabled = false;
}

function saveUserInfo() {
    firebase.auth().onAuthStateChanged(function (user) {
        var storageRef = storage.ref("images/" + user.uid + ".jpg");
        storageRef.put(imagefile)
            .then(function () {
                console.log('Uploaded to Cloud Storage.');
                storageRef.getDownloadURL()
                    .then(function (url) { // Get URL of the uploaded file
                        console.log("Got the download URL.");
                        userName = document.getElementById('nameInput').value;
                        userSchool = document.getElementById('schoolInput').value;
                        userCity = document.getElementById('cityInput').value;
                        db.collection("users").doc(user.uid).update({
                                name: userName,
                                school: userSchool,
                                city: userCity,
                                profilePic: url // Save the URL into users collection
                            })
                            .then(function () {
                                console.log('Added Profile Pic URL to Firestore.');
                                console.log('Saved use profile info');
                                document.getElementById('personalInfoFields').disabled = true;

                            })
                    })
            })
    })
}

function listenShowUploadedPicture() {
    const fileInput = document.getElementById("mypic-input"); // pointer #1
    const image = document.getElementById("mypic-goes-here"); // pointer #2

    //attach listener to input file
    //when this file changes, do something
    fileInput.addEventListener('change', function (e) {

        //the change event returns a file "e.target.files[0]"
        var imagefile = e.target.files[0];
        var blob = URL.createObjectURL(e.target.files[0]);

        //change the DOM img element source to point to this file
        image.src = blob; //assign the "src" property of the "img" tag
    })
}
listenShowUploadedPicture();

function uploadProfilePic() {
    // Let's assume my storage is only enabled for authenticated users 
    // This is set in your firebase console storage "rules" tab

    firebase.auth().onAuthStateChanged(function (user) {
        var fileInput = document.getElementById("mypic-input"); // pointer #1
        const image = document.getElementById("mypic-goes-here"); // pointer #2

        // listen for file selection
        fileInput.addEventListener('change', function (e) {
            var file = e.target.files[0];
            var blob = URL.createObjectURL(file);
            image.src = blob; // display this image

            //store using this name
            var storageRef = storage.ref("images/" + user.uid + ".jpg");

            storageRef.put(file)
                .then(function () {
                    console.log('Uploaded to Cloud Storage.');
                    storageRef.getDownloadURL()
                        .then(function (url) { // Get URL of the uploaded file
                            console.log("Got the download URL.");
                            db.collection("users").doc(user.uid).update({
                                    "profile-pic": url // Save the URL into users collection
                                })
                                .then(function () {
                                    console.log('Added Profile Pic URL to Firestore.');
                                })
                        })
                })
        })
    })
}
uploadProfilePic();