import { GraphQLResolveInfo } from 'graphql'
import { connection } from '../../../memoryDB/connection'
import { User } from 'src/models/User'
import jwt from 'jsonwebtoken'
import { UserResponse } from 'src/types'

interface JWTPayload {
  email: string
}

export const me = async (
  parent: any,
  args: any,
  context: any,
  info: GraphQLResolveInfo
): Promise<UserResponse> => {
  try {
    await connection()

    const token = context.token

    if (!token) {
      throw new Error('Authentication required')
    }

    let decoded: JWTPayload
    try {
      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'your-secret-key'
      ) as JWTPayload
    } catch (jwtError) {
      throw new Error('Invalid or expired token')
    }

    const user = await User.findOne({
      email: decoded.email.trim().toLowerCase(),
    })

    if (!user) {
      throw new Error('User not found')
    }

    return {
      email: user.email,
      name: user.name,
      company: user.company,
      password: user.password,
    }
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to fetch user info'
    )
  }
}
