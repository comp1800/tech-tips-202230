function writeSomeSteps(){
    var today = "monday"
    var prefix = "m"
    db.collection("directions").doc(today).set({
        m0: ["do this", "do this"],
        m1: ["do that", "do that", "do that"],
        m2: ["do this"]     //and so on...
    })
    today = "tuesday"
    prefix = "t"
    db.collection("directions").doc(today).set({
        t0: ["do this", "do this"],
        t1: ["do that", "do that", "do that"],
        t2: ["do this"]     //and so on...
    })
    today = "monday"
    prefix = "m"
    db.collection("directions").doc(today).set({
        m0: ["do this", "do this"],
        m1: ["do that", "do that", "do that"],
        m2: ["do this"]     //and so on...
    })
}

function findNextSlot(){

    //get current date and time
    var date = new Date();

    //get day of the week
    var dayOfWeek = date.getDay();   //returns 0-6, 0 is sunday
    switch (dayOfWeek) {
        case 1:
            prefix = "m";
            today = "monday";
            break;
        case 2:
            prefix = "t";
            today = "tuesday";
            break;
        case 3:
            prefix = "w";
            today = "wednesday";
            break;
        case 4:
            prefix = "th";
            today = "thursday";
            break;
        case 5:
            prefix = "f";
            today = "friday";
            break;
        default:
            prefix = "x";
            break;
    }

    //get hour and minutes
    var hour = date.getHours();  //returns 0-23
    var minutes = date.getMinutes();   //returns 0-59
    console.log(hour);
    console.log(minutes);

    //calculate the slot that will come next in my schedule
    if ((hour>8) && (minutes<30)) {
        slot = prefix+"1";
        console.log("your next block is 8:30 " + slot);
    }
    if ( ((hour>8)&&(minutes>30)) || ((hour>9)&&(minutes<30)) ){
        slot = prefix+"2";
        console.log("your next block is 9:30 " + slot);
    }
    if ( ((hour>9)&&(minutes<30)) || ((hour>10)&&(minutes<30)) ){
        slot = prefix+"3";
        console.log("your next block is 10:30 " + slot);
    }
    // and so on 

    showSteps(today, slot);

}
findNextSlot();

function showSteps(today, slot){
    document.getElementById("steps-title-goes-here").innerHTML = "Current slot is " + slot

    db.collection("directions").doc(today).get()
    .then(doc=>{
        var steps = doc.data()[slot];     //key is "m0", use index to get "m0" value
        console.log(steps);
        var msg = "<ul>";
        steps.forEach(step=>{
            msg += "<li>"+step;
        })
        msg += "</ul>"
        document.getElementById("steps-go-here").innerHTML = msg;
    })
}
showSteps();