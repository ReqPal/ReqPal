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
      catalogs: {
        Row: {
          catalog_id: number
          catalog_name: string | null
          example: boolean | null
          user_id: string | null
        }
        Insert: {
          catalog_id?: number
          catalog_name?: string | null
          example?: boolean | null
          user_id?: string | null
        }
        Update: {
          catalog_id?: number
          catalog_name?: string | null
          example?: boolean | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "catalogs_owner_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      lessons: {
        Row: {
          created_at: string
          description: string
          example: boolean | null
          points: number
          published: boolean
          title: string
          user_id: string
          uuid: string
        }
        Insert: {
          created_at?: string
          description: string
          example?: boolean | null
          points: number
          published?: boolean
          title: string
          user_id: string
          uuid?: string
        }
        Update: {
          created_at?: string
          description?: string
          example?: boolean | null
          points?: number
          published?: boolean
          title?: string
          user_id?: string
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "lessons_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      permissions: {
        Row: {
          description: string | null
          id: number
          name: string
        }
        Insert: {
          description?: string | null
          id?: number
          name: string
        }
        Update: {
          description?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      product_requirements: {
        Row: {
          comment: string | null
          product_id: number | null
          product_requirement_id: number
          qualification: string | null
          requirement_id: number | null
        }
        Insert: {
          comment?: string | null
          product_id?: number | null
          product_requirement_id?: number
          qualification?: string | null
          requirement_id?: number | null
        }
        Update: {
          comment?: string | null
          product_id?: number | null
          product_requirement_id?: number
          qualification?: string | null
          requirement_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "productrequirements_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "productrequirements_requirement_id_fkey"
            columns: ["requirement_id"]
            referencedRelation: "requirements"
            referencedColumns: ["requirement_id"]
          }
        ]
      }
      products: {
        Row: {
          product_id: number
          product_name: string | null
        }
        Insert: {
          product_id?: number
          product_name?: string | null
        }
        Update: {
          product_id?: number
          product_name?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          teacher: string | null
          username: string | null
        }
        Insert: {
          id: string
          teacher?: string | null
          username?: string | null
        }
        Update: {
          id?: string
          teacher?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_teacher_fkey"
            columns: ["teacher"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      questions: {
        Row: {
          hint: string | null
          lesson_uuid: string | null
          options: Json | null
          position: number
          question: string | null
          question_type: string
          solution: Json | null
          uuid: string
        }
        Insert: {
          hint?: string | null
          lesson_uuid?: string | null
          options?: Json | null
          position: number
          question?: string | null
          question_type: string
          solution?: Json | null
          uuid?: string
        }
        Update: {
          hint?: string | null
          lesson_uuid?: string | null
          options?: Json | null
          position?: number
          question?: string | null
          question_type?: string
          solution?: Json | null
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_lessons_uuid_fk"
            columns: ["lesson_uuid"]
            referencedRelation: "lessons"
            referencedColumns: ["uuid"]
          }
        ]
      }
      requirements: {
        Row: {
          catalog_id: number | null
          description: string | null
          reqid: string | null
          requirement_id: number
          title: string | null
        }
        Insert: {
          catalog_id?: number | null
          description?: string | null
          reqid?: string | null
          requirement_id?: number
          title?: string | null
        }
        Update: {
          catalog_id?: number | null
          description?: string | null
          reqid?: string | null
          requirement_id?: number
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "requirements_catalog_id_fkey"
            columns: ["catalog_id"]
            referencedRelation: "catalogs"
            referencedColumns: ["catalog_id"]
          }
        ]
      }
      role_permissions: {
        Row: {
          permission_id: number
          role_id: number
        }
        Insert: {
          permission_id: number
          role_id: number
        }
        Update: {
          permission_id?: number
          role_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            referencedRelation: "roles"
            referencedColumns: ["id"]
          }
        ]
      }
      roles: {
        Row: {
          description: string | null
          id: number
          name: string
        }
        Insert: {
          description?: string | null
          id?: number
          name: string
        }
        Update: {
          description?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      user_answers: {
        Row: {
          answer: Json | null
          lesson_id: string
          max_points: number | null
          question_id: string | null
          result: Json | null
          user_id: string
          uuid: string
        }
        Insert: {
          answer?: Json | null
          lesson_id: string
          max_points?: number | null
          question_id?: string | null
          result?: Json | null
          user_id: string
          uuid?: string
        }
        Update: {
          answer?: Json | null
          lesson_id?: string
          max_points?: number | null
          question_id?: string | null
          result?: Json | null
          user_id?: string
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_answers_lesson_id_fkey"
            columns: ["lesson_id"]
            referencedRelation: "lessons"
            referencedColumns: ["uuid"]
          },
          {
            foreignKeyName: "user_answers_question_id_fkey"
            columns: ["question_id"]
            referencedRelation: "questions"
            referencedColumns: ["uuid"]
          },
          {
            foreignKeyName: "user_answers_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      user_finished_lessons: {
        Row: {
          finished: boolean | null
          id: string
          lesson_id: string | null
          user_id: string | null
        }
        Insert: {
          finished?: boolean | null
          id?: string
          lesson_id?: string | null
          user_id?: string | null
        }
        Update: {
          finished?: boolean | null
          id?: string
          lesson_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_finished_lessons_lesson_id_fkey"
            columns: ["lesson_id"]
            referencedRelation: "lessons"
            referencedColumns: ["uuid"]
          },
          {
            foreignKeyName: "user_finished_lessons_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      user_points: {
        Row: {
          id: number
          points: number | null
          user_id: string | null
        }
        Insert: {
          id?: number
          points?: number | null
          user_id?: string | null
        }
        Update: {
          id?: number
          points?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_points_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_user_score_mc: {
        Args: {
          question_id: number
          user_results: Json
          id_user: string
        }
        Returns: number
      }
      calculate_user_score_true_false: {
        Args: {
          question_id: number
          user_result: boolean
          id_user: string
        }
        Returns: number
      }
      check_user_role: {
        Args: {
          uid: string
          role: string
        }
        Returns: boolean
      }
      create_lesson_from_json: {
        Args: {
          data: Json
        }
        Returns: undefined
      }
      create_user_answers_from_json: {
        Args: {
          data: Json
        }
        Returns: undefined
      }
      delete_claim: {
        Args: {
          uid: string
          claim: string
        }
        Returns: string
      }
      evaluate_multiple_choice: {
        Args: {
          question_id: string
          answer: Json
          max_points: number
        }
        Returns: Json
      }
      evaluate_slider: {
        Args: {
          question_id: string
          answer: Json
          max_points: number
        }
        Returns: Json
      }
      evaluate_true_or_false: {
        Args: {
          question_id: string
          answer: Json
          max_points: number
        }
        Returns: Json
      }
      get_claim: {
        Args: {
          uid: string
          claim: string
        }
        Returns: Json
      }
      get_claims: {
        Args: {
          uid: string
        }
        Returns: Json
      }
      get_lesson_json: {
        Args: {
          p_lesson_uuid: string
        }
        Returns: Json
      }
      get_my_claim: {
        Args: {
          claim: string
        }
        Returns: Json
      }
      get_my_claims: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_teacher_uuid: {
        Args: {
          user_uuid: string
        }
        Returns: string
      }
      is_claims_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      json_cmp: {
        Args: {
          left: Json
          right: Json
        }
        Returns: number
      }
      mc_compare_solution: {
        Args: {
          question_id: number
          answer_json: Json
        }
        Returns: Json
      }
      reverse_boolean_value: {
        Args: {
          row_uuid: string
        }
        Returns: undefined
      }
      role_has_permission: {
        Args: {
          role: string
          permission: number
        }
        Returns: boolean
      }
      set_claim: {
        Args: {
          uid: string
          claim: string
          value: Json
        }
        Returns: string
      }
      sortable_compare_solution: {
        Args: {
          question_id: number
          answer_json: Json
        }
        Returns: Json
      }
      true_false_compare_solution: {
        Args: {
          question_id: number
          user_result: boolean
        }
        Returns: Json
      }
      update_user_permissions: {
        Args: {
          uid: string
        }
        Returns: undefined
      }
      upload_catalog_to_database: {
        Args: {
          p_catalog_name: string
          p_products: Json
          p_requirements: Json
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
