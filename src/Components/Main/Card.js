import React from 'react';
import 'Style/Card.css';
import 'Style/PopUp.css';
import AddAttachmentPopup from 'Components/Popup/AddAttachmentPopup';

class Card extends React.Component{
	constructor(props){
		super(props);

		this.state = {
			title : this.props.data.title,
			show : false,
			showAttachment : false,
			showAttachmentType : "",
			attachment : this.props.data.attachment,	
		};
	}

	renderAttachment(i,data){
		switch(data.type){
			case "text": return <div className="pupAttachmentContent">{data.data}</div>
			case "image": return <div className="pupAttachmentContent"><img alt="attachment" src={data.data}/></div>
			case "link": return <div className="pupAttachmentContent"><a rel="noreferrer" target="_blank" href={data.data}>{data.text}</a></div>
			case "date": return <div className="pupAttachmentContent">{(new Date(data.data).toLocaleDateString())}</div>
			case "time": return <div className="pupAttachmentContent">{(new Date(data.data).toLocaleTimeString())}</div>
			case "checklist": return (
				<div className="pupAttachmentContent">
					{
						data.data.map((item,index)=>{
							return (
								<div>
									<input type="checkbox" key={index} name={"check."+i+"."+index} id={"check_"+index} checked={this.state.attachment[i].data[index].checked} onChange={(e)=>this.updateCheckList(e)}/>
									<label htmlFor={"check_"+index}>{item.data}</label>
								</div>
							);
						})
					}
				</div>
			);

			case "file": return (
				<div className="pupAttachmentContent">
					<a href={data.data} rel="noreferrer" target="_blank">{data.name}</a>
				</div>
			);

			default: return <div></div>
		}
	}

	updateCheckList(event){
		let attachmentID = +event.target.name.split(".")[1];
		let itemIndex = +event.target.name.split(".")[2];

		let existing = this.state.attachment;
		existing[attachmentID].data[itemIndex].checked = event.target.checked;
		this.setState({attachment : existing});
	}

	renderCardPopup(){
		if(!this.state.show) return (<div></div>)

		return (
		<div id="pupBacking">
			<div id="pupWindow">
				<div id="pupTop">
					<span id="pupTitle">{this.state.title}</span>
					<span id="pupClose" onClick={(e)=>{this.setState({show:false})}}>x</span>
				</div>

				<div id="pupMid">
					{
						this.state.attachment.map((data,i)=>{
							return (
								<div key={i} className="pupAttachment">
									<span className="pupAttachmentNumber">#{i+1}</span>
									<span className="pupAttachmentDelete" onClick={(e)=>this.removeAttachment(i)}>x</span>
									<span className="pupAttachmentType">{data.type.charAt(0).toUpperCase() + data.type.slice(1)}</span>
									{this.renderAttachment(i,data)}
								</div>
							)
						})
					}
				</div>

				<div id="pupBtm">
					<span className="pupAttachmentLabel">Add new attachment</span>
					<div className="pupAddAttachmentButtons">
						<button className="pupAddAttachment" onClick={()=>this.setState({showAttachmentType : "text", showAttachment : true})}>Text</button>
						<button className="pupAddAttachment" onClick={()=>this.setState({showAttachmentType : "image", showAttachment : true})}>Image</button>
						<button className="pupAddAttachment" onClick={()=>this.setState({showAttachmentType : "link", showAttachment : true})}>Link</button>
						<button className="pupAddAttachment" onClick={()=>this.setState({showAttachmentType : "checklist", showAttachment : true})}>Checklist</button>
						<button className="pupAddAttachment" onClick={()=>this.setState({showAttachmentType : "file", showAttachment : true})}>File</button>
						<button className="pupAddAttachment" onClick={()=>this.setState({showAttachmentType : "date", showAttachment : true})}>Date</button>
					</div>
				</div>
			</div>
		</div>
		);
	}

	addAttachment(data){
		let attachment = this.state.attachment;
		attachment.push(data);
		this.setState({attachment : attachment, showAttachment : false},()=>{
			this.props.callback(this.props.index,{title : this.state.title, attachment: attachment});	
		});
	}

	removeAttachment(index){
		if(window.confirm("Remove attachment? (This cannot be undone)")){
			let state = this.state.attachment;
			state.splice(index,1);
			this.setState({attachment : state},()=>{
				this.props.callback(this.props.index,{title : this.state.title, attachment: this.state.attachment});
			});
		}
	}

	render(){
		return (
			<div className="cardMain" style={{"background":this.props.background}}>
				<span className="cardTitle">{this.state.title}</span>
				{	
					(this.state.attachment.length === 1 ? 
						<span className="cardAttachment" onClick={(e)=>{this.setState({show : true})}}>Show {this.state.attachment?.length} attachment</span> : 
						<span className="cardAttachment" onClick={(e)=>{this.setState({show : true})}}>Show {this.state.attachment?.length} attachments</span>)
				}

				{this.renderCardPopup()}
				<AddAttachmentPopup type={this.state.showAttachmentType} show={this.state.showAttachment} callback={(e)=>{this.addAttachment(e)}}/>
			</div>
		);
	}
}

export default Card;