var firebaseConfig = {
  apiKey: "AIzaSyAbtkdpWGlzcXWE--IzYEOceQzBbZ0nNAk",
  authDomain: "credibilityanalyser-80d85.firebaseapp.com",
  projectId: "credibilityanalyser-80d85",
  storageBucket: "credibilityanalyser-80d85.firebasestorage.app",
  messagingSenderId: "1071481437263",
  appId: "1:1071481437263:web:8a5fd5b21dca9f41ac3e3a",
  // measurementId: "G-2RXP0S8SLX"
};

firebase.initializeApp(firebaseConfig);

//firebase.analytics();
const auth = firebase.auth();

function signUp() {
  var email = document.getElementById("email");
  var password = document.getElementById("password");
  const promise = auth.createUserWithEmailAndPassword(email.value, password.value);
  firebase.auth().createUserWithEmailAndPassword(email.value, password.value).then(res => {
    console.log(res);
    window.location.href = "./pages/submission.html";
  }
  ).catch((error) => {
    console.log(error["code"]);
    alert(error);
  });
  // console.log(promise);
  // promise.catch(e => alert(e.message));

  // alert("Signed Up");
}

function signIn() {
  var email = document.getElementById("email");
  var password = document.getElementById("password");
  var res;
  // const promise = auth.signInWithEmailAndPassword(email.value, password.value);
  firebase.auth().signInWithEmailAndPassword(email.value, password.value).then(res => {
    console.log(res);
    window.location.href = "./pages/submission.html";
  }
  ).catch((error) => {
    console.log(error["code"]);
    alert(error);
  });
}

function signOut() {
  window.location.href = "../index.html";
  console.log("signed out");
  alert("Signed out");
}

// auth.onAuthStateChanged(function(user)
// {
//     if(user)
//     {
//       var email = user.email;
//       alert("Active User: "+ email);    
//     }
//     else{
//       alert("No active user.");
//     }
// });
//</script>