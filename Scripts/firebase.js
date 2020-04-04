// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyD9WEYhxmudEmGKrdrK21KobDsuP4sIIdg",
    authDomain: "hangman-74ce3.firebaseapp.com",
    databaseURL: "https://hangman-74ce3.firebaseio.com",
    projectId: "hangman-74ce3",
    storageBucket: "hangman-74ce3.appspot.com",
    messagingSenderId: "446920435762",
    appId: "1:446920435762:web:1fcd14512650e6fa3db42b"
    };
    
    
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();