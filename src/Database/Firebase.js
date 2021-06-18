import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';

var firebaseConfig = {
	apiKey: "AIzaSyDPzgO9WrITKt0v9eJAEWNEkWH1xv4agYU",
	authDomain: "trello-clone-f948b.firebaseapp.com",
	projectId: "trello-clone-f948b",
	storageBucket: "trello-clone-f948b.appspot.com",
	messagingSenderId: "891285689000",
	appId: "1:891285689000:web:0c193783aba07bb423a89d"
};

firebase.initializeApp(firebaseConfig);

export default firebase;