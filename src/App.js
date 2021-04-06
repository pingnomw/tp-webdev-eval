import React from 'react';
import './App.css';
import {Switch, Route, useParams, Link} from 'react-router-dom'

import Navbar from "./components/navbar"
import PokeList from "./components/pokelist"
import PokeDetail from "./components/pokedetail"
import MyPokes from "./components/mypokes"

class App extends React.Component {
	/*constructor(props){ 
		super(props);
		this.state = {pos: 'l'}; // l = list, d = detail, m = my
	}*/

	render(){
		return (
			<div className="App">
				<Navbar />
				<Switch>
					<Route path="/list">
						<PokeList/>
					</Route>
					<Route path="/detail/:id">
						<PokeDetail/>
					</Route>
					<Route path="/my">
						<MyPokes/>
					</Route>
					<Route exact path="/">
						<Link to="/list" className="list-item block hidden-link">All Pokémon List</Link>
						<Link to="/my" className="list-item block hidden-link">My Owned Pokémon</Link>
					</Route>
				</Switch>
			</div>
		);
	}
}

export default App;
