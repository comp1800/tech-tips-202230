function findNextSlot(){

    //get current date and time
    var date = new Date();

    //get day of the week
    var dayOfWeek = date.getDay();   //returns 0-6, 0 is sunday
    switch (dayOfWeek) {
        case 1:
            prefix = "m";
            break;
        case 2:
            prefix = "t";c
            break;
        case 3:
            prefix = "w";
            break;
        case 4:
            prefix = "th";
            break;
        case 5:
            prefix = "f";
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
    if ( hour>=0 & hour<7 )
        console.log("You should be sleeping!");
}

findNextSlot();