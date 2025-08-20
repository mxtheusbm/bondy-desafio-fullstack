import { GraphQLResolveInfo } from 'graphql'
import { connection } from '../../../memoryDB/connection'
import { User } from '../../../models/User'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { UserResponse } from 'src/types'

type LoginArgs = {
  email: string
  password: string
}

export const login = async (
  parent: any,
  args: LoginArgs,
  context: any,
  info: GraphQLResolveInfo
): Promise<{ token: string; user: UserResponse }> => {
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

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    )

    return {
      token,
      user: {
        company: user.company,
        email: user.email,
        name: user.name,
        password: user.password,
      },
    }
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Login failed')
  }
}
