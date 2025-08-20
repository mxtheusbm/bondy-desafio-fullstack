export interface UserResponse {
  email: string
  name: string
  company?: string
  password: string // Note: Returning password is not recommended in production
}
