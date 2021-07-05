import React from 'react';
import FirebaseAction from 'Database/FirebaseAction';
import Card from 'Components/Board/Card';
import 'Style/Column.css';
import ContentEditable from 'react-contenteditable';

class Column extends React.Component{
	constructor(props){
		super(props);

		this.refTitle = React.createRef();

		this.state = {
			newCardName : "",
			renderAddCard : false,
		};
	}

	static getDerivedStateFromProps(props, state){
		return {...state,
			columnTitle : props.data[0].title,
			cardBackground : props.background,
			cards : props.data.slice(1),
		};
	}

	renderAddCard(){
		if(!this.state.renderAddCard) return <div></div>;

		return (
			<div id="pupBacking" draggable="true">
				<div id="pupWindowSmall">
					<div className="clmRemove" onClick={()=>{this.setState({renderAddCard : false})}}>x</div>
					<span>Card Name</span>
					<input type="text" value={this.state.newCardName} onChange={(e)=>{this.setState({newCardName : e.target.value})}} required/>
					<button onClick={()=>{
						let newState = JSON.parse(JSON.stringify(this.state.cards));
						newState.push({title : this.state.newCardName, attachment : [], });
						console.log(newState);
						this.props.callback("cards",this.props.index,newState);
						this.setState({cards : newState, newCardName : "", renderAddCard : false})
					}}>Add Card</button>
				</div>
			</div>
		);
	}

	array_move(carr, old_index, new_index) {
		console.log(old_index+" "+new_index);
		let arr = JSON.parse(JSON.stringify(carr));

		if (new_index >= arr.length) {
			let k = new_index - arr.length + 1;
			
			while (k--) {
				arr.push(undefined);
			}
		}
		arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
		console.log(arr);
		return arr;
	}

	updateFirebase(type,index,data){
		let cards = JSON.parse(JSON.stringify(this.state.cards));

		switch(type){
			case "card":
				let newData = Object.assign([],this.state.cards,{[index] : data});
				this.props.callback("cards",this.props.index,newData);
				this.setState({cards : newData});
			break;

			case "attachment":

			break;

			case "remove":
				cards = cards.filter((element,a)=>{return a !== index});
				this.props.callback("cards",this.props.index,cards);
			break;

			case "move":
				switch(data){
					case "up":
						this.props.callback("cards",this.props.index,this.array_move(this.state.cards, index, index-1));	
					break;

					case "down":
						this.props.callback("cards",this.props.index,this.array_move(this.state.cards, index, index+1));
					break;

					case "left": case "right":
						this.props.callback(type,index+"."+this.props.index,data);
					break;
				}
		}
	}

	render(){
		return (
			<div className="clmWrapper">
				<div className="clmRemove" onClick={()=>{if(window.confirm("Remove Column? This cannot be undone.")) this.props.callback("remove",this.props.index)}}>x</div>
				<ContentEditable 	innerRef={this.refTitle} 
									html={this.state.columnTitle} 
									name="columnTitle"
									onChange={(e)=>this.props.callback("title",this.props.index,e.target.value)} 
									className="clmTitle"/>
				{
					this.state.cards.map((data,i)=>{
						return <Card key={i} index={i} data={data} background={this.state.cardBackground} callback={(t,i,f)=>{this.updateFirebase(t,i,f);}}/>
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