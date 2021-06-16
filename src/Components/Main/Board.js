import React from 'react';
import 'Style/Board.css';
import Card from 'Components/Main/Card';
import FirebaseAction from 'Firebase/FirebaseAction';

class Board extends React.Component{
	constructor(props){
		super(props);

		this.state = {
			title : "Loading",
			cards : [],
			error : false,
		};
		this.getCard();
	}

	getCard(){
		let boardData = FirebaseAction.getBoard(FirebaseAction.getUID(),this.props.match.params.id);
		boardData.then(data=>{
			
			let info = JSON.parse(data.info);
			this.setState({title : info.title},()=>window.document.title = (this.state.title + " - Trello Clone"));

			data.cards.forEach((cData)=>{
				let oldCards = this.state.cards;
				oldCards.push(JSON.parse(JSON.parse(cData)));
				this.setState({cards : oldCards});
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
							return <Card key={i} data={data}/>
						})
					}
				</div>

				{this.renderError()}
			</div>
		);
	}
}

export default Board;