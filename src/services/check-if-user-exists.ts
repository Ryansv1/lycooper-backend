import { prismaConnection } from "../lib/prisma";
import bcrypt from "bcrypt";

export async function checkIfUserExists(
  userEmail: string,
  userPassword: string
) {
  try {
    const existingUser = await prismaConnection.users.findUnique({
      where: {
        email: userEmail,
      },
    });

    if (!existingUser) {
      return null; // Usuário não encontrado
    } else if (existingUser.password === null) {
      return 401; // Senha não configurada, exigindo registro
    } else {
      const isPasswordCorrect = await bcrypt.compare(
        userPassword,
        existingUser.password
      );
      return isPasswordCorrect; // Retorna true se a senha estiver correta, false caso contrário
    }
  } catch (error) {
    console.error("Error while checking user existence:", error);
    throw new Error("Failed to check user existence");
  }
}
