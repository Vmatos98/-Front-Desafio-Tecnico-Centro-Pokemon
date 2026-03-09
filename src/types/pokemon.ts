export interface Pokemon {
  id: number;
  name: string;
  type: string;
  level: number;
  hp: number;
  pokedexNumber: number;
  imageUrl?: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePokemonDto {
  name: string;
  type: string;
  level: number;
  hp: number;
  pokedexNumber: number;
  imageUrl?: string;
}

export type UpdatePokemonDto = Partial<CreatePokemonDto>;

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
  };
}
