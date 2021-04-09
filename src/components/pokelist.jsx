import Axios from 'axios';
import React, {useState, useEffect} from 'react';
import {Link, useParams} from 'react-router-dom';

const limit = 100
var maxPage

function PokeList(props){
	const [list, setList] = useState([{id: 0, name: ""}]) // the list of pokemon
	const [status, setStatus] = useState(0) // the status of the HTTP request
	const [offset, setOffset] = useState(0) // the offset of the Pokemon list
	const [pokeCount, setPokeCount] = useState(0) // the total count of Pokemon from the API
	const [pageNum, setPageNum] = useState(1) // current page number
	const [error, setError] = useState("") // error message from Axios or the API
	const [searching, setSearching] = useState(false)
	const [searchQeury, setSearchQuery] = useState("")

	var tempSearchQuery = ""
	var targetPage = pageNum;

	// actually removes the URL and adds the ID
	function processResponse(resArray){
		var newArray = resArray.map((val, idx) => {
			return ({id: (idx + offset + 1), name: val.name, caughtNum: props.caughtList[idx+offset+1].length})
		})
		setList(newArray)
	}

	// request a list of Pokemon from the API
	// now done only once from App.js
	/*useEffect(() => {
		console.log("Sending request to https://pokeapi.co/api/v2/pokemon?limit=" + limit + "&offset=" + offset)
		Axios.get("https://pokeapi.co/api/v2/pokemon?limit=" + limit + "&offset=" + offset).then((res) => {
			setStatus(200)
			//console.log(res)
			setPokeCount(res.data.count)
			maxPage = Math.ceil(res.data.count / limit)
			//setList(res.data.results)
			processResponse(res.data.results)
		}).catch((err) => {
			console.log("Error: " + err);
			setStatus(err.status)
			setError(err.data)
		});
	}, [offset])*/ // only update if offset changes

	useEffect(() => {
		setStatus(200)
	})

	// calculates the offset of the last page
	function lastPageOffset(){
		return Math.floor(pokeCount/limit)*limit
	}

	// go to page 1 of the list
	function firstPage(){
		setStatus(0)
		setPageNum(1)
		setOffset(0)
	}

	// go to the previous page of the list
	function prevPage(){
		if (pageNum > 1){
			setPageNum(pageNum - 1)
			setStatus(0)

			if (offset >= limit){
				setOffset(offset - limit)
			} else { // set offset to 0 if the user clicks previous and for whatever reason the program does not jump a full page
				setOffset(0)
			}
		}
	}

	// go to the next page of the list
	function nextPage(){
		if (pageNum < maxPage){
			setPageNum(pageNum + 1)
			setStatus(0)

			if (offset <= (pokeCount - limit)){
				setOffset(offset + limit)
			} else { // round offset to the highest multiple of limit that does not exceed pokeCount if the user clicks next and for whatever reason the program does not jump a full page
				setOffset(lastPageOffset())
			}
		}
	}

	// go to the last page of the list
	function lastPage(){
		setStatus(0)
		setPageNum(maxPage)
		setOffset(lastPageOffset())
	}

	// instantly go to a specified page
	function pageJump(num){
		if (num > 0 && num <= maxPage){
			setPageNum(num)
			setOffset((num-1) * limit)
			setStatus(0)
		}
	}

	function pageSelect(event){
		targetPage = Number(event.target.value)
		pageJump(targetPage)
	}

	function search(query){
		setSearchQuery(tempSearchQuery)
		setSearching(true)
	}

	function resetSearch(){
		setSearching(false)
		setSearchQuery("")
		tempSearchQuery = ""
	}

	/*var displayList = list.map((poke, index) =>
		<Link className="list-item block hidden-link capitalize" to={"/detail/" + poke.id}>
			{poke.name} ({poke.caughtNum})
		</Link>
	);*/

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

	var displayList = props.pokeList.map((poke, index) =>
		{return (searching === false || poke.includes(searchQeury)) ? DisplayPoke(poke, index) : null}
	);



	// page navigation buttons + position indicator
	// NO LONGER USED
	var pageButtons = (
		<div className="pgnav">
			<div className="pgnum">Page {pageNum}/{maxPage} (entries {offset+1} - {pageNum == maxPage ? pokeCount : offset+limit} out of {pokeCount})</div>
			<button name="first" disabled={offset == 0} onClick={() => {firstPage()}}>First</button>
			<span className="sep4"></span>
			<button name="prev" disabled={offset == 0} onClick={() => {prevPage()}}>Prev</button>
			<span className="sep10"></span>
			<select name="pagejump" defaultValue={pageNum} onChange={pageSelect} title="Go to a specific page.">
				{Array.from(Array(maxPage).keys()).map(p => 
					<option key={p+1} value={p+1}>
						{p+1}
					</option>
				)}
			</select>
			{/*<button name="pagejumpgo" onClick={() => {pageJump(targetPage)}} title="Go to the page specified on the field to the left of this button.">Go</button>*/}
			<span className="sep10"></span>
			<button name="next" disabled={pageNum >= maxPage} onClick={() => {nextPage()}}>Next</button>
			<span className="sep4"></span>
			<button name="last" disabled={pageNum >= maxPage} onClick={() => {lastPage()}}>Last</button>		
		</div>
	)

	var searchOptions = (
		<div className="detail-header">
			<input name="searchbox" onChange={(event) => tempSearchQuery = event.target.value}></input>
			<button name="searchbtn" onClick={search}>Search</button>
			<button name="searchreset" onClick={resetSearch} disabled={!searching}>Reset search</button>
		</div>
	)

	return (

		<div>
			{status == 0 ?
				<div className="loading">Loading list...</div>
			: null }

			{status == 200 ?
				<div>
					{/*pageButtons*/}
					{searchOptions}
					<div className="list-container">
						{displayList}
					</div>
					{/*pageButtons*/}
				</div>
			: null}

			{status != 0 && status != 200?
				<div>Could not connect to the API. Your internet or their servers might be down.<br/>{error}</div>
			: null}
			
			
		</div>
		
	)
}

export default PokeList;
