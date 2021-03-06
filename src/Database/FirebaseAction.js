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
		return await firebase.auth().signInWithEmailAndPassword(email,password).then(data=>{
			return data.user.uid;
		}).catch(error=>{return error});
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

	static async createNewBoard(uid,data){
		let board = {
			info : JSON.stringify(data),
			allowedUsers : [uid],
			columns : {},
		};

		let fbaction = await firebase.firestore().collection(uid).add(board);
		let increment = firebase.firestore.FieldValue.increment(1);

		let countBoard = await firebase.firestore().collection(uid).doc("data").update({
			boards : increment,
		});
		return fbaction;
	}

	static async updateBoardInfo(uid,id,data){
		let resp = await firebase.firestore().collection(uid).doc(id).update({
			info : JSON.stringify(data),
		}).then((data=>{return true;}))
		.catch(console.error);
		return resp;
	}

	static async userSignUp(email,password){
		await firebase.auth().createUserWithEmailAndPassword(email, password).then(data=>{
			firebase.firestore().collection(data.user.uid).doc("data").set({
				boardBackground : "#000000",
				cardBackground : "#000000",
				display : data.user.email,
				profilePicture : "",
			}).catch(console.error);

			return data.user.uid;
		}).catch((error)=>{
			return error;
		})
	}

	static async uploadProfilePicture(uid,file){
		const ref = firebase.storage().ref();
		const meta = {contentType : file.type};
		const name = uid+"."+(file.name.split(".")[file.name.split(".").length-1]);
		const task = ref.child(name).put(file,meta);
		
		return await task.then(data=>{
			return data;
		}).catch((error)=>{
			return error;
		});
	}

	static async deleteBoard(uid,id){
		return await firebase.firestore().collection(uid).doc(id).delete().then(data=>{
			let increment = firebase.firestore.FieldValue.increment(-1);

			let countBoard = firebase.firestore().collection(uid).doc("data").update({
				boards : increment,
			});

			return data;
		}).catch(console.error);
	}
}

export default FirebaseAction;