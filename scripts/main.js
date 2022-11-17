


function insertName() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if a user is signed in:
        if (user) {
            // Do something for the currently logged-in user here: 
            console.log(user.uid);
            console.log(user.displayName);
            user_Name = user.displayName;

            //method #1:  insert with html only
            //document.getElementById("name-goes-here").innerText = user_Name;    //using javascript
            //method #2:  insert using jquery
            $("#name-goes-here").text(user_Name); //using jquery

        } else {
            // No user is signed in.
        }
    });
}
insertName(); //run the function

function readQuote() {
    db.collection("quotes").doc("tuesday") //name of the collection and documents should matach excatly with what you have in Firestore
        .onSnapshot(tuesdayDoc => { //arrow notation
            //console.log("current document data: " + tuesdayDoc.data()); //.data() returns data object
            document.getElementById("quote-goes-here").innerHTML = tuesdayDoc.data().quote; //using javascript to display the data on the right place

            //Here are other ways to access key:value data fields
            //$('#quote-goes-here').text(tuesdayDoc.data().quote);                                       //using jquery object dot notation
            //$("#quote-goes-here").text(tuesdayDoc.data()["quote"]);                                    //using json object indexing
        })
}
readQuote(); //calling the function

function writeHikes() {
    //define a variable for the collection you want to create in Firestore to populate data
    var hikesRef = db.collection("hikes");

    hikesRef.add({
        code: "BBY01",
        name: "Burnaby Lake Park Trail", //replace with your own city?
        city: "Burnaby",
        province: "BC",
        level: "easy",
        length: "10",
        details: "Elmo goes here regularly",
        last_updated: firebase.firestore.FieldValue.serverTimestamp()
    });
    hikesRef.add({
        code: "AM01",
        name: "Buntzen Lake Trail Trail", //replace with your own city?
        city: "Anmore",
        province: "BC",
        level: "moderate",
        length: "10.5",
        details: "Elmo goes here regularly",
        last_updated: firebase.firestore.FieldValue.serverTimestamp()
    });
    hikesRef.add({
        code: "NV01",
        name: "Mount Seymoure Trail", //replace with your own city?
        city: "North Vancouver",
        province: "BC",
        level: "hard",
        length: "8.2",
        details: "Elmo goes here regularly",
        last_updated: firebase.firestore.Timestamp.fromDate(new Date("March 10, 2022"))
    });
}


function displayCards(collection) {
    let cardTemplate = document.getElementById("hikeCardTemplate");

    db.collection(collection)
        //.where("level", "==", "moderatejlj")
        .get()
        .then(snap => {
            console.log(snap.empty);
            //var i = 1;  //if you want to use commented out section
            snap.forEach(doc => { //iterate thru each doc
                var title = doc.data().name;        // get value of the "name" key
                var details = doc.data().details;   // get value of the "details" key
				var hikeID = doc.data().code;    //get unique ID to each hike to be used for fetching right image
                let newcard = cardTemplate.content.cloneNode(true);

                //update title and text and image
                newcard.querySelector('.card-title').innerHTML = title;
                newcard.querySelector('.card-text').innerHTML = details;
                newcard.querySelector('.card-image').src = `./images/${hikeID}.jpg`; //Example: NV01.jpg

                //give unique ids to all elements for future use
                // newcard.querySelector('.card-title').setAttribute("id", "ctitle" + i);
                // newcard.querySelector('.card-text').setAttribute("id", "ctext" + i);
                // newcard.querySelector('.card-image').setAttribute("id", "cimage" + i);

                //attach to gallery
                document.getElementById(collection + "-go-here").appendChild(newcard);
                //i++;   //if you want to use commented out section
            })
        })
}
displayCards("hikes");

function populateCardsDynamically() {
    let hikeCardTemplate = document.getElementById("hikeCardTemplate");  //card template
    let hikeCardGroup = document.getElementById("hikeCardGroup");   //where to append card
    
    //doublecheck: is your Firestore collection called "hikes" or "Hikes"?
    db.collection("hikes").get()   
        .then(allHikes => {
            allHikes.forEach(doc => {
                var hikeName = doc.data().name; //gets the name field
                var hikeID = doc.data().code; //gets the unique ID field
                var hikeLength = doc.data().length; //gets the length field
                let testHikeCard = hikeCardTemplate.content.cloneNode(true);
                testHikeCard.querySelector('.card-title').innerHTML = hikeName;
                testHikeCard.querySelector('.card-length').innerHTML = hikeLength;
                testHikeCard.querySelector('a').onclick = () => setHikeData(hikeID);

                //next 2 lines are new for demo#11
                //this line sets the id attribute for the <i> tag in the format of "save-hikdID" 
                //so later we know which hike to bookmark based on which hike was clicked
                testHikeCard.querySelector('i').id = 'save-' + hikeID;
                // this line will call a function to save the hikes to the user's document             
                testHikeCard.querySelector('i').onclick = () => saveBookmark(hikeID);

                testHikeCard.querySelector('img').src = `./images/${hikeID}.jpg`;
                hikeCardGroup.appendChild(testHikeCard);
            })
        })
}

//-----------------------------------------------------------------------------
// This function is called whenever the user clicks on the "bookmark" icon.
// It adds the hike to the "bookmarks" array
// Then it will change the bookmark icon from the hollow to the solid version. 
//-----------------------------------------------------------------------------
function saveBookmark(hikeID) {
    currentUser.set({
            bookmarks: firebase.firestore.FieldValue.arrayUnion(hikeID)
        }, {
            merge: true
        })
        .then(function () {
            console.log("bookmark has been saved for: " + currentUser);
            var iconID = 'save-' + hikeID;
            //console.log(iconID);
						//this is to change the icon of the hike that was saved to "filled"
            document.getElementById(iconID).innerText = 'bookmark';
        });
}


