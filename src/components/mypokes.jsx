import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import {Link} from 'react-router-dom';

function MyPokes (props){
	const [update, setUpdate] = useState(false) // used to trigger DOM update
	//const [pokeNames, setPokeNames] = useState([]) // list of Pokemon by ID

	/*useEffect(() => {
		console.log("count = " + props.count)
		Axios.get("https://pokeapi.co/api/v2/pokemon?limit=" + props.count).then((res) => {
			console.log(res)
			setPokeNames(res.data.results)
		}).catch((err) => {
			console.log("Error: " + err);
		});
	}, [])*/ // do it once

	// releases a Pokemon and updates the DOM
	function releasePoke(id, nick){
		props.onPokeRelease(id, nick)
		if (update){
			setUpdate(false)
		} else {
			setUpdate(true)
		}
	}

	return (
		<div className="list-container">
			{props.caughtList.map((poke, id) => { // id = the Pokemon "class" ID used by the API
				return (poke.map((nick) => {
					return (
						<div className="list-item block">
							<span>{nick}</span><br/>
							<Link to={"/detail/" + id} className="default-sized-text capitalize link-never-visited">{props.pokeList[id]}</Link>
							<span className="sep4"></span>
							<button onClick={() => {releasePoke(id, nick)}}>Release</button>
						</div>
					)
				}))
			})}
		</div>
	)
}

export default MyPokes;
