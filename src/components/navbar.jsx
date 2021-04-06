import React from 'react';
import {Link, NavLink} from 'react-router-dom';

class Navbar extends React.Component{
	render() {
		return (
			<div className="navbar">
				<NavLink to="/list" className="navitem" activeClassName="nav-active">All Pokémon List</NavLink>
				<NavLink to="/detail" className="navitem" activeClassName="nav-active">Pokémon Details</NavLink>
				<NavLink to="/my" className="navitem" activeClassName="nav-active">My Owned Pokémon</NavLink>
			</div>
		)
	}
}

export default Navbar;
