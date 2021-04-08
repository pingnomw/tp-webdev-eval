import React, { useState, useEffect } from 'react';
import './App.css';
import {Switch, Route, useParams, Link} from 'react-router-dom'
import Axios from 'axios';

import Navbar from "./components/navbar"
import PokeList from "./components/pokelist"
import PokeDetail from "./components/pokedetail"
import MyPokes from "./components/mypokes"


function App() {
	const [caught, setCaught] = useState([[]])
	/*
	store caught Pokemon in the following format:
	caught[<pokeID>] = [name1, name2, ...]
	*/

	const [pokeCount, setPokeCount] = useState(0) // the total count of Pokemon from the API
	const [pokeNames, setPokeNames] = useState([]) // the names of the Pokemon

	const [status, setStatus] = useState(0) // the status of the HTTP request
	const [error, setError] = useState("") // error message from Axios or the API

	// initialize a "2D" array of <count> rows and 0 columns (will use Array.push() to add elements)
	function initCaughtArray(count){
		setPokeCount(count)
		setCaught([...Array(count)].map(e => []))
	}
	
	/*
	get a list of 1 Pokemon
	the API will return a count of all Pokemon available in the API and info about a single Pokemon
	we don't care about what Pokemon is on the list, we only care about how many are there in the API
	then
	get a list of all Pokemon names (1000+ entries)
	the API will only give 20 entries if no count/limit si specified
	*/
	useEffect(()=>{
		Axios.get("https://pokeapi.co/api/v2/pokemon?limit=1").then((res) => {
			setStatus(200)
			//console.log(res)
			initCaughtArray(res.data.count)
			Axios.get("https://pokeapi.co/api/v2/pokemon?limit=" + res.data.count).then((res2) => {
				setStatus(200)
				//console.log(res)
				var newArray = res2.data.results.map((val) => {
					return (val.name)
				})
				setPokeNames(newArray)
			}).catch((err) => {
				console.log("Error: " + err);
				setStatus(err.status)
				setError(err.data)
			});
		}).catch((err) => {
			console.log("Error: " + err);
			setStatus(err.status)
			setError(err.data)
		});
	}, []) // only run this once

	// returns true if the name is valid, false if the name is invalid
	function validatePokeName(id, name){
		if (name.length == 0){ // if name is empty
			return "The Pokemon's nickname cannot be blank."
		} else if (caught[id].includes(name)){ // if another Pokemon of the same type already uses the same name
			return "You already have a Pokemon of this type with the nickname " + name + ". Please choose a different nickname."
		} else {
			return ""
		}
	};

	// adds a Pokemon to the caught list, does not validate the name
	function addPoke(id, name) {
		var list = caught
		list[id].push(name)
		//list[0] = []
		setCaught(list)
	};

	// remove a Pokemon from the caught list
	function removePoke(id, name){
		console.log("Pokemon " + id + " with the nickname " + name + " has been released")
		var list = caught
		//list[id].splice(list[id].indexOf(name), 1)
		list[id] = caught[id].filter((toBeDeleted) => {
			return (name != toBeDeleted)
		})
		setCaught(list)
	};

	return (
		<div className="App">
			<Navbar />
			<Switch>
				<Route path="/list">
					<PokeList pokeList={pokeNames} caughtList={caught}/>
				</Route>
				<Route path="/detail/:id">
					<PokeDetail caughtList={caught} onPokeCatch={addPoke} onPokeRelease={removePoke}/>
				</Route>
				<Route path="/my">
					<MyPokes count={pokeCount} pokeList={pokeNames} caughtList={caught} onPokeRelease={removePoke}/>
				</Route>
				<Route exact path="/">
					<Link to="/list" className="list-item list-link block hidden-link">All Pokémon List</Link>
					<Link to="/my" className="list-item list-link block hidden-link">My Owned Pokémon</Link>
				</Route>
			</Switch>
		</div>
	);
}

export default App;
