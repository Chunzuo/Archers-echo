import firebase from 'firebase/app'

// Initialize Firebase
var config = {
    apiKey: "AIzaSyB4yWIPlVfm5pb0sSbFv-LdUpOUUqr31uA",
    authDomain: "archersecho.firebaseapp.com",
    databaseURL: "https://archersecho.firebaseio.com",
    projectId: "archersecho",
    storageBucket: "archersecho.appspot.com",
    messagingSenderId: "624082431931"
};

firebase.initializeApp(config);