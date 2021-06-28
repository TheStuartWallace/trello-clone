import React from 'react';
import 'Style/Board.css';
import Column from 'Components/Main/Column';
import FirebaseAction from 'Database/FirebaseAction';
import {AuthContext} from 'Components/Auth/AuthProvider';

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

	updateFirebase(i,data){
		let columns = JSON.parse(JSON.stringify(this.state.columns));
		columns = Object.assign([],columns,{[i]:[this.state.columns[i][0],...data]});
		FirebaseAction.updateColumns(this.context.currentUser.uid,this.state.id,columns);
	}

	render(){
		return (
			<div className="brdMain">
				<div className="brdTaskbar">
					<div className="brdTaskbarItem">
						<span id="brdBackText">&lt;&lt; Back</span>
					</div>

					<div className="brdTaskbarItem">
						<span id="brdTitle">{this.state.title}</span>
					</div>

					<div className="brdTaskbarItem" onClick={()=>this.setState({addColumn : true})}>
						Add Column
					</div>
				</div>

				<div className="brdCardHolder" style={{"background":this.state.boardBackground}}>
					{
						this.state.columns.map((data,i)=>{
							return <Column index={i} key={i} data={data} background={this.state.cardBackground} callback={(a,e)=>this.updateFirebase(a,e)}/>
						})
					}
				</div>

				{this.renderError()}
				{this.renderAddColumn()}
			</div>
		);
	}
}

export default Board;