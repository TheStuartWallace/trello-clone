import React from 'react';
import FirebaseAction from 'Database/FirebaseAction';
import Card from 'Components/Main/Card';
import 'Style/Column.css';

class Column extends React.Component{
	constructor(props){
		super(props);

		this.state = {
			columnTitle : this.props.data[0].title,
			cardBackground : this.props.background,
			cards : this.props.data.slice(1),
			newCardName : "",
			renderAddCard : false,
		};
	}

	renderAddCard(){
		if(!this.state.renderAddCard) return <div></div>;

		return (
			<div id="pupBacking">
				<div id="pupWindowSmall">
					<span>Card Name</span>
					<input type="text" value={this.state.newCardName} onChange={(e)=>{this.setState({newCardName : e.target.value})}} required/>
					<button onClick={()=>{
						let newState = JSON.parse(JSON.stringify(this.state.cards));
						newState.push({title : this.state.newCardName, attachment : [], });
						this.props.callback(this.props.index,newState);
						this.setState({cards : newState, newCardName : "", renderAddCard : false})
					}}>Add Card</button>
				</div>
			</div>
		);
	}

	updateFirebase(i,data){
		let newData = Object.assign([],this.state.cards,{[i] : data});
		this.props.callback(this.props.index,newData);
		this.setState({cards : newData});
	}

	render(){
		return (
			<div className="clmWrapper">
				<div className="clmTitle">{this.state.columnTitle}</div>
				{
					this.state.cards.map((data,i)=>{
						return <Card key={i} index={i} data={data} background={this.state.cardBackground} callback={(a,e)=>{this.updateFirebase(a,e);}}/>
					})
				}

				<div onClick={()=>{this.setState({renderAddCard : true})}}>
					+ New Card
				</div>

				{this.renderAddCard()}
			</div>
		);
	}
}

export default Column;