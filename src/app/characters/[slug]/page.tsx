"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Ability = {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
};

type Pokemon = {
  id: number;
  name: string;
  base_experience: number;
  abilities: Ability[];
  sprites: {
    front_default: string;
  };
};

const Page = ({ params }: { params: { slug: string } }) => {
  const [nickname, setNickname] = useState("");
  const [date, setDate] = useState("");
  const [capturedDetails, setCapturedDetails] = useState<
    { nickname: string; date: string }[]
  >([]);
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  const router = useRouter();

  useEffect(() => {
    const savedDetails = localStorage.getItem("capturedDetails");
    if (savedDetails) {
      setCapturedDetails(JSON.parse(savedDetails));
    }
  }, []);

  const handleCapture = () => {
    if (!nickname || !date) {
      alert("Please enter both Nickname and Date.");
      return;
    }

    const datePattern = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
    if (!datePattern.test(date)) {
      alert("Please enter a valid date in MM/DD/YYYY format.");
      return;
    }

    const newDetail = { character: pokemon?.name, nickname, date };
    const updatedDetails = [...capturedDetails, newDetail];
    localStorage.setItem("capturedDetails", JSON.stringify(updatedDetails));
    setCapturedDetails(updatedDetails);
    setNickname("");
    setDate("");

    // Set success message
    setSuccessMessage("Pokemon tagged as captured successfully!");

    // Clear success message after 3 seconds (for UX)
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  useEffect(() => {
    const fetchPokemonDetails = async (slug: string) => {
      setLoading(true);
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${slug}`);
      if (!response.ok) {
        console.error("Failed to fetch Pokémon details");
        setLoading(false);
        return;
      }
      const data = await response.json();
      setPokemon(data);
      setLoading(false);
    };

    const fetchParams = async () => {
      const { slug } = await params;
      fetchPokemonDetails(slug);
    };

    fetchParams();
  }, [params]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl font-semibold text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!pokemon) {
    return <div className="text-center text-lg py-20">Pokemon not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="text-white bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-md shadow-md flex items-center justify-center transition-all duration-300"
        >
          <span className="mr-2">&#8592;</span> Back
        </button>

        <div className="rounded-lg shadow">
          {/* Pokemon Image */}
          <div className="text-center relative pb-10 bg-gray-200 mt-6">
            <Image
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
              alt="Pokemon"
              width={200}
              height={200}
              className="inline-block"
            />
          </div>

          {/* Pokemon Name */}
          <div className="bg-white text-center py-4">
            <h1 className="text-3xl font-bold capitalize text-gray-800">
              {pokemon.name}
            </h1>
          </div>
        </div>

        {/* Details Section */}
        <div className="bg-white p-6 rounded-lg mt-8 shadow">
          <div className="mb-6 text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Base Experience:
            </h2>
            <p className="text-lg text-gray-600">{pokemon.base_experience}</p>
          </div>

          <div className="mb-6 text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Abilities:
            </h2>
            {pokemon.abilities?.length > 0 ? (
              <>
                {pokemon.abilities.map((ability: Ability) => (
                  <p
                    key={ability?.ability?.name}
                    className="text-lg text-gray-600"
                  >
                    {ability?.ability?.name}
                  </p>
                ))}
              </>
            ) : (
              <p className="text-lg text-gray-600">No abilities available.</p>
            )}
          </div>
        </div>

        {/* Capture Form */}
        <div className="bg-white max-w-md mx-auto p-6 rounded-lg shadow-lg mt-8">
          <h3 className="text-2xl font-semibold text-center mb-6">
            Tag as Captured
          </h3>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="nickname"
                className="block text-sm font-medium text-gray-700"
              >
                Nickname:
              </label>
              <input
                type="text"
                id="nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Enter nickname"
                className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700"
              >
                Date (MM/DD/YYYY):
              </label>
              <input
                type="text"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="MM/DD/YYYY"
                className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="text-center">
              <button
                onClick={handleCapture}
                className="w-full py-3 mt-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
              >
                Tag as Captured
              </button>
            </div>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mt-4 text-center text-green-500 font-semibold">
              {successMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
