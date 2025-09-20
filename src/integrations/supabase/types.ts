export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      checkup_responses: {
        Row: {
          checkup_date: string
          created_at: string
          id: string
          patient_id: string
          prediction_result: string | null
          responses: Json
          risk_score: number
          triggered_alert: boolean
          updated_at: string
        }
        Insert: {
          checkup_date: string
          created_at?: string
          id?: string
          patient_id: string
          prediction_result?: string | null
          responses: Json
          risk_score: number
          triggered_alert?: boolean
          updated_at?: string
        }
        Update: {
          checkup_date?: string
          created_at?: string
          id?: string
          patient_id?: string
          prediction_result?: string | null
          responses?: Json
          risk_score?: number
          triggered_alert?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "checkup_responses_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patient_details"
            referencedColumns: ["id"]
          },
        ]
      }
      hospital_data: {
        Row: {
          a1c_test: string
          age: number
          created_at: string
          diabetes_medication: string
          emergency_visits: number | null
          glucose_test: string
          id: string
          length_of_stay: number | null
          num_lab_procedures: number | null
          num_medications: number | null
          num_other_procedures: number | null
          outpatient_visits: number | null
          previous_inpatient_stays: number | null
          profile_id: string
          updated_at: string
        }
        Insert: {
          a1c_test: string
          age: number
          created_at?: string
          diabetes_medication: string
          emergency_visits?: number | null
          glucose_test: string
          id?: string
          length_of_stay?: number | null
          num_lab_procedures?: number | null
          num_medications?: number | null
          num_other_procedures?: number | null
          outpatient_visits?: number | null
          previous_inpatient_stays?: number | null
          profile_id: string
          updated_at?: string
        }
        Update: {
          a1c_test?: string
          age?: number
          created_at?: string
          diabetes_medication?: string
          emergency_visits?: number | null
          glucose_test?: string
          id?: string
          length_of_stay?: number | null
          num_lab_procedures?: number | null
          num_medications?: number | null
          num_other_procedures?: number | null
          outpatient_visits?: number | null
          previous_inpatient_stays?: number | null
          profile_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      hospitals: {
        Row: {
          address: string | null
          city: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
          state: string | null
          updated_at: string
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          state?: string | null
          updated_at?: string
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          state?: string | null
          updated_at?: string
          zip_code?: string | null
        }
        Relationships: []
      }
      medical_history: {
        Row: {
          admission_date: string
          admission_type: string | null
          attending_physician: string | null
          created_at: string
          discharge_date: string | null
          discharge_disposition: string | null
          discharge_instructions: string | null
          discharge_summary: string | null
          follow_up_date: string | null
          follow_up_required: boolean | null
          hospital_id: string | null
          id: string
          medications_prescribed: string[] | null
          notes: string | null
          patient_id: string
          primary_diagnosis: string
          procedures_performed: string[] | null
          readmission_risk_score: number | null
          risk_factors: string[] | null
          secondary_diagnoses: string[] | null
          updated_at: string
        }
        Insert: {
          admission_date: string
          admission_type?: string | null
          attending_physician?: string | null
          created_at?: string
          discharge_date?: string | null
          discharge_disposition?: string | null
          discharge_instructions?: string | null
          discharge_summary?: string | null
          follow_up_date?: string | null
          follow_up_required?: boolean | null
          hospital_id?: string | null
          id?: string
          medications_prescribed?: string[] | null
          notes?: string | null
          patient_id: string
          primary_diagnosis: string
          procedures_performed?: string[] | null
          readmission_risk_score?: number | null
          risk_factors?: string[] | null
          secondary_diagnoses?: string[] | null
          updated_at?: string
        }
        Update: {
          admission_date?: string
          admission_type?: string | null
          attending_physician?: string | null
          created_at?: string
          discharge_date?: string | null
          discharge_disposition?: string | null
          discharge_instructions?: string | null
          discharge_summary?: string | null
          follow_up_date?: string | null
          follow_up_required?: boolean | null
          hospital_id?: string | null
          id?: string
          medications_prescribed?: string[] | null
          notes?: string | null
          patient_id?: string
          primary_diagnosis?: string
          procedures_performed?: string[] | null
          readmission_risk_score?: number | null
          risk_factors?: string[] | null
          secondary_diagnoses?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "medical_history_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medical_history_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patient_details"
            referencedColumns: ["id"]
          },
        ]
      }
      medications: {
        Row: {
          created_at: string
          dosage: string | null
          frequency: string | null
          id: string
          name: string
          patient_id: string
          purpose: string | null
          taken: boolean[] | null
          timing: string[] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          dosage?: string | null
          frequency?: string | null
          id?: string
          name: string
          patient_id: string
          purpose?: string | null
          taken?: boolean[] | null
          timing?: string[] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          dosage?: string | null
          frequency?: string | null
          id?: string
          name?: string
          patient_id?: string
          purpose?: string | null
          taken?: boolean[] | null
          timing?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "medications_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patient_details"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_details: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          allergies: string[] | null
          blood_type: Database["public"]["Enums"]["blood_type"] | null
          city: string | null
          country: string | null
          created_at: string
          date_of_birth: string
          email: string | null
          emergency_contact_email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          emergency_contact_relationship: string | null
          first_name: string
          gender: Database["public"]["Enums"]["gender"] | null
          height_cm: number | null
          hospital_id: string | null
          hospital_patient_id: string | null
          id: string
          insurance_group_number: string | null
          insurance_policy_number: string | null
          insurance_provider: string | null
          last_name: string
          marital_status: Database["public"]["Enums"]["marital_status"] | null
          medical_conditions: string[] | null
          notes: string | null
          occupation: string | null
          phone: string | null
          preferred_language: string | null
          primary_physician: string | null
          profile_id: string
          state: string | null
          updated_at: string
          weight_kg: number | null
          zip_code: string | null
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          allergies?: string[] | null
          blood_type?: Database["public"]["Enums"]["blood_type"] | null
          city?: string | null
          country?: string | null
          created_at?: string
          date_of_birth: string
          email?: string | null
          emergency_contact_email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          first_name: string
          gender?: Database["public"]["Enums"]["gender"] | null
          height_cm?: number | null
          hospital_id?: string | null
          hospital_patient_id?: string | null
          id?: string
          insurance_group_number?: string | null
          insurance_policy_number?: string | null
          insurance_provider?: string | null
          last_name: string
          marital_status?: Database["public"]["Enums"]["marital_status"] | null
          medical_conditions?: string[] | null
          notes?: string | null
          occupation?: string | null
          phone?: string | null
          preferred_language?: string | null
          primary_physician?: string | null
          profile_id: string
          state?: string | null
          updated_at?: string
          weight_kg?: number | null
          zip_code?: string | null
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          allergies?: string[] | null
          blood_type?: Database["public"]["Enums"]["blood_type"] | null
          city?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string
          email?: string | null
          emergency_contact_email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          first_name?: string
          gender?: Database["public"]["Enums"]["gender"] | null
          height_cm?: number | null
          hospital_id?: string | null
          hospital_patient_id?: string | null
          id?: string
          insurance_group_number?: string | null
          insurance_policy_number?: string | null
          insurance_provider?: string | null
          last_name?: string
          marital_status?: Database["public"]["Enums"]["marital_status"] | null
          medical_conditions?: string[] | null
          notes?: string | null
          occupation?: string | null
          phone?: string | null
          preferred_language?: string | null
          primary_physician?: string | null
          profile_id?: string
          state?: string | null
          updated_at?: string
          weight_kg?: number | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_details_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_details_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      prediction_results: {
        Row: {
          confidence: string | null
          created_at: string
          hospital_data_id: string | null
          id: string
          model_available: boolean
          prediction: string
          profile_id: string
          risk_factors: Json | null
        }
        Insert: {
          confidence?: string | null
          created_at?: string
          hospital_data_id?: string | null
          id?: string
          model_available?: boolean
          prediction: string
          profile_id: string
          risk_factors?: Json | null
        }
        Update: {
          confidence?: string | null
          created_at?: string
          hospital_data_id?: string | null
          id?: string
          model_available?: boolean
          prediction?: string
          profile_id?: string
          risk_factors?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "prediction_results_hospital_data_id_fkey"
            columns: ["hospital_data_id"]
            isOneToOne: false
            referencedRelation: "hospital_data"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          patient_id: string | null
          role: Database["public"]["Enums"]["user_role"]
          staff_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id?: string
          patient_id?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          staff_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          patient_id?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          staff_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      staff_patient_assignments: {
        Row: {
          assigned_date: string
          hospital_id: string
          id: string
          is_active: boolean | null
          patient_profile_id: string
          role_type: string | null
          staff_profile_id: string
        }
        Insert: {
          assigned_date?: string
          hospital_id: string
          id?: string
          is_active?: boolean | null
          patient_profile_id: string
          role_type?: string | null
          staff_profile_id: string
        }
        Update: {
          assigned_date?: string
          hospital_id?: string
          id?: string
          is_active?: boolean | null
          patient_profile_id?: string
          role_type?: string | null
          staff_profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_patient_assignments_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_patient_assignments_patient_profile_id_fkey"
            columns: ["patient_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_patient_assignments_staff_profile_id_fkey"
            columns: ["staff_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      blood_type: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-"
      gender: "male" | "female" | "other" | "prefer_not_to_say"
      marital_status:
        | "single"
        | "married"
        | "divorced"
        | "widowed"
        | "separated"
        | "other"
      user_role: "patient" | "hospital_staff"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      blood_type: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      gender: ["male", "female", "other", "prefer_not_to_say"],
      marital_status: [
        "single",
        "married",
        "divorced",
        "widowed",
        "separated",
        "other",
      ],
      user_role: ["patient", "hospital_staff"],
    },
  },
} as const
