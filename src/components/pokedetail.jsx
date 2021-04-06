import React from 'react';

var lastCatch = 0 // 0 = nothing, 1 = success, -1 = fail

class PokeDetail extends React.Component{
	constructor(props){ 
		super(props);
		this.state = {
			name: "Antares",
			types: ["Metal", "Fire"],
			moves: ["Move", "Attack", "Defuse"],
			caught: [],
		};
		this.catch = this.catch.bind(this)
		this.release = this.release.bind(this)
	}

	catch(name){
		
	}

	release(){

	}

	render() {
		let types = this.state.types.map(type =>
			<li key={type}>
				{type}
			</li>
		);

		let moves = this.state.moves.map(move =>
			<li key={move}>
				{move}
			</li>
		);

		return (
			<div>
				<div className="mobile-only">
					Pokémon Details
				</div>
				<div className="title">{this.state.name}</div>
				<div>
					Types:<br/>
					{types}
				</div>
				<div>
					Moves:<br/>
					{moves}
				</div>
			</div>
			
		)
	}
}

export default PokeDetail;
