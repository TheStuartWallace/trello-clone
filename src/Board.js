import React from 'react';
import './Board.css';
import Card from './Card';

class Board extends React.Component{
	constructor(props){
		super(props);

		this.state = {
			title : "Untitled Board",
			cards : [{title : "Test Card One"},{title : "Test Card Two"}],
		};

		window.document.title = this.state.title;
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
						this.state.cards.map((data,index)=>{
							return <Card data={data} />
						})
					}
				</div>
			</div>
		);
	}
}

export default Board;