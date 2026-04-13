import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiService } from '@/apiService';
import { isSupabaseConfigured, supabase } from '@/supabaseClient';

// Mock the supabase client
vi.mock('@/supabaseClient', () => ({
  isSupabaseConfigured: vi.fn(),
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => ({
          limit: vi.fn(() => Promise.resolve({ data: [], error: null, count: 0 })),
          then: (cb: any) => Promise.resolve({ data: [], error: null }).then(cb)
        })),
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: {}, error: null }))
        }))
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: { id: 123 }, error: null }))
        }))
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: null }))
      }))
    }))
  }
}));

// Mock global fetch
global.fetch = vi.fn();

describe('apiService (Injected Supabase)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAgents', () => {
    it('should fetch from Supabase when configured', async () => {
      (isSupabaseConfigured as any).mockReturnValue(true);
      const mockAgents = [{ id: '1', name: 'Vito' }];
      
      // Setup mock chain for Supabase
      (supabase.from as any).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockAgents, error: null })
      });

      const agents = await apiService.getAgents();
      
      expect(isSupabaseConfigured).toHaveBeenCalled();
      expect(supabase.from).toHaveBeenCalledWith('agents');
      expect(agents).toEqual(mockAgents);
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should fetch from REST API when Supabase is NOT configured', async () => {
      (isSupabaseConfigured as any).mockReturnValue(false);
      const mockAgents = [{ id: '2', name: 'Michael' }];
      
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockAgents)
      });

      const agents = await apiService.getAgents();
      
      expect(isSupabaseConfigured).toHaveBeenCalled();
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/agents'));
      expect(agents).toEqual(mockAgents);
      expect(supabase.from).not.toHaveBeenCalled();
    });
  });

  describe('createTask', () => {
    it('should insert into Supabase when configured', async () => {
      (isSupabaseConfigured as any).mockReturnValue(true);
      const newTask = { title: 'New Directive', task_payload: 'Payload' };
      
      (supabase.from as any).mockReturnValue({
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: { id: 999, ...newTask }, error: null })
      });

      const result = await apiService.createTask(newTask);
      
      expect(result.id).toBe(999);
      expect(supabase.from).toHaveBeenCalledWith('tasks');
    });
  });

  describe('getSettings', () => {
    it('should map Supabase snake_case columns to camelCase settings', async () => {
      (isSupabaseConfigured as any).mockReturnValue(true);
      const dbSettings = {
        honorific: 'Don',
        famiglia_name: 'Passione',
        notifications_enabled: true,
        background_animations_enabled: false,
        personal_directive: 'Respect',
        system_prompt: 'Be efficient'
      };

      (supabase.from as any).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: dbSettings, error: null })
      });

      const settings = await apiService.getSettings();
      
      expect(settings.famigliaName).toBe('Passione');
      expect(settings.notificationsEnabled).toBe(true);
      expect(settings.backgroundAnimationsEnabled).toBe(false);
    });
  });
});
