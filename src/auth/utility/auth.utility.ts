import * as bcrypt from 'bcryptjs';

export class BCRYPTUTILITY {
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 10; // Adjust the salt rounds as needed
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  }

  static async comparePasswords(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}
