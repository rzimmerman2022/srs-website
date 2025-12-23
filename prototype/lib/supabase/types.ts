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
