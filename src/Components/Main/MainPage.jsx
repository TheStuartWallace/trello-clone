import React from 'react';
import 'Style/MainPage.css';
import {Redirect} from 'react-router-dom';

export default class MainPage extends React.Component{
	constructor(props){
		super(props);
		this.state = {};
		document.title = "Trello Clone"
	}

	render(){
		if(this.state.redirect) return <Redirect to={this.state.redirect}/>

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
					<div>
						<span>You can sign up today, create a board and organise your thoughts</span>
					</div>

					<div>
						<input type="text" placeholder="Enter your email"/>
						<button>Create new account</button>
					</div>

					<div>
						Trello-Clone is a web based list making app, allowing you or a team to organise your thoughs, tasks and plan ahead
					</div>
				</main>

				<footer>
					<span>This is a trello clone, purely made to show off my ReactJS and Javascript knowledge</span>
					<span>Feedback and Suggestions would be appreciated</span>
				</footer>
			</div>
		);
	}
}