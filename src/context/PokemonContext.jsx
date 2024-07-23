import React, { createContext, useContext, useReducer, useEffect } from 'react';

const PokemonContext = createContext();

const initialState = {
  pokemonList: [],
  pokemonDetails: {},
  currentPage: 1,
  totalPages: 0,
  pokemonPageMap: {},
};

const pokemonReducer = (state, action) => {
  switch (action.type) {
    case 'SET_POKEMON_LIST':
      return {
        ...state,
        pokemonList: action.payload.results,
        totalPages: Math.ceil(action.payload.count / 20),
      };
    case 'SET_POKEMON_DETAIL':
      return {
        ...state,
        pokemonDetails: {
          ...state.pokemonDetails,
          [action.payload.name]: action.payload.data,
        },
        pokemonPageMap: {
          ...state.pokemonPageMap,
          [action.payload.name]: action.payload.page,
        },
      };
    case 'SET_PAGE':
      return {
        ...state,
        currentPage: action.payload,
      };
    default:
      return state;
  }
};

export const PokemonProvider = ({ children }) => {
  const [state, dispatch] = useReducer(pokemonReducer, initialState);

  useEffect(() => {
    const fetchPokemonList = async () => {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${(state.currentPage - 1) * 20}`);
      const data = await response.json();
      dispatch({ type: 'SET_POKEMON_LIST', payload: data });
    };

    fetchPokemonList();
  }, [state.currentPage]);

  return (
    <PokemonContext.Provider value={{ state, dispatch }}>
      {children}
    </PokemonContext.Provider>
  );
};

export const usePokemonContext = () => useContext(PokemonContext);
