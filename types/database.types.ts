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

// Additional types for content management

export interface DBTimelineEntry {
  id: string;
  title: string;
  company: string;
  period: string;
  description: string;
  order: number;
  created_at: string;
}

export interface DBSkillCategory {
  id: string;
  name: string;
  order: number;
}

export interface DBTag {
  id: string;
  name: string;
  color: string;
  category_id: string;
}

export interface DBSocialLink {
  id: string;
  platform: string;
  url: string;
  order: number;
}

export interface DBFooter {
  id: string;
  copyright_text: string;
}