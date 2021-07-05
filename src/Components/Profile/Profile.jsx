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

	componentDidUpdate(){
		if(this.context.currentUser){
			if(!this.state.profile){
				FirebaseAction.getProfile(this.context.currentUser.uid).then((data)=>{
					this.setState({profile : data, changedData : data});
					window.document.title = data.display+"'s Profile | Trello-Clone";
				});
			}


			if(!this.state.boards){
				FirebaseAction.getAllBoard(this.context.currentUser.uid).then(data =>{
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
					})

					this.setState({boards : boardData});
				});
			}

			if(this.state.profile && this.state.boards && this.state.status !== 1){
				this.setState({status : 1});
			}
		}
	}

	handleChange(event){
		this.setState({
			changedData : {...this.state.changedData,[event.target.name] : event.target.value}
		})
	}

	handleFile(event){
		this.setState({profilePicture : event.target.files[0]});
	}

	saveChanges(){
		if(FirebaseAction.saveProfile(this.context.currentUser.uid, this.state.changedData)){
			this.setState({profile : this.state.changedData});
		}else{
			console.error("Unable to comply");
		}
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
					<div className="pflLeft">
						<div className="pflLeftTop">
							<img className="pflPicture" alt="" src={this.state.profile.profilePicture}/>
							<span className="pflDisplayName">{this.state.profile.display}'s Profile</span>
						</div>

						<div className="pflLeftMid">
							<div className="pflLeftBoardCount">You have {this.state.boards.length} {this.state.boards.length === 1 ? "board" : "boards" }</div>

							<div className="pflMidBoardList">
								{
									this.state.boards.map((data,index)=>{
										return (
											<Link key={index} to={"/b/"+data[0].id} className="pflMidBoardListItem" target="_blank">
												<span className="pflMidBoardListItemTitle">{data[0].title}</span>
												<span className="pflMidBoardListItemCount">
													Contains {data.length-1} {data.length === 1 ? "column" : "columns"}
												</span>
											</Link>
										);
									})
								}

								<div className="pflMidBoardListItem" onClick={()=>this.setState({renderNewBoard : true})}>
									<span className="pflMidBoardListItemTitle">Create New Board</span>
								</div>
							</div>
						</div>

						<div className="pflLeftBot">
							<div className="pflLeftPortTop">Stuart Wallace Portfolio 2021</div>
							<div className="pflLeftPortBot">Trello Clone 2021</div>
						</div>
					</div>

					<div className="pflRight">
						<div className="pflRightPanel">
							<div>
								<label htmlFor="display">Display Name</label>
								<input type="text" id="display" name="display" value={this.state.changedData.display} onChange={(e)=>this.handleChange(e)}/>
							</div>

							<div>
								<label htmlFor="picture">Profile Picture</label>
								<input type="file" id="picture" name="picture" value={this.state.profilePicture} onChange={(e)=>this.handleFile(e)}/>
							</div>

							<hr/>

							<div>
								<label htmlFor="setting3">Setting 3</label>
								<input type="text" id="setting3" name="setting3" value={this.state.changedData.boardColour} onChange={(e)=>this.handleChange(e)}/>
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
								<input type="text" id="setting6" name="setting6" value={this.state.profilePicture} onChange={(e)=>this.handleChange(e)}/>
							</div>

							<button onClick={()=>this.saveChanges()}>Save Changes</button>
						</div>
					</div>

					<NewBoardPopup 	open={this.state.renderNewBoard} close={()=>this.setState({renderNewBoard : false})} create={(dat)=>this.createNewBoard(dat)}/>
				</div>
			);

		}
	}
}