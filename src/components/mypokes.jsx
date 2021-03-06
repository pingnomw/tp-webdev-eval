import React, { useState } from 'react';
import {Link} from 'react-router-dom';

function MyPokes (props){
	const [update, setUpdate] = useState(false) // used to trigger DOM update

	var anythingCaught = false

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
				anythingCaught = anythingCaught || (poke.length > 0)
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
			{/*(!anythingCaught) ? <div className="title">You don't have any Pokemon caught.</div> : null*/}
		</div>
	)
}

export default MyPokes;
