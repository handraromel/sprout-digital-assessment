/**
 * User Seed Data
 * Initial administrator user for the system
 */

export interface UserSeedData {
  email: string;
  username: string;
  password: string;
  fullname?: string;
  isActive: boolean;
}

export const userSeedData: UserSeedData[] = [
  {
    email: "administrator@mail.id",
    username: "administrator@mail.id",
    password: "Superuser@12345",
    fullname: "System Administrator",
    isActive: true,
  },
];
