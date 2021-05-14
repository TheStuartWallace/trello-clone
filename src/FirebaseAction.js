import firebase from './Firebase';

class FirebaseAction{
	static async getBoardList(id){
		let data = await Firebase.firestore().collection(id).collection("boards").get();
		return data.data();
	}

	static async getBoard(id){

	}
}

export default FirebaseAction;