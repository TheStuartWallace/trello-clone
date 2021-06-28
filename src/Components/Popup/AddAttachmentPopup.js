import React from 'react';
import FirebaseAction from 'Database/FirebaseAction';

class AddAttachmentPopup extends React.Component{

	constructor(props){
		super(props);

		this.state = {
			show : props.show,
			type : props.type,
			small : ["text","image","file","date"],
			not_allowed : [	"application/x-msdownload",
							"application/x-ms-installer",
							"application/vnd.ahead.space",
							"application/vnd.adobe.air-application-installer-package+zip",
							"application/vnd.apple.installer+xml",
							"application/vnd.nokia.n-gage.symbian.install",
							"application/vnd.ahead.space",
							"application/vnd.hal+xml",
							"application/vnd.kinar",
							"application/x-ms-application",
							"application/vnd.ms-excel.sheet.macroenabled.12",
							"application/vnd.ms-excel.template.macroenabled.12",
							"application/vnd.ms-powerpoint.slide.macroenabled.12",
							"application/vnd.ms-powerpoint.presentation.macroenabled.12",
							"application/vnd.ms-powerpoint.slideshow.macroenabled.12",
							"application/vnd.ms-powerpoint.template.macroenabled.12",
							"application/x-ms-xbap",
							"application/vnd.recordare.musicxml",
							"application/vnd.recordare.musicxml+xml",
							"application/vnd.olpc-sugar",
						],
			value : [{data : "", checked:false}],
			value_alt : "",
		};
	}

	handleInput(event){		
		if(this.state.type === "image" || this.state.type === "file"){
			if(this.state.not_allowed.includes(event.target.files[0].type)){
				alert("File type is not allowed");
				return;
			}
			this.setState({value : event.target.files[0]});
		}else if(this.state.type === "checklist"){
			let data = this.state.value;
			data[event.target.id].data = event.target.value;
			this.setState({value : data});
		}else{
			if(event.target.name === "input_alt"){
				this.setState({value_alt : event.target.value});
			}else{
				this.setState({value : event.target.value});
			}
		}
	}

	renderPopup(){
		switch(this.state.type){
			case "text": 
				return (
					<div id="pupInnerWindow">
						<input className="pupTextInput" type="text" placeholder="Write your text here" value={this.state.value} onChange={(e)=>this.handleInput(e)}/>
					</div>
				);

			case "image": 
				return (
					<div id="pupInnerWindow">
						<input className="pupTextInput" type="file" accept="image/png" name="input" onChange={(e)=>this.handleInput(e)}/>
					</div>
				);

			case "link": 
				return (
					<div id="pupInnerWindow">
						<input className="pupTextInput" type="text" placeholder="Link Display Text" name="input" onChange={(e)=>this.handleInput(e)}/>
						<input className="pupTextInput" type="text"  placeholder="Link URL" name="input_alt" onChange={(e)=>this.handleInput(e)}/>
					</div>
				);

			case "checklist":
				if(typeof(this.state.value) !== "object"){
					this.setState({value : [{data:""}]});
					return;
				}

				return (
					<div id="pupInnerWindow">
						<input type="submit" value="+" onClick={()=>this.addNewChecklistItem()}/>
						{
							this.state.value.map((data,index)=>{
								return <input 	type="text" 
												placeholder="List item" 
												value={this.state.value[index].data} 
												name="checklist_input" 
												id={index} 
												key={index} 
												onChange={(e)=>this.handleInput(e)} />
							})
						}
					</div>
				);

			case "file": 
				return (
					<div id="pupInnerWindow">
						<input className="pupTextInput" type="file" name="input" onChange={(e)=>this.handleInput(e)}/>
					</div>
				);

			case "date": 
				return (
					<div id="pupInnerWindow">
						<input className="pupTextInput" type="date" value={this.state.value} onChange={(e)=>this.handleInput(e)}/>
					</div>
				);

			default: return(<div>Unknown type</div>);
		}
	}

	addNewChecklistItem(){
		let value = this.state.value.concat({data:"", checked:false});
		this.setState({value : value});
	}

	componentWillReceiveProps(next){
		this.setState({show : next.show, type : next.type});
	}

	submit(e){
		switch(this.state.type){
			case "image": case "file":
				let name = this.state.value.name;
				let dat = FirebaseAction.setAttachment(this.state.value);
				dat.then(snapshot => snapshot.ref.getDownloadURL())
				.then((url) => {
					this.props.callback({type:this.state.type,data:url,name: name,});
				}).catch(console.error);
				break;

			case "link":
				this.props.callback({type : this.state.type, data:this.state.value_alt,text:this.state.value});
				break;

			default:
				this.props.callback({type : this.state.type,data : this.state.value,});
				break;
		}

		this.setState({show:false, value : ""});
	}

	render(){
		if(!this.state.show) return (<div></div>);

		return (
			<div id="pupBacking">
				<div id={this.state.small.includes(this.state.type) ? "pupWindowSmall" : "pupWindow"}>
					<span id="pupClose" onClick={(e)=>{this.setState({show:false})}}>x</span>
					<span className="pupTitle">Add a new {this.state.type} attachment</span>
						{this.renderPopup()}
					<input className="pupSubmit" type="submit" value="Add" onClick={(e)=>this.submit(e)}/>
				</div>
			</div>
		);
	}
}

export default AddAttachmentPopup;