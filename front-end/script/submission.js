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

async function fillSuspectName() {
    document.getElementById("submit").addEventListener("click", function (event) {
        event.preventDefault();
    }, false);
    var token = await database.ref('/users/' + sessionStorage.getItem('userKey') + '/suspectList/' + sessionStorage.getItem('suspectId'));
    await token.once('value', (snapshot) => {
        const data = snapshot.val();
        document.getElementById('suspectName').innerHTML = data['name'];
        document.getElementById('pre').value = data['hypo'];
        console.log(data['hypo']);
    });
}

async function analyse() {
    await fetch("http://localhost:8000/classify/", {
        method: 'POST',
        //mode: 'cors',
        //Access-Control-Allow-Headers:"Content-Type, Authorization",
        body: JSON.stringify({
            premise: document.getElementById('pre').value,
            hypothesis: document.getElementById('hypo').value,
        }),
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
            "Authorization":"Basic c2hhc2h2YXQ6cGFuZGV5",
            //"Access-Control-Allow-Methods":"POST",
            //"Access-Control-Allow-Headers":"Content-Type, Authorization"

        }
    })
        .then(function (response) {
            console.log(response);
            return response.json()
        })
        .then(function (text) {
            console.log(text);
        })
        .catch(err => {console.log(err)
        })
        setTimeout(async function () {
        await database.ref('/ans/result/').once('value', (snapshot) => {
            const data = snapshot.val();
            document.getElementById('res').value = data;
        });
    }, 200);
}