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
			return cardsData;
		})

		firebase.firestore().collection(uid).doc(id).update({
			cards : cardsData,
		})
	}

	static async getAllBoard(uid){
		const data = await firebase.firestore().collection(uid).get();
		const mainData = data.docs.map(doc => doc.data());
		const idData = data.docs.map(doc => doc.id);
		mainData.map((data,index) => mainData[index].id = idData[index]);
		return mainData;
	}

	static async getProfile(uid){
		let data = await firebase.firestore().collection(uid).doc("data").get();
		return data.data();
	}

	static async userSignIn(email, password){
		try{
			firebase.auth().signInWithEmailAndPassword(email,password);
			return true;
		}catch(error){
			return error;
		}
	}

	static async saveProfile(uid,profile){
		let data = await firebase.firestore().collection(uid).doc("data").update(profile).then(data=>{return true}).catch((error)=>{
			return error;
		});

		return data;
	}

	static async updateColumns(uid,id,data){
		let returnData = {};

		data.map((colData,i)=>{
			returnData = {...returnData,[i] : colData.map((cardData,i2)=>{return JSON.stringify(cardData)})}
		});

		let resp = await firebase.firestore().collection(uid).doc(id).update({columns : returnData}).then(dat2=>{return true}).catch((error)=>{return error;});
		return resp;
	}
}

export default FirebaseAction;