import Axios from 'axios';
import React, {useState, useEffect} from 'react';
import {useLocation, useParams} from 'react-router-dom'

var lastCatch = 0 // 0 = nothing, 1 = success, -1 = fail

function PokeDetail (){
	const [name, setName] = useState("")
	const [types, setTypes] = useState([{type: {name: ""}}])
	const [moves, setMoves] = useState([{move: {name: ""}}])
	const [picture, setPicture] = useState("")
	const [caught, setCaught] = useState([]) // list of nicknames of the caught Pokemon of this type
	const [status, setStatus] = useState(0) // the status of the HTTP request
	const [error, setError] = useState("") // error message from Axios or the API
	
	let {id} = useParams()

	useEffect(()=>{
		ShowPokeDetails(id)
	}, [])

	function mapTypes(arrayofObj){
		arrayofObj.map(t => {
			return t.type.name
		})
	}

	function ShowPokeDetails(id){
		//console.log("Requesting https://pokeapi.co/api/v2/pokemon/" + id + "/")
		Axios.get("https://pokeapi.co/api/v2/pokemon/" + id + "/").then((res) => {
			//console.log("RESPONSE")
			//console.log(res)
			setStatus(200)
			setName(res.data.name)
			setTypes(res.data.types)
			setMoves(res.data.moves)
			setPicture(res.data.sprites.front_default)
		}).catch((err) => {
			console.log(err);
			if (err == "Error: Network Error"){
				setStatus(-1)
			} else if(err == "Error: Request failed with status code 404"){
				setStatus(404)
			} else {
				setStatus(err.status)
			}
			setError(err.data)
		})
	}

	let typesDisplay = types.map(type =>
		<div className="capitalize">
			{type.type.name}
		</div>
	);

	let movesDisplay = moves.map(move =>
		<div className="capitalize">
			{move.move.name}
		</div>
	);

	let caughtDisplay = caught.map(nick =>
		<li key={nick}>
			{nick}
		</li>
	);

	function DetailDisplay(){ // shows the details UI (picture, name, types, moves, nicknames)
		return (
			<div>
				<div className="detail-header">
					<div>
						<img src={picture} alt={"picture of " + name} className="v-align-mid"></img>
						<span className="title capitalize">{name}</span>
					</div>
					<div>
						<strong>Types</strong>:<br/>
						{typesDisplay}
					</div>
				</div>
				
				<div>
					<strong>Moves</strong> (<strong>{moves.length}</strong>):<br/>
					{movesDisplay}
				</div>
				<div>
					<strong>Caught</strong> (<strong>{caught.length}</strong>):<br/>
					{caught.length == 0 ? <div>You don't have any <span className="capitalize">{name}</span> caught.</div> : caughtDisplay}
				</div>
			</div>
			
		)
	}

	return (
		<div>
			<div className="mobile-only">
				Pokémon Details
			</div>
			{status == 0 ?
				<div className="loading">Loading details for <span className="capitalize">{id}</span>...</div>
			: null }

			{status == 200 ?
				<DetailDisplay />
			: null}

			{status == 404 ?
				<div className="loading">Pokemon not found.</div>
			: null}

			{status == -1 ?
				<div className="loading">You might not be connected to the internet or the server might be down.</div>
			: null}

			{status != 0 && status != 200 && status != 404 && status != -1?
				<div className="loading">Could not connect to the API. Please try again later.</div>
			: null}
			
		</div>
		
	)
}

export default PokeDetail;
