import bcrypt from 'bcrypt';

export async function hashString(input: string, saltRounds: number = 10): Promise<string> {
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedString = await bcrypt.hash(input, salt);

  return hashedString;
}

export async function verifyHash(input: string, hash: string): Promise<boolean> {
  const isMatch = await bcrypt.compare(input, hash);

  return isMatch;
}
