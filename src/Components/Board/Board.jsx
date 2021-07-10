import React from 'react';
import 'Style/Board.css';
import Column from 'Components/Board/Column';
import FirebaseAction from 'Database/FirebaseAction';
import {AuthContext} from 'Components/Auth/AuthProvider';
import {Redirect} from 'react-router-dom';
import ContentEditable from 'react-contenteditable'
import PopupBoardSettings from 'Components/Popup/PopupBoardSettings';

class Board extends React.Component{
	static contextType = AuthContext;

	constructor(props){
		super(props);

		this.state = {
			id : this.props.match.params.id,
			title : "Loading",
			columns : [],
			newColumnName :  "",
			status : 0,
			error : false,

			showSettings : false,
		};
	}

	componentDidUpdate(){
		if(this.context && this.state.status === 0){
			this.setState({status : 1});
			this.getCard();
		}
	}

	getCard(){
		let boardData = FirebaseAction.getBoard(this.context.currentUser.uid,this.props.match.params.id);
		boardData.then(data=>{

			let info = JSON.parse(data.info);
			if(data.allowedUsers.filter((element)=>{return element===this.context.currentUser.uid}) <= 0){
				this.setState({error : {name:"Unauthorised",message:"You are not on the allowed users list for this board"}});
				return;
			}

			this.setState({title : info.title, boardBackground : info.boardBackground, cardBackground : info.cardBackground},()=>window.document.title = (this.state.title + " | Trello Clone"));
			let a = [];
			Object.values(data.columns).map((columns,ind)=>{
				a[ind] = [];
				columns.map((cards,cind) =>{
					a[ind][cind] = JSON.parse(cards);
				});
			});

			this.setState({columns : a});
		}).catch(error=>{
			console.error(boardData);
			this.setState({title: "Error loading board", error: error});
		});
	}

	renderError(){
		if(!this.state.error) return <div></div>;

		return (
			<div id="pupBackingError">
				<div id="pupWindowSmall">
					<span className="errorTitle">Sorry about this, but there's been an error.</span>
					<span className="errorMessage">{this.state.error.name+": "+this.state.error.message}</span>
				</div>
			</div>
		);
	}

	renderAddColumn(){
		if(!this.state.addColumn)	return <div></div>;

		return (
			<div id="pupBacking">
				<div id="pupWindowSmall">
					<div className="clmRemove" onClick={()=>{this.setState({addColumn : false})}}>x</div>
					<span>Column Name</span>
					<input type="text" value={this.state.newColumnName} onChange={(e)=>{this.setState({newColumnName : e.target.value})}} />
					<button onClick={()=>{
						let a = JSON.parse(JSON.stringify(this.state.columns)); 
						a.push([{title : this.state.newColumnName}]); 
						this.setState({columns : a, newColumnName : "", addColumn : false});
						FirebaseAction.updateColumns(this.context.currentUser.uid,this.state.id,a);
					}}>Add Column</button>
				</div>
			</div>
		);
	}

	columnCallback(type,index,data){
		let columns = JSON.parse(JSON.stringify(this.state.columns));
		
		switch(type){
			case "remove":
				columns = columns.filter((element,a)=>{return a !== index});
				this.setState({columns : columns});
				FirebaseAction.updateColumns(this.context.currentUser.uid,this.state.id,columns);
			break;

			case "cards":
				columns = Object.assign([],columns,{[index]:[this.state.columns[index][0],...data]});
				this.setState({columns : columns});
				FirebaseAction.updateColumns(this.context.currentUser.uid,this.state.id,columns);
			break;

			case "boardTitle":
				let dat = data;
				dat = dat.replaceAll("<div>","");
				dat = dat.replaceAll("</div>","");
				dat = dat.replaceAll("<br>","\n");
				this.setState({title : dat},()=>{
					FirebaseAction.updateBoardInfo(this.context.currentUser.uid,this.state.id,{title : this.state.title,cardBackground : this.state.cardBackground, boardBackground : this.state.boardBackground});
				});
			break;

			case "move":
				let columnID = parseInt(index.split(".")[1]);
				let cardID = parseInt(index.split(".")[0]);
				
				let moveColumn = (data === "left" ? columnID-1 : columnID + 1);
				if(moveColumn < 0) moveColumn = columns.length-1;
				if(moveColumn >= columns.length) moveColumn = 0;

				columns[moveColumn].push(columns[columnID].splice((cardID+1),1)[0]);
				this.setState({columns : columns});
				FirebaseAction.updateColumns(this.context.currentUser.uid,this.state.id,columns);
				
			break;

			default: break;
		}
	}

	deleteBoard(){
		if(window.confirm("Deleting your board cannot be undone! Are you sure?")){
			FirebaseAction.deleteBoard(this.context.currentUser.uid,this.state.id).then(data=>{
				this.setState({redirect : "/u/"+this.context.currentUser.uid});
			});
		}
	}

	updateBoard(e){
		FirebaseAction.updateBoardInfo(this.context.currentUser.uid,this.state.id,
			{	
				title : (e.title ? e.title : this.state.title), 
				boardBackground : (e.boardBackground ? e.boardBackground : this.state.boardBackground), 
				cardBackground : (e.cardBackground ? e.cardBackground : this.state.cardBackground)
			}
		).then(data=>{
			this.setState({title : (e.title ? e.title : this.state.title), boardBackground : (e.boardBackground ? e.boardBackground : this.state.boardBackground), cardBackground : (e.cardBackground ? e.cardBackground : this.state.cardBackground)});
		}).catch(error=>{
			console.error(error);
		})
	}


	render(){
		if(this.state.redirect){
			return <Redirect to={this.state.redirect} />;
		}

		return (
			<div className="brdMain">
				<nav>
					<div pos="left" onClick={(e)=>this.setState({redirect : "/u/"+this.context.currentUser.uid})}>&lt;&lt; Profile</div>

					<div pos="middle">
						<ContentEditable 	id="brdTitle" html={this.state.title}
											onChange={(e)=>this.columnCallback("boardTitle",0,e.target.value)}
											tagName="span"/>
					</div>

					<div pos="right">
						<button onClick={()=>this.setState({addColumn : true})}>
							<span>Add Column</span>
							<img src="https://firebasestorage.googleapis.com/v0/b/trello-clone-f948b.appspot.com/o/Internal%2FTrelloAddIcon.png?alt=media&token=c9f7997d-73be-47da-9304-dc661221b1da"/>
						</button>
						<button onClick={()=>this.setState({showSettings : !this.state.showSettings})}>
							<span>Board Settings Board</span>
							<img src="https://firebasestorage.googleapis.com/v0/b/trello-clone-f948b.appspot.com/o/Internal%2FTrelloGearIcon.png?alt=media&token=00d483d0-927c-4b59-ae98-c40fe0b3bb77" />
						</button>
					</div>
				</nav>

				<div className="brdCardHolder" style={{"background":this.state.boardBackground}}>
					{
						this.state.columns.map((data,i)=>{
							return <Column  index={i} 
											key={i} 
											data={data} 
											background={this.state.cardBackground} 
											callback={(i,a,e)=>this.columnCallback(i,a,e)}/>
						})
					}
				</div>

				{this.renderError()}
				{this.renderAddColumn()}

				<PopupBoardSettings show={this.state.showSettings} 
									close={()=>this.setState({showSettings : false})} 
									update={(e)=>this.updateBoard(e)} 
									delete={()=>this.deleteBoard()}
									data={this.state}/>
			</div>
		);
	}
}

export default Board;