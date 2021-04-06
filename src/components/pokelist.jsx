import React from 'react';

class PokeList extends React.Component{
	constructor(props){ 
		super(props);
		this.state = {list: [
			{name: "Antares", count: 3},
			{name: "Becrux", count: 0},
			{name: "Castor", count: 2},
			{name: "Deneb", count: 0},
			{name: "Electra", count: 1},
			{name: "Fomalhaut", count: 0},
			{name: "Giedi", count: 0},
			{name: "Hadron", count: 0},
			{name: "Izar", count: 0},
			{name: "Jesper", count: 0},
		]};
	}

	render() {

		let options = this.state.list.map(poke =>
			<li key={poke.name}>
				{poke.name} ({poke.count})
			</li>
		);

		return (

			<div>
				<div className="mobile-only">
					Pokémon List
				</div>
				<div>
					{options}
				</div>
				
			</div>
			
		)
	}
}

export default PokeList;
