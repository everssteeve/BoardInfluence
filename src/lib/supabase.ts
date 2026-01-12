import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Database types (will be auto-generated later with Supabase CLI)
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string;
          company: string | null;
          avatar: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          company?: string | null;
          avatar?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          company?: string | null;
          avatar?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      games: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          year: string;
          editor: string;
          players: string;
          duration: string;
          type: string;
          release_date: string | null;
          source: 'manual' | 'api';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['games']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['games']['Insert']>;
      };
      influencers: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          platform: string;
          url: string;
          notes: string;
          subscribers: number;
          engagement: number;
          quality: number;
          specialties: string[];
          location: string;
          pricing: string;
          pricing_notes: string;
          availability: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['influencers']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['influencers']['Insert']>;
      };
      campaigns: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          game_id: string;
          influencer_ids: string[];
          status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
          budget: number;
          start_date: string;
          end_date: string | null;
          objectives: string;
          deliverables: any; // JSON
          notes: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['campaigns']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['campaigns']['Insert']>;
      };
    };
  };
}
