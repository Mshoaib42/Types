import bcrypt from "bcrypt";

/**
 * Hash a plaintext password.
 * @param password - The plaintext password to hash.
 * @returns A promise that resolves to the hashed password.
 */
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

/**
 * Compare a plaintext password with a hashed password.
 * @param plaintextPassword - The plaintext password provided by the user.
 * @param hashedPassword - The hashed password stored in the database.
 * @returns A promise that resolves to true if the passwords match, otherwise false.
 */
export const comparePassword = async (
  plaintextPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(plaintextPassword, hashedPassword);
};
