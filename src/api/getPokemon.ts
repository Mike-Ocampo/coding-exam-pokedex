import axios from "axios";

const getPokemon = async (limit: number, offset: number) => {
  const response = await axios.get(
    `https://pokeapi.co/api/v2/pokemon/?limit=${limit}&offset=${offset}`
  );
  return response.data;
};

export default getPokemon;
