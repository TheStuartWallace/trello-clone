import React from 'react';
import 'Style/Profile.css';
import FirebaseAction from 'Database/FirebaseAction';
import {AuthContext} from 'Components/Auth/AuthProvider';
import {Link} from 'react-router-dom';
import NewBoardPopup from 'Components/Popup/NewBoardPopup';


export default class SignIn extends React.Component{
	static contextType = AuthContext;

	constructor(props){
		super(props);

		this.state = {
			status : 0,
			id : this.props.match.params.id,
		};

		window.document.title = "Loading...";
	}

	componentDidMount(){this.getData()}
	componentDidUpdate(){this.getData()}

	getData(){
		if(this.state.status > 0) return; 

		if(!this.state.profile){
			FirebaseAction.getProfile(this.state.id).then((data)=>{
				this.setState({profile : data, changedData : data, status : (data.private ? 2 : this.state.status )});
			});
		}

		if(this.context && this.state.mode === undefined){
			if(this.context.userSignedIn === false){
				this.setState({mode : false});
			}else if(this.context.userSignedIn === true && this.context.currentUser){
				this.setState({mode : this.context.currentUser.uid === this.state.id});
			}
		}


		/*
			Only get board details when:
				Boards is not in state
				User is signed in
				User signed in is user in ID

		*/
		if(!this.state.boards && 
			this.context.userSignedIn &&
			this.context.currentUser.uid === this.state.id

			){
				FirebaseAction.getAllBoard(this.state.id).then(data =>{
					let boardData = [];

					data.map(board=>{
						if(board.id === "data"){
							this.setState({info : board});
							return;
						}

						let columns = [];
						columns[0] = {
							id : board.id,
							...JSON.parse(board.info)
						};

						Object.values(board.columns).map(cols =>{
							let cards = [];

							cols.map(card=>{
								cards.push(JSON.parse(card));
							});

							columns.push(cards);
							return;
						});

						boardData.push([...columns]);
						return;
					});

				this.setState({boards : boardData});
			});
		}

		if(this.context.userSignedIn !== undefined && this.state.profile && this.state.mode === false) this.setState({status : 2}); // If user isn't signed in and the profile is loaded
		if(this.context.userSignedIn === true  && this.state.profile && this.state.boards && this.state.mode) this.setState({status : 1}); // If the user is signed in, the profile is loaded and this isn't their account
	}

	handleChange(event){
		this.setState({
			changedData : {...this.state.changedData,[event.target.name] : event.target.value}
		})
	}

	handleFile(event){
		this.setState({profilePictureName: event.target.value, profilePicture : event.target.files[0]});
	}

	saveChanges(){
		if(this.state.profilePictureName){
			FirebaseAction.uploadProfilePicture(this.context.currentUser.uid,this.state.profilePicture).then(snapshot => snapshot.ref.getDownloadURL()).then((url)=>{
				this.setState({changedData : {...this.state.changedData, profilePicture : url}});
			}).catch(error=>{
				this.setState({error : error});
			});
		}

		FirebaseAction.saveProfile(this.context.currentUser.uid,this.state.changedData).then(profData=>{
			this.setState({profile : this.state.changedData});
		}).catch(error =>{
			this.setState({error : error});
		});
	}

	createNewBoard(data){
		FirebaseAction.createNewBoard(this.context.currentUser.uid,data).then((data)=>{
			window.open("/b/"+data.id,"_blank");
			this.setState({renderNewBoard : false});
		}).catch(console.error);
	}

	render(){
		switch(this.state.status){

			case -1: default: return <div>Error!</div>

			case 0: return <div>Loading</div>

			case 1: return (
				<div className="pflMain">
					<left>
						<header>
							<img alt="" src={this.state.profile.profilePicture}/>
							<span>{this.state.profile.display}'s Profile</span>
						</header>

						<main>
							<div className="pflLeftBoardCount">You have {this.state.boards.length} {this.state.boards.length === 1 ? "board" : "boards" }</div>
							<div className="pflMidBoardList">
								{
									this.state.boards.map((data,index)=>{
										return (
											<Link key={index} to={"/b/"+data[0].id} target="_blank">
												<h1>{data[0].title}</h1>
												<h2>Contains {data.length-1} {data.length === 1 ? "column" : "columns"}</h2>
											</Link>
										);
									})
								}

								<a onClick={()=>this.setState({renderNewBoard : true})}><h1>Create New Board</h1></a>
							</div>
						</main>

						<footer>
							<h1>Stuart Wallace Portfolio 2021</h1>
							<h2>Trello Clone 2021</h2>
						</footer>
					</left>

					<right>
						<div className="pflRightPanel">
							<div>
								<label htmlFor="display">Display Name</label>
								<input type="text" id="display" name="display" value={this.state.changedData.display} onChange={(e)=>this.handleChange(e)}/>
							</div>

							<div>
								<label htmlFor="picture">Profile Picture</label>
								<input type="file" id="picture" name="picture" value={this.state.profilePictureName} onChange={(e)=>this.handleFile(e)}/>
							</div>

							<hr/>

							<div>
								<label htmlFor="setting3">Setting 3</label>
								<input type="text" id="setting3" name="setting3" value="" onChange={(e)=>this.handleChange(e)}/>
							</div>

							<hr/>

							<div>
								<label htmlFor="boardBackground">Default Board Colour</label>
								<input type="color" id="boardBackground" name="boardBackground" value={this.state.changedData.boardBackground} onChange={(e)=>this.handleChange(e)}/>
							</div>

							<div>
								<label htmlFor="cardBackground">Default Card Colour</label>
								<input type="color" id="cardBackground" name="cardBackground" value={this.state.changedData.cardBackground} onChange={(e)=>this.handleChange(e)}/>
							</div>

							<hr/>

							<div>
								<label htmlFor="setting6">Setting 6</label>
								<input type="text" id="setting6" name="setting6" value="" onChange={(e)=>this.handleChange(e)}/>
							</div>

							<button onClick={()=>this.saveChanges()}>Save Changes</button>
						</div>
					</right>

					<NewBoardPopup 	open={this.state.renderNewBoard} close={()=>this.setState({renderNewBoard : false})} create={(dat)=>this.createNewBoard(dat)}/>
				</div>
			);

			case 2:	return (
				<div className="pflMain">
					<middle>
						<header>
							<img alt="" src={this.state.profile.profilePicture}/>
							<span>{this.state.profile.display}'s Profile</span>
						</header>
						<main>
							{(this.state.profile.private ? 
								<div>This users profile is private</div>
								:
								<div>
									<div className="pflLeftBoardCount">This user has {this.state.profile.boards} {this.state.profile.boards === 1 ? "board" : "boards" }</div>
								</div>
							)}
						</main>
						<footer>
							<h1>Stuart Wallace Portfolio 2021</h1>
							<h2>Trello Clone 2021</h2>
						</footer>
					</middle>
				</div>			
			);
		}
	}
}