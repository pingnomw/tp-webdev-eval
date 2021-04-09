import React from 'react';
import {NavLink, useLocation} from 'react-router-dom';


function Navbar(){

	var inDetail = useLocation().pathname.startsWith("/detail")

	return (
		<div className="navbar">
			{inDetail
			?
			<button className="navitem" onClick={() => window.history.back()}>Back</button>
			:
			<div>
				<div className="desktop-only">
					<NavLink to="/list" className="navitem" activeClassName="nav-active">All Pokémon List</NavLink>
					<NavLink to="/my" className="navitem" activeClassName="nav-active">My Owned Pokémon</NavLink>
				</div>
				<div className="mobile-only">
					<NavLink to="/list" className="navitem" activeClassName="nav-active">All</NavLink>
					<NavLink to="/my" className="navitem" activeClassName="nav-active">Owned</NavLink>
				</div>
			</div>
			}
		</div>
	)
}

export default Navbar;
