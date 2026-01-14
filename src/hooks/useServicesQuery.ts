/**
 * TanStack Query hooks for services
 * 
 * These hooks provide data fetching, caching, and mutation capabilities
 * for service-related operations.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../providers/QueryProvider';
import { supabase } from '../lib/supabase';
import type { DbServiceInsert, DbServiceUpdate, DbPlanInsert } from '../lib/database.types';

// ============================================================================
// API Functions
// ============================================================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fetchServices(filters?: { category?: string; active?: boolean }): Promise<any[]> {
  let query = supabase
    .from('services')
    .select(`
      *,
      plans (*)
    `)
    .order('display_order')
    .order('name');

  if (filters?.category) {
    query = query.eq('category', filters.category);
  }

  if (filters?.active !== undefined) {
    query = query.eq('is_active', filters.active);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map(service => ({
    ...service,
    plans: service.plans ?? []
  }));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fetchServiceById(id: string): Promise<any> {
  const { data, error } = await supabase
    .from('services')
    .select(`
      *,
      plans (*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(error.message);
  }

  return data ? { ...data, plans: data.plans ?? [] } : null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fetchServiceBySlug(slug: string): Promise<any> {
  const { data, error } = await supabase
    .from('services')
    .select(`
      *,
      plans (*)
    `)
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(error.message);
  }

  return data ? { ...data, plans: data.plans ?? [] } : null;
}

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * Fetch all services with optional filters
 */
export function useServicesQuery(filters?: { category?: string; active?: boolean }) {
  return useQuery({
    queryKey: queryKeys.services.list(filters),
    queryFn: () => fetchServices(filters),
  });
}

/**
 * Fetch active services only (most common use case)
 */
export function useActiveServices() {
  return useServicesQuery({ active: true });
}

/**
 * Fetch a single service by ID
 */
export function useServiceQuery(id: string) {
  return useQuery({
    queryKey: queryKeys.services.detail(id),
    queryFn: () => fetchServiceById(id),
    enabled: !!id,
  });
}

/**
 * Fetch a single service by slug
 */
export function useServiceBySlug(slug: string) {
  return useQuery({
    queryKey: queryKeys.services.bySlug(slug),
    queryFn: () => fetchServiceBySlug(slug),
    enabled: !!slug,
  });
}

// ============================================================================
// Mutation Hooks
// ============================================================================

interface CreateServiceInput {
  serviceData: Omit<DbServiceInsert, 'id' | 'created_at' | 'updated_at' | 'slug'>;
  plansData?: Omit<DbPlanInsert, 'id' | 'service_id' | 'created_at' | 'updated_at'>[];
}

interface UpdateServiceInput {
  id: string;
  serviceData: Partial<DbServiceUpdate>;
  plansData?: Omit<DbPlanInsert, 'id' | 'service_id' | 'created_at' | 'updated_at'>[];
}

/**
 * Create a new service with optional plans
 */
export function useCreateService() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ serviceData, plansData }: CreateServiceInput) => {
      const serviceInsert: DbServiceInsert = {
        name: serviceData.name,
        category: serviceData.category,
        description: serviceData.description,
        long_description: serviceData.long_description,
        icon_url: serviceData.icon_url,
        badge: serviceData.badge,
        display_order: serviceData.display_order,
        is_active: serviceData.is_active ?? true
      };
      
      const { data: service, error: sError } = await supabase
        .from('services')
        .insert(serviceInsert)
        .select()
        .single();

      if (sError) throw new Error(sError.message);
      if (!service) throw new Error('No service returned after creation');

      if (plansData && plansData.length > 0) {
        const plansWithId: DbPlanInsert[] = plansData.map(plan => ({
          ...plan,
          service_id: service.id
        }));
        
        const { error: pError } = await supabase
          .from('plans')
          .insert(plansWithId);

        if (pError) throw new Error(pError.message);
      }

      return service;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services.all });
    },
  });
}

/**
 * Update an existing service
 */
export function useUpdateService() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, serviceData, plansData }: UpdateServiceInput) => {
      const updateData: DbServiceUpdate = {
        name: serviceData.name,
        category: serviceData.category,
        description: serviceData.description,
        long_description: serviceData.long_description,
        icon_url: serviceData.icon_url,
        badge: serviceData.badge,
        display_order: serviceData.display_order,
        is_active: serviceData.is_active
      };
      
      const { error: sError } = await supabase
        .from('services')
        .update(updateData)
        .eq('id', id);

      if (sError) throw new Error(sError.message);

      // Handle plans update if provided (delete and re-insert)
      if (plansData) {
        await supabase.from('plans').delete().eq('service_id', id);
        
        const plansWithId: DbPlanInsert[] = plansData.map(plan => ({
          ...plan,
          service_id: id
        }));
        
        const { error: pError } = await supabase
          .from('plans')
          .insert(plansWithId);

        if (pError) throw new Error(pError.message);
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.services.lists() });
    },
  });
}

/**
 * Delete a service
 */
export function useDeleteService() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services.all });
    },
  });
}

/**
 * Toggle service active status
 */
export function useToggleServiceActive() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, currentStatus }: { id: string; currentStatus: boolean }) => {
      const { error } = await supabase
        .from('services')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw new Error(error.message);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.services.lists() });
    },
  });
}
