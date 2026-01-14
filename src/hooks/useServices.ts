import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { DbService, DbPlan, DbPlanInsert, DbServiceInsert, DbServiceUpdate } from '../lib/database.types';

export interface ServiceWithPlans extends DbService {
    plans: DbPlan[];
}

export const useServices = () => {
    const [services, setServices] = useState<ServiceWithPlans[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchServices = async () => {
        try {
            setLoading(true);
            const { data, error: fetchError } = await supabase
                .from('services')
                .select(`
          *,
          plans (*)
        `)
                .order('display_order')
                .order('name');

            if (fetchError) throw fetchError;
            
            // Transform the data to ensure plans is always an array
            const transformedData: ServiceWithPlans[] = (data as any[] ?? []).map(service => ({
                ...service,
                plans: (service.plans ?? []) as DbPlan[]
            })) as ServiceWithPlans[];
            
            setServices(transformedData);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Unknown error fetching services';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const createService = async (
        serviceData: Omit<DbServiceInsert, 'id' | 'created_at' | 'updated_at' | 'slug'>,
        plansData: Omit<DbPlanInsert, 'id' | 'service_id' | 'created_at' | 'updated_at'>[]
    ) => {
        try {
            setLoading(true);
            
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

            if (sError) throw sError;
            if (!service) throw new Error('No service returned after creation');

            if (plansData && plansData.length > 0) {
                const plansWithId: DbPlanInsert[] = plansData.map(plan => ({
                    ...plan,
                    service_id: service.id
                }));
                const { error: pError } = await supabase
                    .from('plans')
                    .insert(plansWithId);

                if (pError) throw pError;
            }

            await fetchServices();
            return { data: service, error: null };
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Unknown error creating service';
            return { data: null, error: message };
        } finally {
            setLoading(false);
        }
    };

    const updateService = async (
        id: string,
        serviceData: Partial<DbServiceUpdate>,
        plansData?: Omit<DbPlanInsert, 'id' | 'service_id' | 'created_at' | 'updated_at'>[]
    ) => {
        try {
            setLoading(true);
            
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

            if (sError) throw sError;

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

                if (pError) throw pError;
            }

            await fetchServices();
            return { error: null };
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Unknown error updating service';
            return { error: message };
        } finally {
            setLoading(false);
        }
    };

    const deleteService = async (id: string) => {
        try {
            setLoading(true);
            // Plans will be deleted via cascade
            const { error } = await supabase
                .from('services')
                .delete()
                .eq('id', id);

            if (error) throw error;
            await fetchServices();
            return { error: null };
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Unknown error deleting service';
            return { error: message };
        } finally {
            setLoading(false);
        }
    };

    const toggleActiveStatus = async (id: string, currentStatus: boolean) => {
        return updateService(id, { is_active: !currentStatus });
    };

    useEffect(() => {
        fetchServices();
    }, []);

    return {
        services,
        loading,
        error,
        refresh: fetchServices,
        createService,
        updateService,
        deleteService,
        toggleActiveStatus
    };
};
