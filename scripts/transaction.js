function getTransaction() {
  Item = localStorage.getItem("Item");

  db.collection("transactions").where("item", "==", Item)
    .get()
    .then(queryTransaction => {
      //see how many results you have got from the query
      size = queryTransaction.size;
      // get the documents of query
      Transactions = queryTransaction.docs;

      // We want to have one document per hike, so if the the result of 
      //the query is more than one, we can check it right now and clean the DB if needed.
      // if (size = 1) {
      //   var thisTransaction = Transactions[0].data();
      //   var name = thisTransaction.name;
      //   document.getElementById("HikeName").innerHTML = name;
      // } else {
      //   console.log("Query has more than one data")
      // }
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });
}
getTransaction();

function addTransaction() {
  console.log("in")
  var Item = document.getElementById("item").value;
  var Category = document.getElementById("category").value;
  var Cost = document.getElementById("cost").value;
  var Date = document.getElementById("date").value;
  console.log(Item, Category, "$" + Cost, Date);

  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      //alert("going to add soon");
      //alert(user.uid);
      db.collection("users").doc(user.uid)
        .collection("transactions")
        .add({
          item: Item,
          category: Category,
          cost: Cost,
          date: Date
        }).then(() => {
          //alert("added");
          console.log("added new transaction!");
          //window.location.href = "thanks.html"; //new line added
        })
    } else {
      console.log("no one logged in");
      // No user is signed in.
    }
  });
}

// Example starter JavaScript for disabling form submissions if there are invalid fields
function inputValidation() {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms)
    .forEach(function (form) {
      form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }

        form.classList.add('was-validated')
      }, false)
    })
}
//inputValidation();