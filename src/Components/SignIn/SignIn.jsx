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

	async handleSubmit(){
		let action;

		if(this.props.mode){
			action = await FirebaseAction.userSignIn(this.state.username,this.state.password);
		}else{
			action = await FirebaseAction.userSignUp(this.state.username,this.state.password);
		}

		if(action){
			this.setState({redirect : "/u/"+action});
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
					<header>
						<h1>Trello Clone</h1>
						<h2>{this.props.mode ? "Log into your account" : "Create new account"}</h2>
					</header>
					
					<main>
						<input type="text" value={this.state.username} name="username" placeholder="Please enter your email" onChange={(e)=>this.handleChange(e)}/>
						<input type="password" value={this.state.password} name="password" placeholder="Please enter your password" onChange={(e)=>this.handleChange(e)}/>
					</main>

					<footer>
						<input type="submit" value={this.props.mode ? "Sign In" : "Create Account"} onClick={()=>this.handleSubmit()}/>
					</footer>
				</div>
			</div>
		);
	}
}