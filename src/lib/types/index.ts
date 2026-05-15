/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'parent' | 'therapist' | 'teacher';

export interface User {
  id: string;
  email: string;
  phone?: string;
  name: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
}

export interface Child {
  id: string;
  parent_id: string;
  name: string;
  age: number;
  photo_url?: string;
  bio?: string;
  created_at: string;
}

export type MemoryNodeType = 'trigger' | 'intervention' | 'person' | 'place' | 'emotion' | 'meltdown';

export interface MemoryNode {
  id: string;
  child_id: string;
  type: MemoryNodeType;
  label: string;
  metadata: Record<string, any>;
  created_at: string;
  created_by: string;
}

export interface MemoryEdge {
  id: string;
  child_id: string;
  source_node_id: string;
  target_node_id: string;
  relationship: 'causes' | 'calms' | 'introduced' | 'context';
  strength: number;
  created_at: string;
}

export interface MeltdownEvent {
  id: string;
  child_id: string;
  timestamp: string;
  intensity: number; // 1-10
  duration_minutes: number;
  triggers: string[];
  interventions_tried: Record<string, any>;
  resolved: boolean;
  escalated: boolean;
  notes?: string;
}

export interface Intervention {
  id: string;
  child_id: string;
  name: string;
  attempts: number;
  successes: number;
  last_used?: string;
  notes?: string;
  icon?: string;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  language: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface Prediction {
  id: string;
  child_id: string;
  date: string;
  risk_score: number;
  risk_level: 'low' | 'medium' | 'high';
  factors: {
    label: string;
    score: number;
  }[];
  sent_at?: string;
}
