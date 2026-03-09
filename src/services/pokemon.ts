import { api } from './api';
import { Pokemon, CreatePokemonDto, UpdatePokemonDto } from '../types/pokemon';

export const pokemonService = {
  searchExternal: async (query: string): Promise<Record<string, unknown>> => {
    const { data } = await api.get(`/pokemon/search/${query}`);
    return data;
  },

  create: async (pokemon: CreatePokemonDto): Promise<Pokemon> => {
    const { data } = await api.post('/pokemon', pokemon);
    return data;
  },

  getMine: async (): Promise<Pokemon[]> => {
    const { data } = await api.get<Pokemon[]>('/pokemon/mine');
    return data;
  },

  getOthers: async (): Promise<Pokemon[]> => {
    const { data } = await api.get<Pokemon[]>('/pokemon/others');
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
