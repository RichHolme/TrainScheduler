
// Initialize Firebase
var config = {
    apiKey: "AIzaSyAlQKJ2vbsnIwmHwN8b6gdOo-5_bYb-MTs",
    authDomain: "train-scheduler-799d2.firebaseapp.com",
    databaseURL: "https://train-scheduler-799d2.firebaseio.com",
    projectId: "train-scheduler-799d2",
    storageBucket: "train-scheduler-799d2.appspot.com",
    messagingSenderId: "822645131563"
};

firebase.initializeApp(config);

let db = firebase.database();

// grab values from input feilds store in variables and empty
$(document).on('click', '#add-train-btn', function(event){
	// event.preventDefault();

	let name = $("#train-name-input").val().trim();
	let dest = $("#destination-input").val().trim();
	let ftime = $("#first-train-input").val().trim();
	let freq = $("#frequency-input").val().trim();

	$("#train-name-input, #destination-input, #first-train-input, #frequency-input").val('');

	// push values as child in firebase
	// this keeps all data for one train as an object in firebase
	db.ref().push({

        name: name,
        destination: dest,
        firstTime: ftime,
        frequency: freq,

    });
})

//when a child is added in firebase
//when page loads function will reun for each child in database 
db.ref().on("child_added", function(childSnapshot) {

	// grab values of child 
    let name = childSnapshot.val().name;
    let destination = childSnapshot.val().destination;

    let firstTime = childSnapshot.val().firstTime;
    let frequency = childSnapshot.val().frequency;

    // moment.js logic
    // -----------------------------------------------------------------

     // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");

    // Current Time
    var currentTime = moment();

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

    // Time apart (remainder)
    var tRemainder = diffTime % frequency;

    // Minute Until Train
    var tMinutesTillTrain = frequency - tRemainder;

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    nextTrain = moment(nextTrain).format("hh:mm");

    // Add each train's data into the table
	$("#train-table > tbody").append("<tr><td>" + name + "</td><td>" + destination + "</td><td>" +
	frequency + "</td><td>" + nextTrain + "</td><td>" + tMinutesTillTrain + "</td></tr>");
})