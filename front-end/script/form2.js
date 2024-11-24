// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
  apiKey: "AIzaSyAbtkdpWGlzcXWE--IzYEOceQzBbZ0nNAk",
  authDomain: "credibilityanalyser-80d85.firebaseapp.com",
  projectId: "credibilityanalyser-80d85",
  storageBucket: "credibilityanalyser-80d85.firebasestorage.app",
  messagingSenderId: "1071481437263",
  appId: "1:1071481437263:web:8a5fd5b21dca9f41ac3e3a",
  measurementId: "G-2RXP0S8SLX"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
const database = firebase.database();

var theUserId;
var suspectList;

async function signUp() {
	//Jai bhole nath
	//get the email id and password
	var email = document.getElementById("email");
	var password = document.getElementById("password");
	if (email.value == "" || password.value == "") {
		alert('Please input both ID and password');
		return;
	}
	console.log(email.value + '-' + password.value);
	var duplicateFound = false;
	//Look for the email in the records, if it exist then tell it exists
	var token = await database.ref('/users/');
	await token.once('value', (snapshot) => {
		const data = snapshot.val();
		for (var i in data) {
			// console.log(data[i]["email"]);
			if (data[i]["email"] == email.value) {
				console.log('Duplicate found');
				alert('The id already exists, please login\n');
				duplicateFound = true;
				return;
			}
		}
	});
	if (duplicateFound == false) {
		token.push().set({
			email: email.value,
			password: password.value,
		});
		alert('Account created');
	}
}

async function signIn() {
	var email = document.getElementById("email");
	var password = document.getElementById("password");
	if (email.value == "" || password.value == "") {
		alert('Please input both ID and password');
		return;
	}
	var idFound = false;
	var token = await database.ref('/users/');
	await token.once('value', (snapshot) => {
		const data = snapshot.val();
		for (var i in data) {
			if (data[i]["email"] == email.value && data[i]["password"] == password.value) {
				theUserId = i;
				sessionStorage.setItem("userKey", theUserId);
				console.log('ID is' + i);
				idFound = true;
				if (data[i]['suspectList'] != null) {
					suspectList = data[i]["suspectList"];
					sessionStorage.setItem("suspectList", JSON.stringify(suspectList));
					console.log(suspectList);
					sessionStorage.setItem("listIsEmpty", "false");
				}
				else {
					sessionStorage.setItem("listIsEmpty", "true");
					console.log('found empty list');
				}
				window.location.href = "./pages/selectSuspect.html";
			}
		}
	});
	if (idFound == false) {
		alert('Please enter correct id and password');
		return;
	}
}

function validateDetails(name, idnumber, dob) {
	if (/\d/.test(name))
		return "Name cannot have a number in it!";
	if (idnumber.toString().length != 12)
		return "Enter valid aadhar number";
	const arr = dob.split("-");
	var tonumber = parseInt(arr[0]);
	if (tonumber >= 2021)
		return "Please enter a valid date of birth";
	return "";
}

function fillSuspectList() {

	if (sessionStorage.getItem("listIsEmpty") == "false") {
		var thelist = JSON.parse(sessionStorage.getItem("suspectList"));
		// console.log(thelist);
		for (let k in thelist) {
			$(document).ready(function () {
				$('#outerdiv').append('<div class="card"><h5 class="card-header">' + 'Crime: ' + thelist[k]['crime'] + '</h5><div class="card-body"><h5 class="card-title">' + 'Suspect name : ' + thelist[k]['name'] + '</h5><p class="card-text">' + 'Date of birth: ' + thelist[k]['dob'] + '</p><a href="#" class="btn btn-primary" onclick="goToSubmission(\'' + k + '\')">Enter Statement</a></div></div>');
			});
			console.log(thelist[k]['name'] + ' ' + thelist[k]['phone'] + ' ' + thelist[k]['dob']);
		}
	}

	document.getElementById("selectSuspect").addEventListener("click", function (event) {
		event.preventDefault();
	}, false);

	document.getElementById("submitButton").addEventListener("click", function (event) {
		event.preventDefault();
	}, false);

	//below code is for adding to database when button is clicked
	document.getElementById("submitButton").addEventListener("click", function (event) {
		console.log('Prevent kiya nigga');
		var name = document.getElementById("name").value;
		var height = document.getElementById("height").value;
		var weight = document.getElementById("weight").value;
		var idnumber = document.getElementById("idnumber").value;
		var dob = document.getElementById("dob").value;
		var crime = document.getElementById("crime").value;
		var hypo = document.getElementById("hypo").value;
		var gender;
		if (document.getElementById("male").checked) {
			gender = 'male';
		}
		else if (document.getElementById("female").checked) {
			gender = 'female';
		}

		var validationInfo = validateDetails(name, idnumber, dob);
		if (validationInfo != "") {
			alert(validationInfo);
			return;
		}
		console.log(sessionStorage.getItem("userKey") + ' ' + name + ' ' + height + ' ' + weight + ' ' + idnumber + ' ' + dob + ' ' + gender + ' ' + crime + ' ' + hypo);

		console.log('/users/' + sessionStorage.getItem("userKey") + '/suspectList/');

		var rootref = database.ref();
		var storeref = rootref.child('/users/' + sessionStorage.getItem("userKey") + '/suspectList/');
		var newdata = storeref.push();
		newdata.set({
			name: name,
			height: height,
			weight: weight,
			idnumber: idnumber,
			dob: dob,
			gender: gender,
			crime: crime,
			hypo: hypo,
		});
		alert('Record added successfully');
		event.preventDefault();
	}, false);

}


function goToSubmission(suspectId) {
	sessionStorage.setItem("suspectId", suspectId);
	console.log('suspect id is ' + sessionStorage.getItem("suspectId"));
	window.location.href = "./submission.html";
}

function signOut() {
	window.location.href = "../index.html";
	console.log("signed out");
	alert("Signed out");
}

function showInputForm() {
	document.getElementById("showInputForm").style.display = "block";
	document.getElementById("showSelectSuspect").style.display = "none";
}

function showSelectSuspect() {
	document.getElementById("showInputForm").style.display = "none";
	document.getElementById("showSelectSuspect").style.display = "block";
}

// document.getElementById("submitButton").addEventListener("click", function (event) {
// 	console.log('Prevent kiya nigga');
// 	event.preventDefault();
// }, false);


async function storeSuspectData() {

}