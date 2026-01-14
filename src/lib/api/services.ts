import { supabase } from '../supabase';
import type { DbService, DbPlan } from '../database.types';

export interface ServiceWithPlansResponse extends DbService {
    plans: DbPlan[];
}

export async function getServices(): Promise<ServiceWithPlansResponse[]> {
    const { data, error } = await supabase
        .from('services')
        .select(`
      *,
      plans (*)
    `)
        .eq('is_active', true)
        .order('display_order')
        .order('name');

    if (error) {
        console.error('Error fetching services:', error);
        return [];
    }

    return (data as ServiceWithPlansResponse[]).map(service => ({
        ...service,
        // Ensure slug is always present (fallback for legacy data)
        slug: service.slug || service.name.toLowerCase().replaceAll(' ', '-'),
        // Map icon_url to logo for backwards compatibility
        icon_url: service.icon_url || '/icons/default-service.svg',
    }));
}

export async function getServiceBySlug(slug: string): Promise<ServiceWithPlansResponse | null> {
    // First try to find by slug directly
    const { data, error } = await supabase
        .from('services')
        .select(`
      *,
      plans (*)
    `)
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

    if (error) {
        // Fallback: try to match by generated slug from name
        const { data: allServices, error: allError } = await supabase
            .from('services')
            .select(`
        *,
        plans (*)
      `)
            .eq('is_active', true);

        if (allError) {
            console.error('Error fetching service by slug:', allError);
            return null;
        }

        const service = (allServices as ServiceWithPlansResponse[]).find(
            s => s.slug === slug || s.name.toLowerCase().replaceAll(' ', '-') === slug
        );

        if (!service) return null;

        return {
            ...service,
            slug: service.slug || service.name.toLowerCase().replaceAll(' ', '-'),
            icon_url: service.icon_url || '/icons/default-service.svg',
        };
    }

    return {
        ...data,
        slug: data.slug || data.name.toLowerCase().replaceAll(' ', '-'),
        icon_url: data.icon_url || '/icons/default-service.svg',
    } as ServiceWithPlansResponse;
}

export async function getServiceById(id: string): Promise<ServiceWithPlansResponse | null> {
    const { data, error } = await supabase
        .from('services')
        .select(`
      *,
      plans (*)
    `)
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching service by id:', error);
        return null;
    }

    return data as ServiceWithPlansResponse;
}

export async function getRelatedServices(currentServiceId: string, category: string, limit = 4): Promise<ServiceWithPlansResponse[]> {
    const { data, error } = await supabase
        .from('services')
        .select(`
      *,
      plans (*)
    `)
        .eq('category', category)
        .eq('is_active', true)
        .neq('id', currentServiceId)
        .order('display_order')
        .limit(limit);

    if (error) {
        console.error('Error fetching related services:', error);
        return [];
    }

    return data as ServiceWithPlansResponse[];
}
