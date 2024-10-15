import { randUserName } from "@ngneat/falso";
import axiosClient from "./axios";

type UserResponse = {
  user: User;
};

export type User = {
  id: number;
  name: string;
};

export const createUser = async (name?: string): Promise<User> => {
  const createUserRes = await axiosClient.post<UserResponse>("/user", {
    name: name || randUserName(),
  });
  localStorage.setItem("userId", createUserRes.data.user.id.toString());
  return createUserRes.data.user;
};

type FavoriteResponse = {
  message: string;
};

export const markAsFavorite = async (pokemonId: string) => {
  const res = await axiosClient.post<FavoriteResponse>("/user/favorites", {
    pokemonId,
  });

  console.log("res", res.status);
};

export const removeFromFavorites = async (pokemonId: string) => {
  const res = await axiosClient.delete<FavoriteResponse>("/user/favorites", {
    data: {
      pokemonId,
    },
  });

  console.log("res", res.status);
};
