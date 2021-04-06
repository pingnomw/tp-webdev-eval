import Axios from 'axios';
import React, {useState, useEffect} from 'react';

const limit = 100
var maxPage

function PokeList(){
	const [list, setList] = useState([]) // the list of pokemon
	const [status, setStatus] = useState(0) // the status of the HTTP request
	const [offset, setOffset] = useState(0) // the offset of the Pokemon list
	const [pokeCount, setPokeCount] = useState(0) // the total count of Pokemon from the API
	const [pageNum, setPageNum] = useState(1) // current page number
	const [error, setError] = useState("") // error message from Axios or the API

	// request a list of Pokemon from the API
	useEffect(() => {
		console.log("Sending request to https://pokeapi.co/api/v2/pokemon?limit=" + limit + "&offset=" + offset)
		Axios.get("https://pokeapi.co/api/v2/pokemon?limit=" + limit + "&offset=" + offset).then((res) => {
			setStatus(200)
			//console.log(res)
			setPokeCount(res.data.count)
			maxPage = Math.ceil(res.data.count / limit)
			setList(res.data.results)
		}).catch((err) => {
			console.log("Error: " + err);
			setStatus(err.status)
			setError(err.data)
		});
	}, [offset]) // only update if offset changes

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

	let displayList = list.map(poke =>
		<div className="capitalize">
			{poke.name} ({poke.count})
		</div>
	);

	// page navigation buttons + position indicator
	let pageButtons = (
		<div>
			<button name="first" disabled={offset == 0} onClick={() => {firstPage()}}>First</button>
			<button name="prev" disabled={offset == 0} onClick={() => {prevPage()}}>Prev</button>
				{pageNum}/{maxPage} ({offset+1} - {pageNum == maxPage ? pokeCount : offset+limit})
			<button name="next" disabled={pageNum >= maxPage} onClick={() => {nextPage()}}>Next</button>
			<button name="last" disabled={pageNum >= maxPage} onClick={() => {lastPage()}}>Last</button>		
		</div>
	)

	return (

		<div>
			<div className="mobile-only">
				Pokémon List
			</div>

			{status == 0 ?
				<div>Loading page {pageNum}...</div>
			: null }

			{status == 200 ?
				<div>
					{pageButtons}
					<div>
						{displayList}
					</div>
					{pageButtons}
				</div>
			: null}

			{status != 0 && status != 200?
				<div>Could not connect to the API. {error}</div>
			: null}
			
			
		</div>
		
	)
}

export default PokeList;
