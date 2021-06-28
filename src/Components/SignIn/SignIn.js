import React from 'react';
import 'Style/SignIn.css';
import FirebaseAction from 'Database/FirebaseAction';
import {AuthContext} from 'Components/Auth/AuthProvider';
import {Redirect} from 'react-router-dom';

export default class SignIn extends React.Component{
	static contextType = AuthContext;

	constructor(props){
		super(props);

		this.state = {
			username : "",
			password : "",
		};

		window.document.title = "Login | Trello-Clone";
	}

	handleChange(event){
		this.setState({[event.target.name] : event.target.value});
	}

	async handleSignIn(){
		let signin = await FirebaseAction.userSignIn(this.state.username,this.state.password);
		// console.log(signin);
		// console.log(this.context.currentUser)
		if(signin){
			this.setState({redirect : "/u/"+this.context.currentUser?.uid});
		}else{
			this.setState({error : "Error Signing in"});
		}
	}

	render(){
		if(this.state.redirect){
			return <Redirect to={this.state.redirect} />
		}
		return (
			<div className="sinWrapper">
				<div className="sinInput">
					<div className="sinTitle">
						<span className="sinTitleBig">Trello Clone</span>
						<span className="sinTitleSmall">Sign In</span>
					</div>
					<div className="sinInputElements">
						<input type="text" value={this.state.username} name="username" className="sinInputUsername" onChange={(e)=>this.handleChange(e)}/>
						<input type="password" value={this.state.password} name="password" className="sinInputPassword" onChange={(e)=>this.handleChange(e)}/>
						<input type="submit" value="Sign In" className="sinInputSubmit" onClick={()=>this.handleSignIn()}/>
					</div>
				</div>
			</div>
		);
	}
}