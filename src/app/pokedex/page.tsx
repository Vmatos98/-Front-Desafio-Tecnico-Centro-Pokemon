'use client';

import { useEffect, useState, useCallback } from 'react';
import { Pokemon } from '@/types/pokemon';
import { User } from '@/types/auth';
import { authService } from '@/services/auth';
import { pokemonService } from '@/services/pokemon';
import { useAuth } from '@/hooks/useAuth';
import { PokemonCard } from '@/components/PokemonCard';
import { LogOut, Loader2, User as UserIcon } from 'lucide-react';
import { AxiosError } from 'axios';

export default function PokedexPage() {
  const { logout } = useAuth();
  
  const [user, setUser] = useState<User | null>(null);
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const profile = await authService.getProfile();
      setUser(profile);

      // Fetch both lists in parallel
      const [myPokemons, otherPokemons] = await Promise.all([
        pokemonService.getMine(),
        pokemonService.getOthers()
      ]);

      // Combine and optionally sort by ID or creation date
      const combined = [...myPokemons, ...otherPokemons].sort((a, b) => b.id - a.id);
      setPokemons(combined);
    } catch (err: unknown) {
      console.error('Failed to fetch Pokedex data:', err);
      // Assuming 401 means token expired
      const axiosError = err as AxiosError;
      if (axiosError?.response?.status === 401) {
         logout();
      } else {
         setError('Não foi possível carregar os dados da Pokédex. Tente novamente mais tarde.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleEdit = (pokemon: Pokemon) => {
    // TBD: Implement edit modal
    console.log('Edit pokemon', pokemon);
  };

  const handleDelete = async (pokemon: Pokemon) => {
    // TBD: Implement actual UI confirmation vs simple confirm
    if (window.confirm(`Tem certeza que deseja transferir o ${pokemon.name}?`)) {
      try {
        await pokemonService.remove(pokemon.id);
        setPokemons(prev => prev.filter(p => p.id !== pokemon.id));
      } catch (err) {
        console.error('Failed to delete pokemon', err);
        alert('Não foi possível excluir o Pokémon.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 font-sans text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-zinc-900/80 backdrop-blur-xl border-b border-zinc-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-zinc-900 border-2 border-zinc-800 flex flex-col overflow-hidden shadow-sm relative shrink-0">
              <div className="h-1/2 w-full bg-red-600"></div>
              <div className="h-1/2 w-full bg-white flex justify-center border-t-2 border-zinc-800">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-zinc-800 rounded-full"></div>
              </div>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-100">
              Centro Pokémon
            </h1>
          </div>

          <div className="flex items-center gap-6">
            {user && (
              <div className="flex items-center gap-2 text-zinc-300">
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
                  <UserIcon className="w-4 h-4 text-zinc-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold leading-tight">{user.name}</span>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest leading-none">Treinador</span>
                </div>
              </div>
            )}
            
            <button
              onClick={logout}
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors flex items-center gap-2"
              title="Sair do Sistema"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 relative">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Painel da Pokédex</h2>
            <p className="text-zinc-400 text-sm">Gerencie seus Pokémons e explore a rede global.</p>
          </div>
          <button 
             className="bg-zinc-100 text-zinc-950 hover:bg-white px-5 py-2.5 rounded-xl font-bold tracking-wide text-sm transition-all focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-950 focus:ring-white flex items-center justify-center"
             onClick={() => alert('Add Pokemon Modal here!')}
          >
             + Capturar Pokémon
          </button>
        </div>

        {/* Status / Loading / Error Layers */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-zinc-500 animate-spin mb-4" />
            <p className="text-zinc-400 font-medium">Sincronizando com a rede neural...</p>
          </div>
        ) : error ? (
          <div className="bg-red-950/20 border border-red-900/50 rounded-2xl p-6 text-center">
            <p className="text-red-400 font-medium">{error}</p>
            <button onClick={fetchData} className="mt-4 px-4 py-2 bg-zinc-800 rounded-lg text-sm hover:bg-zinc-700 transition-colors">
              Tentar Novamente
            </button>
          </div>
        ) : pokemons.length === 0 ? (
          <div className="bg-zinc-900/50 border border-zinc-800 border-dashed rounded-3xl p-12 text-center">
             <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl opacity-50">?</span>
             </div>
             <h3 className="text-lg font-semibold text-zinc-200 mb-1">Nenhum Pokémon Encontrado</h3>
             <p className="text-zinc-500 text-sm max-w-sm mx-auto">
                A Pokédex está vazia. Comece a sua jornada clicando em &quot;Capturar Pokémon&quot; no topo!
             </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {pokemons.map((pokemon) => (
              <PokemonCard 
                key={pokemon.id} 
                pokemon={pokemon} 
                currentUserId={user?.id ? Number(user.id) : undefined} 
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
