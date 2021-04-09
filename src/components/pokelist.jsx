//import Axios from 'axios';
import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';

function PokeList(props){
	const [status, setStatus] = useState(props.status) // the status of the HTTP request
	const [error, setError] = useState("") // error message from Axios or the API
	const [searching, setSearching] = useState(false) // if true, then filter the list based on searchQuery
	const [searchQeury, setSearchQuery] = useState("") // if searching is true, then only show Pokemon with the name containing this (only updated when search is clicked)

	var tempSearchQuery = "" // instantly updated whenever the user changes something in the search box
	
	// set status from HTTP request done by App.js
	useEffect(() => {
		if (props.pokeList.length > 0){
			setStatus(props.status)
		}
	}, [props.status, props.pokeList])

	// triggers the app to filter the list
	function search(){
		if (tempSearchQuery.length > 0){
			setSearchQuery(tempSearchQuery)
			setSearching(true)
		} else if (searching){ // and temp search query is blank
			resetSearch()
		}
	}

	// triggers the app to clear filter, showing all Pokemon from the API
	function resetSearch(){
		setSearching(false)
		setSearchQuery("")
		tempSearchQuery = ""
	}

	// display an entry in the list
	function DisplayPoke(poke, index){
		return(
			<Link className="list-item list-link block hidden-link capitalize" to={"/detail/" + Number(index)}>
				{poke}
				{props.caughtList[index].length == 0
				? <div className="default-sized-text text-gray">NONE OWNED</div>
				: <div className="default-sized-text">{props.caughtList[index].length} OWNED</div>
				}
			</Link>
		)
	}

	// display the entire list, optionally only showing Pokemon whose name containing the search query
	var displayList = props.pokeList.map((poke, index) =>
		{return (searching === false || poke.includes(searchQeury)) ? DisplayPoke(poke, index) : null}
	);

	// display the search/filter options (input, search/filter button, reset/clear/show all button)
	var searchOptions = (
		<div className="detail-header search-container">
			<input name="searchbox" onChange={(event) => tempSearchQuery = event.target.value.toLowerCase()} className="search-input"></input>
			<br className="mobile-only" />
			<div className="inline-block search-buttons-container">
				<button name="searchbtn" onClick={search} className="search-exec-button search-buttons">Filter by name</button>
				<button name="searchreset" onClick={resetSearch} disabled={!searching} className="search-reset-button search-buttons">{searching ? "Show all" : "Showing all"}</button>
			</div>
			
		</div>
	)

	return ( // main render "function"
		<div>
			{status == 0 ? // status 0 means the loading is unfinished
				<div className="loading">Loading list...</div>
			: null }

			{status == 200 ? // status 200 (HTTP 200 OK) means the loading successfully completed
				<div>
					{searchOptions}
					<div className="list-container">
						{displayList}
					</div>
				</div>
			: null}

			{status != 0 && status != 200?
				<div>Could not connect to the API. Your internet or their servers might be down.<br/>{error}</div>
			: null}
			
		</div>
		
	)
}

export default PokeList;
