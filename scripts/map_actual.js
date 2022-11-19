   //----------------------------
    // Get radius from the slider
    //----------------------------
    var radius = document.getElementById("myRange").value;  //initial value
    document.getElementById("myRange").addEventListener("click", function () {
          radius = document.getElementById("myRange").value;
          //console.log(radius);
          document.getElementById("radius-goes-here").innerHTML = radius;
        
            radius.oninput = function(){
                output.innerHTML = radius.value;
                circle.setRadius(this.value);
                
            }
         
    })

  //----------------------------------------------------------//
  // SEACH BAR //





    
    //--------------------------------------
// MAP:  get current geolocation
//---------------------------------------
navigator.geolocation.getCurrentPosition(onSuccess, onError);
var map; //for the map to be displayed
var marker; //for current location
var circle; //for destination location
var destMarker // 

    

    //------------------------
    // handle success case
    //------------------------
    function onSuccess(position) { //callback function
      const {
        latitude,
        longitude
      } = position.coords;

      //print helpful messages about current location
      message.classList.add('success');
      message.textContent = `Your location: (${latitude},${longitude})`;
      //set map to be around current location
      //set a marker at the current location
      map = L.map('map').setView([latitude, longitude], 13);
      marker = L.marker([latitude, longitude]).addTo(map);

      //put overlay on the map, give credit wher credit is due
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);

      //create a popup when a location is clicked
      //create a circle marker when a location is clicked
      var popup = L.popup();
      var location = new L.circle();

      //Create listener, and event handler for a click
      //"e" is the clicked location
      map.on('click', onMapClick);

      function onMapClick(e) {
        //assign content to popup message
        popup
          .setLatLng(e.latlng)
          .setContent("You clicked the map at " + e.latlng.toString())
          .openOn(map);
        //remove old layers with old circles
        //create new circle around clicked location "e"
        //add it to the  map
        destMarker = e;
        map.removeLayer(location);
        location = new L.circle(e.latlng, {
          fillColor: '#f03',
          radius: radius,
        });
        map.addLayer(location);
      }
    }



//---------------SEARCH BAR-------------------------------//




        // handle error case
        function onError() {
      message.classList.add('error');
      message.textContent = `Failed to get your location!`;
    }



    // add search bar and declare it as variable



    // add to firestore
    //-----------------------------------------------
// Create a "max" number of hike document objects
//-----------------------------------------------
function writeLocationData() {
    max = 100;
    //define a variable for the collection you want to create in Firestore to populate data
    var locationRef = db.document("searched_location");
    for (i = 1; i <= max; i++) {
        locationRef.add({ //add to database, autogen ID
            name: "searched location" + i,
            details: "Your most recent search: " + i,
            last_updated: firebase.firestore.FieldValue.serverTimestamp()
        })
   }
}

console.log("got here")
document.getElementById("confirm").addEventListener("click", (e) => {
    console.log("listener is listening.");
    console.log(destMarker);
    var temp = destMarker.latlng;
    console.log(temp);
    firebase.auth().onAuthStateChanged(user => {
        // Check if user is signed in:
        if (user) {
          console.log(user);
          db.collection("users").doc(user.uid).collection("alarms").doc("alarm1").update({
            active: true,
            lat: temp.lat,
            lng: temp.lng
        }).then(function () {
          db.collection("users").doc(user.uid).update({
            radius: radius
          }).then(function() {
            console.log("inside get");
          window.location.href = "./alex_test.html"
        })
      })
        
        } else {
          // No user is signed in.
          console.log ("No user is signed in");
      }
  });
  console.log("write done.")
  
  
});
console.log("after clicker");

//-----------------------------
//new stuff by carly
//-----------------------------


function addSearchListener(){
  document.getElementById("search-button").addEventListener("click", ()=>{
    searchInput = document.getElementById("search-input").value;
    console.log(searchInput);
    searchFunction(searchInput);
  })
}
addSearchListener();

function searchFunction(){
  console.log("in serach function");
  var geocoder = L.Control.Geocoder.nominatim();
  if (typeof URLSearchParams !== 'undefined' && location.search) {
    // parse /?geocoder=nominatim from URL
    var params = new URLSearchParams(location.search);
    
    var geocoderString = params.get('geocoder');
    if (geocoderString && L.Control.Geocoder[geocoderString]) {
      console.log('Using geocoder', geocoderString);
      geocoder = L.Control.Geocoder[geocoderString]();
    } else if (geocoderString) {
      console.warn('Unsupported geocoder', geocoderString);
    }
  }

  var control = L.Control.geocoder({
    query: 'Enter Destination',
    placeholder: 'Search here...',
    geocoder: geocoder
  }).addTo(map);
}
