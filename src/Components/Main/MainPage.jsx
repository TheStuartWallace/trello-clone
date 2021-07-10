import React from 'react';
import 'Style/MainPage.css';
import {Redirect} from 'react-router-dom';
import {AuthContext} from 'Components/Auth/AuthProvider';

export default class MainPage extends React.Component{
	static contextType = AuthContext;
	constructor(props){
		super(props);
		this.state = {};
		document.title = "Trello Clone"
	}

	render(){
		if(this.state.redirect) return <Redirect to={this.state.redirect}/>

		if(this.context.currentUser){
			return (
				<div className="mnpWrapper">
				<header>
					Trello Clone

					<div className="mnpSignIn">
						<button onClick={()=>this.setState({redirect : "/u/"+this.context.currentUser.uid})}>My Profile</button>
						<button onClick={()=>this.setState({redirect : "/logout"})}>Sign out</button>
					</div>
				</header>

				<main>
					<h1>
						Hey, Welcome back
					</h1>
					

					<span>
						You're signed in, so you can view your boards and get to work on your current project
					</span>

					<span>
						
					</span>
				</main>

				<footer>
					<span>This is a trello clone, purely made to show off my ReactJS and Javascript knowledge</span>
					<span>Feedback and Suggestions would be appreciated</span>
				</footer>
			</div>
			); 
		}

		return (
			<div className="mnpWrapper">
				<header>
					Trello Clone

					<div className="mnpSignIn">
						<button onClick={()=>this.setState({redirect : "/signin"})}>Sign in</button>
						<button onClick={()=>this.setState({redirect : "/signup"})}>Sign Up</button>
					</div>
				</header>

				<main>
					<h1>
						Sign up today
					</h1>
					
					<span>
						<input type="text" placeholder="Enter your email"/>
						<button>Create new account</button>
					</span>

					<span>
						Trello-Clone is a web based list making app, allowing you or a team to organise your thoughs, tasks and plan ahead, so sign up today and get started
					</span>
				</main>

				<footer>
					<span>This is a trello clone, purely made to show off my ReactJS and Javascript knowledge</span>
					<span>Feedback and Suggestions would be appreciated</span>
				</footer>
			</div>
		);
	}
}