import React from 'react';
import BasePopup from 'Components/Popup/BasePopup';

export default class PopupBoardSettings extends BasePopup{
	constructor(props){
		super(props,true);


		this.state = {
			small : true,
			initial : props.data,
			changed : {title : false, cardBackground : false, boardBackground : false},
		}
	}

	handleChange(e){
		this.setState({
			changed : {
				...this.state.changed,
				[e.target.name] : e.target.value,
			}
		});
	}

	renderPopup(){
		return (
			<div name="BoardSettings">
				<div>
					<label htmlFor="title">Board Title</label>
					<input type="text" name="title" value={(!this.state.changed.title ? this.props.data.title : this.state.changed.title)} onChange={(e)=>this.handleChange(e)}/>
				</div>
				
				<div>
					<label htmlFor="boardBackground">Board Colour</label>
					<input type="color" name="boardBackground" value={(!this.state.changed.boardBackground ? this.props.data.boardBackground : this.state.changed.boardBackground)} onChange={(e)=>this.handleChange(e)}/>
				</div>
				
				<div>
					<label htmlFor="cardBackground">Card Colour</label>
					<input type="color" name="cardBackground" value={(!this.state.changed.cardBackground ? this.props.data.cardBackground : this.state.changed.cardBackground)} onChange={(e)=>this.handleChange(e)}/>
				</div>
				
				<div><button onClick={()=>{this.props.update(this.state.changed); this.props.close()}}>Save Settings</button></div>
				<div><button onClick={()=>this.props.delete()}name="delete">Delete Board</button></div>
			</div>

		);
	}
}