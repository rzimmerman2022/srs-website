export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      questionnaire_responses: {
        Row: {
          id: string;
          client_id: string;
          questionnaire_id: string;
          answers: Json;
          current_question_index: number;
          current_module_index: number;
          points: number;
          streak: number;
          combo: number;
          shown_milestones: number[];
          completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          questionnaire_id: string;
          answers?: Json;
          current_question_index?: number;
          current_module_index?: number;
          points?: number;
          streak?: number;
          combo?: number;
          shown_milestones?: number[];
          completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          client_id?: string;
          questionnaire_id?: string;
          answers?: Json;
          current_question_index?: number;
          current_module_index?: number;
          points?: number;
          streak?: number;
          combo?: number;
          shown_milestones?: number[];
          completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      response_history: {
        Row: {
          id: string;
          response_id: string;
          snapshot: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          response_id: string;
          snapshot: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          response_id?: string;
          snapshot?: Json;
          created_at?: string;
        };
      };
      questionnaire_access_tokens: {
        Row: {
          id: string;
          client_id: string;
          questionnaire_id: string;
          token: string;
          created_at: string;
          expires_at: string;
          accessed_at: string | null;
          access_count: number;
          revoked: boolean;
          metadata: Json;
        };
        Insert: {
          id?: string;
          client_id: string;
          questionnaire_id: string;
          token: string;
          created_at?: string;
          expires_at: string;
          accessed_at?: string | null;
          access_count?: number;
          revoked?: boolean;
          metadata?: Json;
        };
        Update: {
          id?: string;
          client_id?: string;
          questionnaire_id?: string;
          token?: string;
          created_at?: string;
          expires_at?: string;
          accessed_at?: string | null;
          access_count?: number;
          revoked?: boolean;
          metadata?: Json;
        };
      };
      admin_users: {
        Row: {
          id: string;
          user_id: string;
          email: string;
          full_name: string;
          role: 'super_admin' | 'admin' | 'viewer';
          active: boolean;
          last_login_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          email: string;
          full_name: string;
          role?: 'super_admin' | 'admin' | 'viewer';
          active?: boolean;
          last_login_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          email?: string;
          full_name?: string;
          role?: 'super_admin' | 'admin' | 'viewer';
          active?: boolean;
          last_login_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      admin_settings: {
        Row: {
          id: string;
          setting_key: string;
          setting_value: Json;
          category: string;
          description: string | null;
          created_at: string;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          id?: string;
          setting_key: string;
          setting_value: Json;
          category: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          id?: string;
          setting_key?: string;
          setting_value?: Json;
          category?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// Convenience types
export type QuestionnaireResponse = Database['public']['Tables']['questionnaire_responses']['Row'];
export type QuestionnaireResponseInsert = Database['public']['Tables']['questionnaire_responses']['Insert'];
export type QuestionnaireResponseUpdate = Database['public']['Tables']['questionnaire_responses']['Update'];
export type ResponseHistory = Database['public']['Tables']['response_history']['Row'];

// Admin types
export type AdminUser = Database['public']['Tables']['admin_users']['Row'];
export type AdminUserInsert = Database['public']['Tables']['admin_users']['Insert'];
export type AdminUserUpdate = Database['public']['Tables']['admin_users']['Update'];

// Token types
export type QuestionnaireAccessToken = Database['public']['Tables']['questionnaire_access_tokens']['Row'];
export type QuestionnaireAccessTokenInsert = Database['public']['Tables']['questionnaire_access_tokens']['Insert'];
export type QuestionnaireAccessTokenUpdate = Database['public']['Tables']['questionnaire_access_tokens']['Update'];

// Settings types
export type AdminSetting = Database['public']['Tables']['admin_settings']['Row'];
export type AdminSettingInsert = Database['public']['Tables']['admin_settings']['Insert'];
export type AdminSettingUpdate = Database['public']['Tables']['admin_settings']['Update'];
