import React, { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { usePokemonContext } from '../context/PokemonContext';
import '../styles.css';

const PokemonDetail = () => {
  const { name } = useParams();
  const { state, dispatch } = usePokemonContext();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchPokemonDetail = async () => {
      if (!state.pokemonDetails[name]) {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        const data = await response.json();
        dispatch({ type: 'SET_POKEMON_DETAIL', payload: { name, data, page: new URLSearchParams(location.search).get('page') } });
      }
    };

    fetchPokemonDetail();
  }, [name, state.pokemonDetails, dispatch, location.search]);

  const pokemon = state.pokemonDetails[name];
  const currentPage = new URLSearchParams(location.search).get('page') || 1;

  if (!pokemon) {
    return <div>Loading... Please wait!🤗</div>;
  }

  const handleBackClick = () => {
    const page = state.pokemonPageMap[name] || currentPage;
    navigate(`/?page=${page}`);
  };

  return (
    <div className="pokemon-detail">
      <h2>{pokemon.name}</h2>
      <div className="sprites">
        {pokemon.sprites.front_default && <img src={pokemon.sprites.front_default} alt={pokemon.name} />}
        {pokemon.sprites.back_default && <img src={pokemon.sprites.back_default} alt={pokemon.name} />}
        {pokemon.sprites.front_shiny && <img src={pokemon.sprites.front_shiny} alt={pokemon.name} />}
        {pokemon.sprites.back_shiny && <img src={pokemon.sprites.back_shiny} alt={pokemon.name} />}
      </div>
      <ul>
        <li>Height: {pokemon.height}</li>
        <li>Weight: {pokemon.weight}</li>
      </ul>
      <div className="abilities">
        <h3>Abilities:</h3>
        {pokemon.abilities.map((abilityObj) => (
          <div key={abilityObj.ability.name} className="ability">
            {abilityObj.ability.name}
          </div>
        ))}
      </div>
      <button onClick={handleBackClick} className="back-button">Back</button>
    </div>
  );
};

export default PokemonDetail;
