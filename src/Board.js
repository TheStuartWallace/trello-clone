import React from 'react';
import './Board.css';
import Card from './Card';
import FirebaseAction from './FirebaseAction';

class Board extends React.Component{
	constructor(props){
		super(props);

		this.state = {
			title : "Untitled Board",
			cards : [],
		};

		window.document.title = this.state.title;
		this.getCard();
	}

	getCard(){
		let boardData = FirebaseAction.getBoard("9YXttQuaUWRCdJNbgwiuJXA7Mj63","guW7VBpwshrebtug5AE6");
		boardData.then(data=>{

			data.cards.forEach((cData)=>{
				let array = this.state.cards;
				console.log(JSON.parse(JSON.parse(cData)));
				array.push(JSON.parse(JSON.parse(cData)));
				this.setState({cards : array});
			});
		});
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
							return <Card key={i} data={data} />
						})
					}
				</div>
			</div>
		);
	}
}

export default Board;