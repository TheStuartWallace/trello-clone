import React from 'react';
import {Redirect} from 'react-router-dom';

export default class NotFound extends React.Component{

	constructor(props){
		super(props);
		this.state = {};
	}

	render(){
		if(this.state.redirect) return <Redirect to={this.state.redirect}/>
		return (
			<div className="mnpWrapper" onClick={()=>{this.setState({redirect : "/"})}}>
				<main>
					<h1>Sorry, page not found.</h1>
					<span>
						Click to return home
					</span>
				</main>
			</div>
		);
	}
}