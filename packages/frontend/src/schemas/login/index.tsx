import z from "zod";

export const LoginFormSchema = z.object({
  email: z.string({ required_error: "Campo obrigatório" }).email({ message: "Email é inválido" }),
  password: z
    .string()
    .min(6, { message: "Senha deve conter no mínimo 6 caracteres" }),
});
