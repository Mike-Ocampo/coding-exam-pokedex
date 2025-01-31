"use client";

import React, { useState } from "react";
import { fetchPokemon } from "../lib/fetchPokemon";
import PokemonCard from "../components/PokemonCard";
import ViewToggle from "../components/ViewToggle";
import Link from "next/link";
import { useInfiniteQuery } from "@tanstack/react-query";

const LIMIT = 50;

interface Pokemon {
  name: string;
  url: string;
}

interface CapturedDetails {
  character: string;
  nickname: string;
  date: string;
}

interface FetchProjectsParams {
  pageParam: string | number;
}

export default function Page() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCapturedOnly, setIsCapturedOnly] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const {
    data,
    error,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["pokemon", LIMIT],
    queryFn: ({ pageParam = 0 }) => fetchPokemon(LIMIT, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl font-semibold text-gray-500">Loading...</p>
      </div>
    );
  }
  if (error instanceof Error) return <div>Error: {error.message}</div>;

  const filteredPokemons = data?.pages
    .flatMap((page) => page.data) // Flatten all pages into a single array
    .filter((pokemon: Pokemon) =>
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const limitedPokemons = searchTerm
    ? filteredPokemons?.slice(0, 150)
    : filteredPokemons;

  const capturedPokemons = localStorage.getItem("capturedDetails");
  const capturedPokemonDetails: CapturedDetails[] = capturedPokemons
    ? JSON.parse(capturedPokemons)
    : [];

  const displayedPokemons = isCapturedOnly
    ? limitedPokemons?.filter((pokemon) =>
        capturedPokemonDetails.some(
          (captured) => captured.character === pokemon.name
        )
      )
    : limitedPokemons;

  return (
    <div className="p-16">
      <h1 className="text-6xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-yellow-500 to-red-600 pb-6">
        Pokedex
      </h1>

      {/* Search bar */}
      <div className="text-center">
        <input
          type="text"
          placeholder="Search for a Pokémon..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>

      {/* Button to toggle between "All" and "Captured" and View Toggle Component */}
      <div className="flex justify-center items-center mb-6 space-x-4 m-4">
        <div>
          <button
            onClick={() => setIsCapturedOnly(false)}
            className={`px-4 py-2 border rounded-lg ${
              !isCapturedOnly ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setIsCapturedOnly(true)}
            className={`px-4 py-2 ml-4 border rounded-lg ${
              isCapturedOnly ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Captured
          </button>
        </div>

        <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
      </div>

      {/* Pokémon List */}
      <div
        className={`mx-auto w-full text-center ${
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6"
            : "grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-y-4"
        }`}
      >
        {displayedPokemons?.length === 0 ? (
          <p>No data available</p>
        ) : (
          displayedPokemons?.map((pokemon: Pokemon) => {
            const capturedData = capturedPokemonDetails.find(
              (captured) => captured.character === pokemon.name
            );

            return (
              <Link
                key={pokemon.name}
                className="text-primary"
                href={`/characters/${pokemon.name}`}
              >
                {viewMode === "grid" ? (
                  <div className="border p-4 rounded-lg">
                    <PokemonCard key={pokemon.name} pokemon={pokemon} />
                    <div className="mt-2">
                      {capturedData ? (
                        <>
                          <p className="text-gray-500">
                            Nickname: {capturedData.nickname}
                          </p>
                          <p className="text-gray-500">
                            Date: {capturedData.date}
                          </p>
                        </>
                      ) : (
                        <p className="text-gray-500 italic">Not captured</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 p-4 border rounded-lg">
                    <img
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
                        pokemon.url.split("/")[
                          pokemon.url.split("/").length - 2
                        ]
                      }.png`}
                      alt={pokemon.name}
                      className="w-16 h-16"
                    />
                    <div className="text-left">
                      <h3 className="text-xl font-semibold">{pokemon.name}</h3>
                      {capturedData ? (
                        <>
                          <p className="text-gray-500">
                            Nickname: {capturedData.nickname}
                          </p>
                          <p className="text-gray-500">
                            Date: {capturedData.date}
                          </p>
                        </>
                      ) : (
                        <p className="text-gray-500 italic">Not captured</p>
                      )}
                    </div>
                  </div>
                )}
              </Link>
            );
          })
        )}
      </div>
      {!isCapturedOnly && (
        <>
          <div className="flex justify-center items-center mt-8">
            <button
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage || isFetchingNextPage}
              className={`px-4 py-2 ml-4 border rounded-lg bg-blue-500 text-white`}
            >
              {isFetchingNextPage
                ? "Loading more..."
                : hasNextPage
                ? "Load More"
                : "Nothing more to load"}
            </button>

            <div>
              {isFetching && !isFetchingNextPage ? "Fetching..." : null}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
