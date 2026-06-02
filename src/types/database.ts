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
      patient_inputs: {
        Row: {
          patient_id: string;
          facility_name: string;
          facility_code: string | null;
          ward_name: string | null;
          admission_date: string;
          discharge_date: string;
          patient_name: string;
          age: number;
          gender: string;
          hospital_number: string;
          nhis_number: string | null;
          diagnosis: string;
          treatment_given: string;
          procedures_performed: string[] | null;
          medications: Json;
          follow_up_instructions: string | null;
          additional_notes: string | null;
          language_requested: string | null;
          discharged_by: string;
          clinician_license_no: string | null;
          created_at: string;
        };
        Insert: {
          patient_id: string;
          facility_name: string;
          facility_code?: string | null;
          ward_name?: string | null;
          admission_date: string;
          discharge_date: string;
          patient_name: string;
          age: number;
          gender: string;
          hospital_number: string;
          nhis_number?: string | null;
          diagnosis: string;
          treatment_given: string;
          procedures_performed?: string[] | null;
          medications: Json;
          follow_up_instructions?: string | null;
          additional_notes?: string | null;
          language_requested?: string | null;
          discharged_by: string;
          clinician_license_no?: string | null;
          created_at?: string;
        };
        Update: {
          patient_id?: string;
          facility_name?: string;
          facility_code?: string | null;
          ward_name?: string | null;
          admission_date?: string;
          discharge_date?: string;
          patient_name?: string;
          age?: number;
          gender?: string;
          hospital_number?: string;
          nhis_number?: string | null;
          diagnosis?: string;
          treatment_given?: string;
          procedures_performed?: string[] | null;
          medications?: Json;
          follow_up_instructions?: string | null;
          additional_notes?: string | null;
          language_requested?: string | null;
          discharged_by?: string;
          clinician_license_no?: string | null;
          created_at?: string;
        };
      };
      discharge_records: {
        Row: {
          record_id: string;
          patient_input_id: string;
          generated_at: string;
          generated_by_user_id: string;
          prompt_version: string;
          model_version: string;
          clinical_summary: string;
          patient_friendly_output: string;
          translated_output: string | null;
          translation_language: string | null;
          translation_confidence: string | null;
          missing_fields_log: string[] | null;
          flagged_issues: string[] | null;
          status: string;
          last_edited_at: string | null;
          last_edited_by_user_id: string | null;
          created_at: string;
        };
        Insert: {
          record_id: string;
          patient_input_id: string;
          generated_at: string;
          generated_by_user_id: string;
          prompt_version: string;
          model_version: string;
          clinical_summary: string;
          patient_friendly_output: string;
          translated_output?: string | null;
          translation_language?: string | null;
          translation_confidence?: string | null;
          missing_fields_log?: string[] | null;
          flagged_issues?: string[] | null;
          status: string;
          last_edited_at?: string | null;
          last_edited_by_user_id?: string | null;
          created_at?: string;
        };
        Update: {
          record_id?: string;
          patient_input_id?: string;
          generated_at?: string;
          generated_by_user_id?: string;
          prompt_version?: string;
          model_version?: string;
          clinical_summary?: string;
          patient_friendly_output?: string;
          translated_output?: string | null;
          translation_language?: string | null;
          translation_confidence?: string | null;
          missing_fields_log?: string[] | null;
          flagged_issues?: string[] | null;
          status?: string;
          last_edited_at?: string | null;
          last_edited_by_user_id?: string | null;
          created_at?: string;
        };
      };
      audit_logs: {
        Row: {
          log_id: string;
          record_id: string;
          user_id: string;
          user_role: string;
          action: string;
          timestamp: string;
          ip_address: string | null;
          changes_diff: Json | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          log_id?: string;
          record_id: string;
          user_id: string;
          user_role: string;
          action: string;
          timestamp?: string;
          ip_address?: string | null;
          changes_diff?: Json | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          log_id?: string;
          record_id?: string;
          user_id?: string;
          user_role?: string;
          action?: string;
          timestamp?: string;
          ip_address?: string | null;
          changes_diff?: Json | null;
          notes?: string | null;
          created_at?: string;
        };
      };
      translation_requests: {
        Row: {
          request_id: string;
          record_id: string;
          source_text: string;
          target_language: string;
          output_text: string | null;
          confidence: string | null;
          fallback_used: boolean;
          requested_at: string;
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          request_id: string;
          record_id: string;
          source_text: string;
          target_language: string;
          output_text?: string | null;
          confidence?: string | null;
          fallback_used: boolean;
          requested_at: string;
          completed_at?: string | null;
          created_at?: string;
        };
        Update: {
          request_id?: string;
          record_id?: string;
          source_text?: string;
          target_language?: string;
          output_text?: string | null;
          confidence?: string | null;
          fallback_used?: boolean;
          requested_at?: string;
          completed_at?: string | null;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      gender_type: "Male" | "Female" | "Other";
      user_role: "doctor" | "nurse" | "admin";
      record_status: "draft" | "finalised" | "archived";
      audit_action:
        | "generate"
        | "edit"
        | "view"
        | "finalise"
        | "archive"
        | "print"
        | "export";
      target_language: "en" | "ha" | "yo" | "ig";
      translation_confidence_level: "high" | "low" | "failed";
    };
  };
}
