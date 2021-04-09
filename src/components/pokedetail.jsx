import Axios from 'axios';
import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom'
import imgLoading from '../img-loading.svg'

var lastNickname = "" // the nickname of the last (latest) catch

/*function setLastNickname(n){
	lastNickname = n
}*/

function PokeDetail (props){
	let {id} = useParams()

	const [numericID, setNumericID] = useState(id) // the ID of the Pokemon according to the API, used to store the list of caught Pokemon of this type
	const [name, setName] = useState("")
	const [types, setTypes] = useState([])
	const [moves, setMoves] = useState([])
	const [picture, setPicture] = useState("")
	const [caught, setCaught] = useState(props.caughtList[numericID]) // (WE ACTUALLY DON'T CARE ABOUT THIS) list of nicknames of the caught Pokemon of this type
	const [lastCatch, setLastCatch] = useState(0) // results of the last catch: 0 = nothing, 1 = success, 2 = invalid name, -1 = fail
	//const [lastNickname, setLastNickname] = useState("") // the nickname of the last Pokemon caught (temporarily stored until pushed to array)
	const [status, setStatus] = useState(0) // the status of the HTTP request
	const [error, setError] = useState("") // error message from Axios or the API
	const [imgLoaded, setImgLoaded] = useState(false)
	const [mobileNav, setMobileNav] = useState(false) // false = only show moves on mobile, true = only show owned nicknames on mobile, this is not used on desktop

	useEffect(()=>{ // get Pokemon details on component load
		getPokeDetails(id)
	}, [])

	// catch a Pokemon, called when the "Catch" button is clicked
	function catchPoke(){
		if (Math.random() < 0.5){ // Math.random() produces a random number between 0 (inclusive) and 1 (exclusive)
			setLastCatch(1) // last catch was successful
			console.log("CAUGHT")
		} else {
			setLastCatch(-1) // last catch failed
			console.log("CATCH FAILED")
		}
	}

	// updates the nickname variable when the nickname field is changed
	function updateNicknameField(event){
		lastNickname = event.target.value
		if (lastCatch == 2){
			setLastCatch(1)
		}
	}

	// releases Pokemon with a specified nickname, called from releaseClick
	function releasePoke(nick){
		/*var newList = caught.filter((name) => {
			return (name != nick)
		})
		setCaught(newList)*/
		props.onPokeRelease(numericID, nick)
		setCaught(props.caughtList[numericID])
	}

	// releases Pokemon based on the name of the triggering object
	function releaseClick(event){
		releasePoke(event.target.name)
	}

	// gives a name to the Pokemon and adds it to the caught list if the name is unique
	function namePoke(){
		if (lastNickname.length == 0 || caught.includes(lastNickname)){ // if nickname is empty or already in use
			setLastCatch(2) // bad name (empty or duplicate)
		} else {
			setLastCatch(0)
			//caught.push(lastNickname)
			props.onPokeCatch(numericID, lastNickname)
			lastNickname = ""
			setCaught(props.caughtList[numericID])
		}
	}

	// cancels the Pokemon catching and naming
	function cancelCatch(){
		setLastCatch(0)
		lastNickname = ""
	}

	// convert the array of objects for Pokemon types to an array of strings
	function mapTypes(arrayofObj){
		return arrayofObj.map(t => t.type.name)
	}

	// same as mapTypes, but for moves
	function mapMoves(arrayofObj){
		return arrayofObj.map(m => m.move.name)
	}

	// get Pokemon details from PokeAPI and:
	// updates the state variables if successful, or
	// reports the error if failed
	function getPokeDetails(id){
		console.log("Requesting https://pokeapi.co/api/v2/pokemon/" + Number(Number(id)+1) + "/")
		Axios.get("https://pokeapi.co/api/v2/pokemon/" + Number(Number(id)+1) + "/").then((res) => {
			//console.log("RESPONSE")
			//console.log(res)
			setNumericID(Number(res.data.id-1))
			setName(res.data.name)
			setTypes(mapTypes(res.data.types))
			setMoves(mapMoves(res.data.moves))
			setPicture(res.data.sprites.front_default)
			setStatus(200)
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

	var typesDisplay = (
		<div>
			{types.join(" + ")}
		</div>
	)

	var movesDisplay = moves.map(move =>
		<div className="capitalize">
			{move}
		</div>
	);

	var caughtDisplay = caught.map(nick =>
		<div>
			<button name={nick} onClick={releaseClick}>Release</button>
			<span className="sep4"></span>
			{nick}
		</div>
	);

	function CatchOptions(){
		return(
			<div className="inline-block v-align-mid">
				<div className={lastCatch > 0 ? "desktop-only-inline-block" : "catch-options"}>
					<button className="big-button" onClick={() => {catchPoke()}} disabled={lastCatch > 0}>CATCH</button>
					{lastCatch > 0 ? null :
					<span>
						<span className="sep4"></span>
						<span className="small-text">(50% chance)</span>
					</span>
					}
				</div>
				<span className="sep4"></span>
				<div className="inline-block v-align-mid">
					{lastCatch > 0
					? <div>
						<div>You caught a <span className="capitalize">{name}</span>! Give it a nickname:</div>
						<input title={"Enter a nickname for the newly caught Pokemon here"} onChange={updateNicknameField}></input>
						<button onClick={namePoke}>OK</button>
						<button onClick={cancelCatch}>Cancel</button>
						{lastCatch == 2 && lastNickname.length > 0
						? <div className="error">You already have a Pokemon named {lastNickname}. Please choose a different nickname.</div>
						: null}
						{lastCatch == 2 && lastNickname.length == 0
						? <div className="error">The nickname cannot be empty.</div>
						: null}
					</div>
					: null}
					{lastCatch == -1
					? <div>You failed to catch the <span className="capitalize">{name}</span>.</div>
					: null}
				</div>
			</div>
			
		)
	}

	function DetailDisplay(){ // shows the details UI (picture, name, types, moves, nicknames)
		return (
			<div> {/* main div */}

				<div className="detail-header poke-img-container">
					<img src={picture} alt={"picture of " + name} className="v-align-mid" onLoad={() => {setImgLoaded(true)}}></img>
					{imgLoaded ? null : <img src={imgLoading} className="v-align-mid" alt={"loading picture of" + name}></img>}
					<div className="inline-block v-align-mid">
						<div className="title capitalize">{name}</div>
						<div className="subtitle">{typesDisplay}</div>
					</div>
					<div className="inline-block sep10"></div>
					<br className="mobile-only" />
					<CatchOptions />
				</div>

				<div className="mobile-detail-selector">
					<span className="mobile-detail-selector-title float-left"><strong className="capitalize">{mobileNav ? ("Caught " + name + " (" + caught.length + ")") : (name + " moves (" + moves.length + ")")}</strong></span>
					<button className="mobile-detail-switch-button float-right" onClick={() => {setMobileNav(!mobileNav)}}>{mobileNav ? "Show Moves" : "Show Caught"}</button>
				</div>

				<div className="detail-split-container">

					<div className={mobileNav ? "detail-content-nomobile" : "detail-content"}>
						<div className="desktop-only"><strong>Moves</strong> (<strong>{moves.length}</strong>):</div>
						{movesDisplay}
					</div>
					<div className={mobileNav ? "detail-content" : "detail-content-nomobile"}>
						<div className="desktop-only"><strong>Caught</strong> (<strong>{caught.length}</strong>):</div>
						{caught.length == 0 ? <div>You don't have any <span className="capitalize">{name}</span> caught.</div> : caughtDisplay}
					</div>

				</div>
				
			</div> /* end of main div */
			
		)
	}

	return (
		<div>
			{status == 0 ?
				<div className="loading">Loading Pokemon details...</div>
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
