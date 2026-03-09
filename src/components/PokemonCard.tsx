import React from 'react';
import { Pokemon } from '../types/pokemon';
import { Edit2, Trash2 } from 'lucide-react';
import Image from 'next/image';

interface PokemonCardProps {
  pokemon: Pokemon;
  currentUserId?: number;
  onEdit?: (pokemon: Pokemon) => void;
  onDelete?: (pokemon: Pokemon) => void;
}

export const PokemonCard: React.FC<PokemonCardProps> = ({ 
  pokemon, 
  currentUserId,
  onEdit,
  onDelete
}) => {
  const isOwner = currentUserId !== undefined && pokemon.userId === currentUserId;

  // Format ID to 3 digits (e.g., #025)
  const formattedId = `#${pokemon.pokedexNumber.toString().padStart(3, '0')}`;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-all duration-300 group shadow-sm hover:shadow-lg">
      <div className="relative h-48 bg-zinc-800 flex items-center justify-center p-6">
        {/* Type Badge */}
        <div className="absolute top-3 left-3 px-3 py-1 bg-zinc-900/80 backdrop-blur-md rounded-full text-xs font-semibold text-zinc-300 border border-zinc-700/50 uppercase tracking-wider">
          {pokemon.type}
        </div>
        
        {/* Pokedex Number */}
        <div className="absolute top-3 right-3 text-sm font-bold text-zinc-500">
          {formattedId}
        </div>

        {/* Pokemon Image */}
        <div className="relative w-full h-full drop-shadow-2xl group-hover:scale-110 transition-transform duration-300">
          {pokemon.imageUrl ? (
            <Image 
              src={pokemon.imageUrl} 
              alt={pokemon.name}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-600 font-medium">
              Sem Imagem
            </div>
          )}
        </div>
      </div>

      <div className="p-5">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-zinc-100 capitalize mb-1">{pokemon.name}</h3>
          <div className="flex items-center gap-4 text-sm text-zinc-400">
            <span>Nvl {pokemon.level}</span>
            <span className="w-1 h-1 bg-zinc-700 rounded-full"></span>
            <span>HP {pokemon.hp}</span>
          </div>
        </div>

        {/* Action Buttons - Conditionally Rendered based on Ownership */}
        {isOwner ? (
          <div className="flex items-center gap-2 pt-4 border-t border-zinc-800">
            <button 
              onClick={() => onEdit?.(pokemon)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors text-sm font-semibold border border-zinc-700/50"
            >
              <Edit2 className="w-4 h-4" />
              Editar
            </button>
            <button 
              onClick={() => onDelete?.(pokemon)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-red-950/30 hover:bg-red-900/50 text-red-500 transition-colors text-sm font-semibold border border-red-900/20"
            >
              <Trash2 className="w-4 h-4" />
              Excluir
            </button>
          </div>
        ) : (
          <div className="pt-4 border-t border-zinc-800 text-center">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
              Capturado por Outro Treinador
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
