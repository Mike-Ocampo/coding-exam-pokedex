export const fetchPokemon = async (limit: number, offset: number) => {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon/?limit=${limit}&offset=${offset}`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();

  return {
    data: data.results,
    nextCursor: data.next ? offset + limit : undefined,
  };
};
