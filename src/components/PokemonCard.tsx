import React from 'react';
import { Pokemon } from '../types/pokemon';
import { Edit2, Trash2 } from 'lucide-react';
import Image from 'next/image';

interface PokemonCardProps {
  pokemon: Pokemon;
  currentUserId?: number;
  onEdit?: (pokemon: Pokemon) => void;
  onDelete?: (pokemon: Pokemon) => void;
  size?: 'normal' | 'small';
}

export const PokemonCard: React.FC<PokemonCardProps> = ({ 
  pokemon, 
  currentUserId,
  onEdit,
  onDelete,
  size = 'normal'
}) => {
  const isOwner = currentUserId !== undefined && pokemon.userId === currentUserId;

  const formattedId = `#${pokemon.pokedexNumber.toString().padStart(3, '0')}`;

  const isSmall = size === 'small';

  return (
    <div className={`bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-all duration-300 group shadow-sm hover:shadow-lg flex flex-col ${isSmall ? 'h-full' : ''}`}>
      <div className={`relative bg-zinc-800 flex items-center justify-center p-6 ${isSmall ? 'h-32' : 'h-48'}`}>
        <div className="absolute top-2 left-2 right-2 flex justify-between items-center gap-1 z-10">
          <div 
            className={`px-2 py-0.5 bg-zinc-900/80 backdrop-blur-md rounded-full ${isSmall ? 'text-[9px]' : 'text-xs'} font-semibold text-zinc-300 border border-zinc-700/50 uppercase tracking-wider truncate shrink`}
            title={pokemon.type}
          >
            {pokemon.type}
          </div>
          <div className={`${isSmall ? 'text-xs' : 'text-sm'} font-bold text-zinc-500 shrink-0 bg-zinc-900/60 px-1.5 py-0.5 rounded-md backdrop-blur-sm`}>
            {formattedId}
          </div>
        </div>

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

      <div className={`p-4 flex flex-col flex-grow justify-between ${isSmall ? 'p-4' : 'p-5'}`}>
        <div>
          <h3 className={`${isSmall ? 'text-lg' : 'text-xl'} font-bold text-zinc-100 capitalize mb-1 line-clamp-1`}>{pokemon.name}</h3>
          <div className="flex items-center gap-2 lg:gap-4 text-xs lg:text-sm text-zinc-400">
            <span>Nvl {pokemon.level}</span>
            <span className="w-1 h-1 bg-zinc-700 rounded-full"></span>
            <span>HP {pokemon.hp}</span>
          </div>
        </div>

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
