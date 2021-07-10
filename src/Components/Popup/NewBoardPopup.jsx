import React from 'react';

export default class NewBoardPopup extends React.Component{
	constructor(props){
		super(props);

		this.state = {
			boardTitle : "Untitled Board", 
			boardBackground : "#FFFFFF",
			boardCardBackground : "#FFFFFF",
		}
	}

	render(){
		if(!this.props.open) return (<div></div>);

		return (
			<div id="pupBacking">
				<div id="pupWindowSmall" popuptype="NewBoardPopup">
					<div className="clmRemove" onClick={()=>{this.props.close();}}>x</div>
						<span>New Board Settings</span>
						<div>
							<label htmlFor="boardTitle">Board Title</label>
							<input type="text" id="boardTitle" onChange={(e)=>this.setState({boardTitle : e.target.value})} value={this.state.boardTitle}/>
						</div>

						<div>
							<label htmlFor="boardBackground">Board Background Colour</label>
							<input type="color" id="boardBackground" onChange={(e)=>this.setState({boardBackground : e.target.value})} value={this.state.boardBackground}/>
						</div>

						<div>
							<label htmlFor="boardCardBackground">Board Card Colour</label>
							<input type="color" id="boardCardBackground" onChange={(e)=>this.setState({boardCardBackground : e.target.value})} value={this.state.boardCardBackground}/>
						</div>

						<button onClick={()=>{
							this.props.create({title : this.state.boardTitle,boardBackground : this.state.boardBackground,cardBackground : this.state.boardCardBackground,});
							this.props.close();
						}}>Create new board</button>
				</div>
			</div>
		);
	}
}