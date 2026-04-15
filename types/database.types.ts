// This is a placeholder for Supabase types
export type Database = {
  public: {
    Tables: {
      messages: {
        Row: {
          id: string
          created_at: string
          name: string
          email: string
          subject: string | null
          message: string
          is_read: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          email: string
          subject?: string | null
          message: string
          is_read?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          email?: string
          subject?: string | null
          message?: string
          is_read?: boolean
        }
      }
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']