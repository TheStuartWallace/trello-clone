import firebase from './Firebase';

class FirebaseAction{
	static async getBoard(uid,id){
		let data = await firebase.firestore().collection(uid).doc(id).get();
		return data.data();
	}
}

export default FirebaseAction;