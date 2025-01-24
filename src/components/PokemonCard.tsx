"use client";

import React from "react";
import Image from "next/image";

interface PokemonCardProps {
  pokemon: {
    name: string;
    url: string;
  };
}

export default function PokemonCard({ pokemon }: PokemonCardProps) {
  // Function to extract the Pokemon ID from the URL
  const getPokemonNumber = (url: string) => {
    const pokemonID = url.split("/").filter(Boolean).pop();
    return pokemonID;
  };

  return (
    <div className="pokemon-card w-full rounded-lg overflow-hidden shadow-lg mx-auto cursor-pointer hover:shadow-2xl transition-all duration-200 ease-in-out transform hover:-translate-y-2">
      <div className="mx-auto w-full flex items-center justify-center relative">
        <Image
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getPokemonNumber(
            pokemon.url
          )}.png`}
          alt={pokemon.name}
          className="img-fluid company-logo"
          width={200}
          height={200}
        />
      </div>
      <div className="bg-white w-full pt-5 pb-8 text-center">
        <h1 className="capitalize font-semibold text-3xl mb-2">
          {pokemon.name}
        </h1>
      </div>
    </div>
  );
}
