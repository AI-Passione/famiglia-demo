import { supabase, isSupabaseConfigured } from './supabaseClient';
import { API_BASE } from './config';
import type { 
  FamigliaAgent, 
  Task, 
  ActionLog, 
  AppSettings, 
  ConversationLog, 
  MissionLogEntry,
  PaginatedActions,
  PaginatedTasks
} from './types';

/**
 * apiService abstracts data fetching so the UI can work with either
 * a local FastAPI backend or a direct Supabase connection.
 */

export const apiService = {
  // --- Agents ---
  async getAgents(): Promise<FamigliaAgent[]> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .order('name', { ascending: true });
      if (error) throw error;
      return data as FamigliaAgent[];
    }
    // Fallback: Return empty list if no Supabase (avoids crashing UI)
    console.warn('Supabase not configured, returning empty agents list');
    return [];
  },

  // --- Tasks ---
  async getTasks(limit = 40): Promise<PaginatedTasks> {
    if (isSupabaseConfigured()) {
      const { data, error, count } = await supabase
        .from('tasks')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .limit(limit);
      if (error) throw error;
      return { tasks: data as Task[], total: count || 0 };
    }
    return { tasks: [], total: 0 };
  },

  async createTask(task: Partial<Task>): Promise<Task> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('tasks')
        .insert([task])
        .select()
        .single();
      if (error) throw error;
      return data as Task;
    }
    throw new Error('Supabase not configured for persistence');
  },

  // --- Actions (Tool Ledger) ---
  async getActions(limit = 24): Promise<PaginatedActions> {
    if (isSupabaseConfigured()) {
      const { data, error, count } = await supabase
        .from('actions')
        .select('*', { count: 'exact' })
        .order('timestamp', { ascending: false })
        .limit(limit);
      if (error) throw error;
      return { actions: data as ActionLog[], total: count || 0 };
    }
    return { actions: [], total: 0 };
  },

  // --- Settings ---
  async getSettings(): Promise<AppSettings> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('app_settings')
        .select('*')
        .eq('id', 1)
        .single();
      if (error) throw error;
      return {
        honorific: data.honorific,
        famigliaName: data.famiglia_name,
        notificationsEnabled: data.notifications_enabled,
        backgroundAnimationsEnabled: data.background_animations_enabled,
        personalDirective: data.personal_directive,
        systemPrompt: data.system_prompt,
      } as AppSettings;
    }
    // Return empty settings object as fallback
    return {} as AppSettings;
  },

  async updateSettings(settings: AppSettings): Promise<void> {
    if (isSupabaseConfigured()) {
      const { error } = await supabase
        .from('app_settings')
        .update({
          honorific: settings.honorific,
          famiglia_name: settings.famigliaName,
          notifications_enabled: settings.notificationsEnabled,
          background_animations_enabled: settings.backgroundAnimationsEnabled,
          personal_directive: settings.personalDirective,
          system_prompt: settings.systemPrompt,
          updated_at: new Date().toISOString()
        })
        .eq('id', 1);
      if (error) throw error;
      return;
    }
    console.error('Settings update failed: Supabase not configured');
  },

  // --- Conversations ---
  async getConversations(): Promise<ConversationLog[]> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .order('updated_at', { ascending: false });
      if (error) throw error;
      return data as ConversationLog[];
    }
    return [];
  },

  // --- Mission Logs ---
  async getMissionLogs(): Promise<MissionLogEntry[]> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('mission_logs')
        .select('*')
        .order('timestamp', { ascending: false });
      if (error) throw error;
      return data as MissionLogEntry[];
    }
    return [];
  }
};
