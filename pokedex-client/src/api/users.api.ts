import { randUserName } from "@ngneat/falso";
import axiosClient from "./axios";
import { AxiosResponse } from "axios";

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

export type FavoriteBodyRequest = {
  pokemonId: number;
  isFavorite: boolean;
};

export const markAsFavorite = async ({
  pokemonId,
  isFavorite,
}: FavoriteBodyRequest) => {
  let res: AxiosResponse<FavoriteResponse>;

  if (isFavorite) {
    res = await axiosClient.post<FavoriteResponse>("/user/favorites", {
      pokemonId,
    });
  } else {
    res = await axiosClient.delete<FavoriteResponse>("/user/favorites", {
      data: {
        pokemonId,
      },
    });
  }

  return res;
};
