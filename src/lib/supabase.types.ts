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
      post: {
        Row: {
          author_id: string | null;
          created_at: string;
          deso_uid: string | null;
          id: string;
          text: string | null;
        };
        Insert: {
          author_id?: string | null;
          created_at?: string;
          deso_uid?: string | null;
          id: string;
          text?: string | null;
        };
        Update: {
          author_id?: string | null;
          created_at?: string;
          deso_uid?: string | null;
          id?: string;
          text?: string | null;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          content_moderation: string | null;
          id: string;
          interests: string | null;
          deso_key: string | null;
          updated_at: string | null;
          community_list: string[] | null; // Assuming this stores community IDs
        };
        Insert: {
          content_moderation?: string | null;
          id: string;
          interests?: string | null;
          deso_key: string | null;
          community_list: string[] | null; // Assuming this stores community IDs
          updated_at?: string | null;
        };
        Update: {
          content_moderation?: string | null;
          id?: string;
          interests?: string | null;
          deso_key: string | null;
          updated_at?: string | null;
          community_list: string[] | null; // Assuming this stores community IDs
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      communities: {
        // New table for communities
        Row: {
          id: string;
          name: string;
          profile_pic: string | null;
          banner: string | null;
          description: string | null;
          requirements_to_join: Json | null; // Reusing the Json type for flexibility
          owner_id: string; // Link to a user who is the owner/creator
        };
        Insert: {
          id: string;
          name: string;
          profile_pic?: string | null;
          banner?: string | null;
          description?: string | null;
          requirements_to_join?: Json | null;
          owner_id: string;
        };
        Update: {
          id?: string;
          name?: string;
          profile_pic?: string | null;
          banner?: string | null;
          description?: string | null;
          requirements_to_join?: Json | null;
          owner_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "communities_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false; // A user can own multiple communities
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
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
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never;
