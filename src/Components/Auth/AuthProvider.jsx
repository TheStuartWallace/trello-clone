import React from "react";
import firebase from 'Database/Firebase';

export const AuthContext = React.createContext(null);

class AuthProvider extends React.Component{
	constructor(props){
		super(props);

		this.state = {
			currentUser : null,
		};
	}

	componentDidMount(){
		firebase.auth().onAuthStateChanged(user =>{
			if(user === null){
				this.setState({userSignedIn : false});	
				return;
			}else{
				this.setState({userSignedIn : true, currentUser : user});
			}
		});
	}

	render(){
		return (
			<AuthContext.Provider value={this.state}>
				{this.props.children}
			</AuthContext.Provider>
		);
	}
}

export default AuthProvider;