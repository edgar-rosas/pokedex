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
