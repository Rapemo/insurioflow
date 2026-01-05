export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      benefits: {
        Row: {
          id: string
          name: string
          type: 'medical' | 'dental' | 'vision' | 'life' | 'disability' | 'wellness'
          status: 'active' | 'inactive'
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: 'medical' | 'dental' | 'vision' | 'life' | 'disability' | 'wellness'
          status?: 'active' | 'inactive'
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: 'medical' | 'dental' | 'vision' | 'life' | 'disability' | 'wellness'
          status?: 'active' | 'inactive'
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      // Add other tables here as needed
    }
  }
}
