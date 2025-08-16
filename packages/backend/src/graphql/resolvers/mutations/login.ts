import { GraphQLResolveInfo } from 'graphql'
import { connection } from '../../../memoryDB/connection'
import { User } from '../../../models/User'
import bcrypt from 'bcrypt'

type LoginArgs = {
  email: string
  password: string
}

export const login = async (
  parent: any,
  args: LoginArgs,
  context: any,
  info: GraphQLResolveInfo
) => {
  const { email, password } = args

  try {
    await connection()

    const user = await User.findOne({ email: email.trim().toLowerCase() })

    if (!user) {
      throw new Error('User not found')
    }

    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      throw new Error('Invalid credentials')
    }

    return {
      name: user.name,
      email: user.email,
      company: user.company || null,
      password: user.password, // Note: Returning password is not recommended in production
    }
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Login failed')
  }
}
