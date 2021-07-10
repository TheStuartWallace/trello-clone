import React from 'react';
import 'Style/Trello.css';

import AuthProvider from "Components/Auth/AuthProvider";

import MainPage from "Components/Main/MainPage";
import Board from "Components/Board/Board";
import SignIn from "Components/SignIn/SignIn";
import Profile from "Components/Profile/Profile";
import NotFound from "Components/Main/NotFound";

import {HashRouter as Router, Route, Switch} from 'react-router-dom';

class Trello extends React.Component{

	constructor(props){
		super(props);
		window.document.title = "Dashboard - Trello-Clone";
	}

	render(){
		return (
			<AuthProvider>
				<Router basename={`/${process.env.PUBLIC_URL}`}>
					 <Switch>
						<Route path="/b/:id" exact component={Board} />
						<Route path="/u/:id" exact component={Profile} />
						<Route path="/signin" exact render={(props) =><SignIn {...props} mode={true}/>} />
						<Route path="/signup" exact render={(props) =><SignIn {...props} mode={false}/>} />
						<Route path="/" exact component={MainPage} />
						<Route component={NotFound} />
					</Switch>
				</Router>
			</AuthProvider>
		);	
	}
}

export default Trello;