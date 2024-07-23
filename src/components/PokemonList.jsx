import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { usePokemonContext } from '../context/PokemonContext';
import '../styles.css';

const PokemonList = () => {
  const { state, dispatch } = usePokemonContext();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const page = parseInt(params.get('page')) || 1;
    dispatch({ type: 'SET_PAGE', payload: page });
  }, [location.search, dispatch]);

  const handlePageChange = (newPage) => {
    dispatch({ type: 'SET_PAGE', payload: newPage });
    navigate(`/?page=${newPage}`);
  };

  return (
    <div className="container">
      <h1 className="PokemonListHeading">Pokemons</h1>
      <div className="pokemon-list">
        {state.pokemonList.map((pokemon) => (
          <Link to={`/pokemon/${pokemon.name}?page=${state.currentPage}`} key={pokemon.name} className="pokemon-item">
            <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.url.split('/')[6]}.png`} alt={pokemon.name} />
            <h3>{pokemon.name[0].toUpperCase() + pokemon.name.slice(1)}</h3>
          </Link>
        ))}
      </div>
      <div className="pagination">
        <button disabled={state.currentPage === 1} onClick={() => handlePageChange(state.currentPage - 1)}>Previous</button>
        <span>Page {state.currentPage} of {state.totalPages}</span>
        <button disabled={state.currentPage === state.totalPages} onClick={() => handlePageChange(state.currentPage + 1)}>Next</button>
      </div>
    </div>
  );
};

export default PokemonList;
