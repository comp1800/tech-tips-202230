function populateCardsDynamically() {
    let cardTemplate = document.getElementById("cardTemplate");  //card template
    let hikeCardGroup = document.getElementById("exercises-go-here");   //where to append card
    //hikeCardGroup.innerHTML = "";
    //doublecheck: is your Firestore collection called "hikes" or "Hikes"?
    db.collection("hikes").get()
        .then(allHikes => {
            allHikes.forEach(doc => {
                console.log("running");
                var solutionName = doc.data().name; //gets the name field
                var solutionID = doc.data().code; //gets the unique ID field  (doublecheck that this matches the key name
                var solutionLength = doc.data().length; //gets the length field
                var solutionDifficult = doc.data().difficulty;
                var solutionSteps = doc.data().steps;
                var solutionVideo = doc.data().video;
                let testHikeCard = cardTemplate.content.cloneNode(true);
                testHikeCard.querySelector('.card-title').innerHTML = solutionName + "blah blah balh";
                testHikeCard.querySelector('.card-length').innerHTML = solutionLength;
                testHikeCard.querySelector('.card-difficulty').innerHTML = solutionDifficult;
                testHikeCard.querySelector('.card-text').innerHTML = solutionSteps;
                testHikeCard.querySelector('.video-id').innerHTML = solutionVideo + "BLAH";
                //testHikeCard.querySelector('i').onclick = () => setHikeData(solutionID);
                //testHikeCard.querySelector('i').onclick = () => setHikeData(solutionID);
                //next 2 lines are new for demo#11
                //this line sets the id attribute for the <i> tag in the format of "save-hikdID"
                //so later we know which hike to bookmark based on which hike was clicked
                //testHikeCard.querySelector('i').id = 'save-' + solutionID;
                // this line will call a function to save the hikes to the user's document
                testHikeCard.querySelector('i').onclick = () => saveBookmark(solutionID);
                testHikeCard.querySelector('img').src = `./images/${solutionID}.jpg`;
                console.log(testHikeCard);
                hikeCardGroup.appendChild(testHikeCard);
            })
        })
}
populateCardsDynamically();
//-----------------------------------------------------------------------------
// This function is called whenever the user clicks on the "bookmark" icon.
// It adds the hike to the "bookmarks" array
// Then it will change the bookmark icon from the hollow to the solid version.
//-----------------------------------------------------------------------------
function saveBookmark(solutionID) {
    console.log("inside save book marks");
    currentUser.set({
        bookmarks: firebase.firestore.FieldValue.arrayUnion(solutionID)
    }, {
        merge: true
    })
        .then(function () {
            console.log("bookmark has been saved for: " + currentUser);
            var iconID = 'save-' + solutionID;
            //console.log(iconID);
            //this is to change the icon of the hike that was saved to "filled"
            document.getElementById(bookmarkIcon).innerText = 'bookmarks';
        });
}
function setHikeData(solutionID) {
    localStorage.setItem('solutionID', solutionID);
}

firebase.auth().onAuthStateChanged(user => {
    if (user) {
        getBookmarks(user)
    } else {
        console.log("No user is signed in");
    }
});
function getBookmarks(user) {
    db.collection("users").doc(user.uid).get()
        .then(userDoc => {
            var bookmarks = userDoc.data().bookmarks;
            console.log(bookmarks);
            let cardTemplate = document.getElementById("cardTemplate");
            let hikeCardGroup = document.getElementById("exercises-go-here");
            bookmarks.forEach(thisHikeID => {
                console.log(thisHikeID);
                db.collection("hikes").where("code", "==", thisHikeID).get().then(snap => {
                    size = snap.size;
                    if (size == 1) {
                        snap.forEach(doc => {
                        var solutionName = doc.data().name; //gets the name field
                        var solutionID = doc.data().code; //gets the unique ID field  (doublecheck that this matches the key name
                        var solutionLength = doc.data().length; //gets the length field
                        var solutionDifficult = doc.data().difficulty;
                        var solutionSteps = doc.data().steps;
                        var solutionVideo = doc.data().video;
                        let newCard = cardTemplate.content.cloneNode(true);
                        newCard.querySelector('.card-title').innerHTML = solutionName;
                        newCard.querySelector('.card-length').innerHTML = solutionLength;
                        newCard.querySelector('.card-difficulty').innerHTML = solutionDifficult;
                        newCard.querySelector('.card-text').innerHTML = solutionSteps;
                        newCard.querySelector('.video-id').innerHTML = solutionVideo;
                        newCard.querySelector('img').src = `./images/${solutionID}.jpg`;
                        hikeCardGroup.appendChild(newCard);
                        })
                    } else {
                        console.log("Query has more than one data")
                    }
                })
            });
        })
}