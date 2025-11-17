export type Role = 'ADMIN' | 'COLLABORATOR' | 'VIEWER'

export type Collaborator = {
  _id: string
  email: string
  name: string
  avatarUrl?: string
  role: Role
}

export type AppUser = {
  _id: string
  email: string
  name: string
  avatarUrl?: string
  role: Role
}
