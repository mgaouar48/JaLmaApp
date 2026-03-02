export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Tables: {
            drivers: {
                Row: {
                    created_at: string
                    current_location: unknown
                    id: string
                    is_available: boolean
                    is_online: boolean
                    last_location_update: string | null
                    price_per_delivery: number | null
                    tank_capacity_liters: number | null
                    updated_at: string
                    vehicle_plate: string | null
                }
                Insert: {
                    created_at?: string
                    current_location?: unknown
                    id: string
                    is_available?: boolean
                    is_online?: boolean
                    last_location_update?: string | null
                    price_per_delivery?: number | null
                    tank_capacity_liters?: number | null
                    updated_at?: string
                    vehicle_plate?: string | null
                }
                Update: {
                    created_at?: string
                    current_location?: unknown
                    id?: string
                    is_available?: boolean
                    is_online?: boolean
                    last_location_update?: string | null
                    price_per_delivery?: number | null
                    tank_capacity_liters?: number | null
                    updated_at?: string
                    vehicle_plate?: string | null
                }
                Relationships: []
            }
            order_status_logs: {
                Row: {
                    changed_by: string | null
                    created_at: string
                    id: string
                    metadata: Json | null
                    new_status: Database["public"]["Enums"]["order_status"]
                    order_id: string
                    previous_status: Database["public"]["Enums"]["order_status"] | null
                }
                Insert: {
                    changed_by?: string | null
                    created_at?: string
                    id?: string
                    metadata?: Json | null
                    new_status: Database["public"]["Enums"]["order_status"]
                    order_id: string
                    previous_status?: Database["public"]["Enums"]["order_status"] | null
                }
                Update: {
                    changed_by?: string | null
                    created_at?: string
                    id?: string
                    metadata?: Json | null
                    new_status?: Database["public"]["Enums"]["order_status"]
                    order_id?: string
                    previous_status?: Database["public"]["Enums"]["order_status"] | null
                }
                Relationships: [
                    {
                        foreignKeyName: "order_status_logs_order_id_fkey"
                        columns: ["order_id"]
                        isOneToOne: false
                        referencedRelation: "orders"
                        referencedColumns: ["id"]
                    },
                ]
            }
            orders: {
                Row: {
                    assigned_at: string | null
                    cancellation_reason: string | null
                    cancelled_at: string | null
                    cancelled_by: string | null
                    client_id: string
                    completed_at: string | null
                    created_at: string
                    delivery_address: string | null
                    delivery_location: unknown
                    driver_id: string | null
                    estimated_price: number | null
                    final_price: number | null
                    id: string
                    picked_up_at: string | null
                    quantity_liters: number
                    status: Database["public"]["Enums"]["order_status"]
                    updated_at: string
                }
                Insert: {
                    assigned_at?: string | null
                    cancellation_reason?: string | null
                    cancelled_at?: string | null
                    cancelled_by?: string | null
                    client_id: string
                    completed_at?: string | null
                    created_at?: string
                    delivery_address?: string | null
                    delivery_location: unknown
                    driver_id?: string | null
                    estimated_price?: number | null
                    final_price?: number | null
                    id?: string
                    picked_up_at?: string | null
                    quantity_liters?: number
                    status?: Database["public"]["Enums"]["order_status"]
                    updated_at?: string
                }
                Update: {
                    assigned_at?: string | null
                    cancellation_reason?: string | null
                    cancelled_at?: string | null
                    cancelled_by?: string | null
                    client_id?: string
                    completed_at?: string | null
                    created_at?: string
                    delivery_address?: string | null
                    delivery_location?: unknown
                    driver_id?: string | null
                    estimated_price?: number | null
                    final_price?: number | null
                    id?: string
                    picked_up_at?: string | null
                    quantity_liters?: number
                    status?: Database["public"]["Enums"]["order_status"]
                    updated_at?: string
                }
                Relationships: []
            }
            profiles: {
                Row: {
                    avatar_url: string | null
                    created_at: string
                    date_of_birth: string | null
                    email: string | null
                    first_name: string | null
                    gender: string | null
                    id: string
                    last_name: string | null
                    phone: string | null
                    role: Database["public"]["Enums"]["user_role"]
                    updated_at: string
                }
                Insert: {
                    avatar_url?: string | null
                    created_at?: string
                    date_of_birth?: string | null
                    email?: string | null
                    first_name?: string | null
                    gender?: string | null
                    id: string
                    last_name?: string | null
                    phone?: string | null
                    role?: Database["public"]["Enums"]["user_role"]
                    updated_at?: string
                }
                Update: {
                    avatar_url?: string | null
                    created_at?: string
                    date_of_birth?: string | null
                    email?: string | null
                    first_name?: string | null
                    gender?: string | null
                    id?: string
                    last_name?: string | null
                    phone?: string | null
                    role?: Database["public"]["Enums"]["user_role"]
                    updated_at?: string
                }
                Relationships: []
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            assign_driver_to_order: {
                Args: { p_driver_id?: string; p_order_id: string }
                Returns: Json
            }
            find_nearest_driver: {
                Args: { p_delivery_location: unknown; p_max_distance_meters?: number }
                Returns: {
                    distance_meters: number
                    driver_id: string
                }[]
            }
            list_available_drivers: {
                Args: {
                    p_client_lat: number
                    p_client_lon: number
                    p_max_distance_meters?: number
                }
                Returns: {
                    distance_meters: number
                    driver_id: string
                    first_name: string
                    last_name: string
                    lat: number
                    lon: number
                    price_per_delivery: number
                    tank_capacity_liters: number
                    vehicle_plate: string
                }[]
            }
            validate_order_status_transition: {
                Args: {
                    p_current_status: Database["public"]["Enums"]["order_status"]
                    p_new_status: Database["public"]["Enums"]["order_status"]
                }
                Returns: boolean
            }
        }
        Enums: {
            order_status:
            | "pending"
            | "searching"
            | "assigned"
            | "on_route"
            | "completed"
            | "cancelled"
            user_role: "client" | "driver" | "admin"
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

// Helper types for easy access
export type Tables<T extends keyof Database["public"]["Tables"]> =
    Database["public"]["Tables"][T]["Row"]
export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
    Database["public"]["Tables"][T]["Insert"]
export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
    Database["public"]["Tables"][T]["Update"]
export type Enums<T extends keyof Database["public"]["Enums"]> =
    Database["public"]["Enums"][T]

// Convenience aliases
export type Profile = Tables<"profiles">
export type Driver = Tables<"drivers">
export type Order = Tables<"orders">
export type OrderStatusLog = Tables<"order_status_logs">
export type UserRole = Enums<"user_role">
export type OrderStatus = Enums<"order_status">

// RPC return types
export type AvailableDriver =
    Database["public"]["Functions"]["list_available_drivers"]["Returns"][number]
