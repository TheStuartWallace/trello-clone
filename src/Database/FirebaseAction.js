import firebase from 'Database/Firebase';
import { v4 as uuidv4 } from "uuid";

class FirebaseAction{
	static async getBoard(uid,id){
		let data = await firebase.firestore().collection(uid).doc(id).get();
		return data.data();
	}

	static async setAttachment(file){
		const ref = firebase.storage().ref();
		const meta = {contentType : file.type};
		const name = uuidv4()+"."+(file.name.split(".")[file.name.split(".").length-1]);

		const task = ref.child(name).put(file,meta);
		
		return await task;
	}

	static async updateAttachment(uid,id,card){
		let cardsData = [];

		card.map((data)=>{
			cardsData = cardsData.concat(JSON.stringify(data));
		})

		firebase.firestore().collection(uid).doc(id).update({
			cards : cardsData,
		})
	}

	static async userSignIn(email, password){
		try{
			firebase.auth().signInWithEmailAndPassword(email,password);
			return true;
		}catch(error){
			return error;
		}
	}
}

export default FirebaseAction;