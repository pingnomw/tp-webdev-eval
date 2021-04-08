import React, { useState } from 'react';

function MyPokes (props){
	const [update, setUpdate] = useState(false)

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
			{props.caughtList.map((poke, id) => {
				return (poke.map((nick) => {
					return (
						<div className="list-item block capitalize">
							{nick}<br/>
							<button onClick={() => {releasePoke(id, nick)}}>Release</button>
						</div>
					)
				}))
			})}
		</div>
	)
}

export default MyPokes;
