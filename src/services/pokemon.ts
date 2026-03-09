import { api } from './api';
import { Pokemon, CreatePokemonDto, UpdatePokemonDto, PaginatedResponse } from '../types/pokemon';

export const pokemonService = {
  searchExternal: async (query: string): Promise<CreatePokemonDto> => {
    const { data } = await api.get<CreatePokemonDto>(`/pokemon/search/${query}`);
    return data;
  },

  create: async (pokemon: CreatePokemonDto): Promise<Pokemon> => {
    const { data } = await api.post('/pokemon', pokemon);
    return data;
  },

  findAllMine: async (page: number = 1): Promise<PaginatedResponse<Pokemon>> => {
    const { data } = await api.get<PaginatedResponse<Pokemon>>(`/pokemon/mine?page=${page}`);
    return data;
  },

  findAllOthers: async (page: number = 1): Promise<PaginatedResponse<Pokemon>> => {
    const { data } = await api.get<PaginatedResponse<Pokemon>>(`/pokemon/others?page=${page}`);
    return data;
  },

  getOne: async (id: number): Promise<Pokemon> => {
    const { data } = await api.get(`/pokemon/${id}`);
    return data;
  },

  update: async (id: number, pokemon: UpdatePokemonDto): Promise<Pokemon> => {
    const { data } = await api.patch(`/pokemon/${id}`, pokemon);
    return data;
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/pokemon/${id}`);
  },
};
