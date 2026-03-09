import React, { useState, useEffect } from 'react';
import { X, Search, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Pokemon, CreatePokemonDto, UpdatePokemonDto } from '../types/pokemon';
import { pokemonService } from '../services/pokemon';

export type ModalMode = 'add' | 'edit';

interface PokemonModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: ModalMode;
  initialData?: Pokemon;
  onSuccess: (pokemon: Pokemon, mode: ModalMode) => void;
}

export const PokemonModal: React.FC<PokemonModalProps> = ({
  isOpen,
  onClose,
  mode,
  initialData,
  onSuccess
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchedPokemon, setSearchedPokemon] = useState<Partial<CreatePokemonDto> | null>(null);

  const [level, setLevel] = useState<number>(1);
  const [hp, setHp] = useState<number>(100);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setIsLoading(false);
      setSearchQuery('');
      setIsSearching(false);
      
      if (mode === 'edit' && initialData) {
        setSearchedPokemon(initialData);
        setLevel(initialData.level);
        setHp(initialData.hp);
      } else {
        setSearchedPokemon(null);
        setLevel(1);
        setHp(100);
      }
    }
  }, [isOpen, mode, initialData]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setIsSearching(true);
      setError(null);
      const result = await pokemonService.searchExternal(searchQuery.toLowerCase().trim());
      setSearchedPokemon(result);
      setLevel(1);
      setHp(result.hp);
    } catch (err) {
      console.error('Search failed', err);
      setError('Pokémon não encontrado. Verifique o nome e tente novamente.');
      setSearchedPokemon(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (mode === 'add') {
        if (!searchedPokemon) return;
        
        const payload: CreatePokemonDto = {
          name: searchedPokemon.name!,
          type: searchedPokemon.type!,
          hp: hp,
          level: level,
          pokedexNumber: searchedPokemon.pokedexNumber!,
          imageUrl: searchedPokemon.imageUrl
        };

        const newPokemon = await pokemonService.create(payload);
        onSuccess(newPokemon, 'add');
      } else if (mode === 'edit' && initialData) {
        const payload: UpdatePokemonDto = {
          level: level,
          hp: hp
        };
        const updatedPokemon = await pokemonService.update(initialData.id, payload);
        onSuccess(updatedPokemon, 'edit');
      }
      
      onClose();
    } catch (err) {
      console.error('Submit failed', err);
      setError('Ocorreu um erro ao salvar o Pokémon.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const isFormValid = mode === 'add' ? !!searchedPokemon : true;

  const displayPokemon = mode === 'edit' ? initialData : searchedPokemon;

  const formattedId = displayPokemon?.pokedexNumber 
    ? `#${displayPokemon.pokedexNumber.toString().padStart(3, '0')}` 
    : '';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between p-6 border-b border-zinc-900 bg-zinc-900/50">
          <h2 className="text-xl font-bold text-white">
            {mode === 'add' ? 'Capturar Novo Pokémon' : 'Editar Pokémon'}
          </h2>
          <button 
            onClick={onClose}
            className="text-zinc-500 hover:text-white hover:bg-zinc-800 p-2 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-950/30 border border-red-900/50 rounded-xl text-red-500 text-sm">
              {error}
            </div>
          )}

          {mode === 'add' && !searchedPokemon && (
            <form onSubmit={handleSearch} className="mb-6">
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Qual Pokémon você quer procurar?
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ex: Pikachu, Charizard, Bulbasaur..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-11 pr-4 text-white placeholder-zinc-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                  disabled={isSearching}
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
                  {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                </div>
              </div>
              <button
                type="submit"
                disabled={isSearching || !searchQuery.trim()}
                className="w-full mt-3 bg-zinc-100 text-zinc-950 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed px-4 py-3 rounded-xl font-bold transition-colors"
              >
                Procurar na Pokédex Central
              </button>
            </form>
          )}

          {displayPokemon && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              <div className="bg-zinc-900 rounded-2xl p-4 flex items-center gap-4 border border-zinc-800 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-zinc-800 to-transparent opacity-50 z-0"></div>
                 
                 <div className="relative w-24 h-24 shrink-0 bg-zinc-950 rounded-xl flex items-center justify-center shadow-inner border border-zinc-800 z-10">
                    {displayPokemon.imageUrl ? (
                      <Image 
                        src={displayPokemon.imageUrl} 
                        alt={displayPokemon.name || 'Pokemon'} 
                        fill 
                        className="object-contain p-2 hover:scale-110 transition-transform cursor-pointer" 
                      />
                    ) : (
                      <span className="text-zinc-600 text-xs text-center">Sem foto</span>
                    )}
                 </div>

                 <div className="flex-1 z-10">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="text-lg font-bold text-white capitalize line-clamp-1">{displayPokemon.name}</h3>
                      <span className="text-xs font-mono font-bold text-zinc-500 shrink-0">{formattedId}</span>
                    </div>
                    <div className="inline-block px-2.5 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-[10px] font-bold text-zinc-300 uppercase tracking-widest mb-2">
                       {displayPokemon.type}
                    </div>
                    <div className="flex gap-4 text-xs font-medium">
                       <div className="text-zinc-400">
                         BASE HP <span className="text-white block mt-0.5">{displayPokemon.hp}</span>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium text-zinc-400 mb-1.5">Nível de Captura (Lvl)</label>
                   <input
                     type="number"
                     min="1"
                     max="100"
                     value={level}
                     onChange={(e) => setLevel(Number(e.target.value))}
                     className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-red-500 transition-colors"
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-zinc-400 mb-1.5">HP Atual (Custom)</label>
                   <input
                     type="number"
                     min="1"
                     max="999"
                     value={hp}
                     onChange={(e) => setHp(Number(e.target.value))}
                     className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-red-500 transition-colors"
                   />
                 </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-zinc-900">
                {mode === 'add' && (
                  <button
                    onClick={() => setSearchedPokemon(null)}
                    disabled={isLoading}
                    className="flex-1 px-4 py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-xl font-semibold transition-colors disabled:opacity-50"
                  >
                    Trocar
                  </button>
                )}
                <button
                  onClick={handleSubmit}
                  disabled={isLoading || !isFormValid}
                  className={`${mode === 'add' ? 'flex-[2]' : 'w-full'} flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold transition-colors disabled:opacity-50`}
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : mode === 'add' ? 'Salvar Captura' : 'Salvar Alterações'}
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
