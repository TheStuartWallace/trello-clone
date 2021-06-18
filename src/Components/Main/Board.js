import React from 'react';
import 'Style/Board.css';
import Card from 'Components/Main/Card';
import FirebaseAction from 'Database/FirebaseAction';
import {AuthContext} from 'Components/Auth/AuthProvider';

class Board extends React.Component{
	static contextType = AuthContext;

	constructor(props){
		super(props);

		this.state = {
			id : this.props.match.params.id,
			title : "Loading",
			cards : [],
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
			this.setState({title : info.title},()=>window.document.title = (this.state.title + " | Trello Clone"));

			data.cards.forEach((cData)=>{
				this.setState({cards : this.state.cards.concat(JSON.parse(cData))});
			});
		}).catch(error=>{
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

	updateFirebase(index,data){
		this.setState({cards : Object.assign([],this.state.cards,{[index] : data})});
		FirebaseAction.updateAttachment(this.context.currentUser.uid,this.state.id,this.state.cards);
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

					<div className="brdTaskbarItem">

					</div>
				</div>

				<div className="brdCardHolder">
					{
						this.state.cards.map((data,i)=>{
							return <Card key={i} index={i} data={data} callback={(e)=>this.updateFirebase(i,e)}/>
						})
					}
				</div>

				{this.renderError()}
			</div>
		);
	}
}

export default Board;