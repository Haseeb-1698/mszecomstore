import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { DbService, DbPlan } from '../lib/database.types';

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
            const { data, error } = await supabase
                .from('services')
                .select(`
          *,
          plans (*)
        `)
                .order('name');

            if (error) throw error;
            setServices(data || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const createService = async (serviceData: any, plansData: any[]) => {
        try {
            setLoading(true);
            const { data: service, error: sError } = await supabase
                .from('services')
                .insert([{
                    name: serviceData.name,
                    category: serviceData.category,
                    description: serviceData.description,
                    icon_url: serviceData.icon_url,
                    is_active: serviceData.is_active
                }])
                .select()
                .single();

            if (sError) throw sError;

            if (plansData && plansData.length > 0) {
                const plansWithId = plansData.map(plan => ({
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
        } catch (err: any) {
            return { data: null, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    const updateService = async (id: string, serviceData: any, plansData?: any[]) => {
        try {
            setLoading(true);
            const { error: sError } = await supabase
                .from('services')
                .update({
                    name: serviceData.name,
                    category: serviceData.category,
                    description: serviceData.description,
                    icon_url: serviceData.icon_url,
                    is_active: serviceData.is_active
                })
                .eq('id', id);

            if (sError) throw sError;

            // Handle plans update if provided (simplistic approach: delete and re-insert)
            if (plansData) {
                await supabase.from('plans').delete().eq('service_id', id);
                const plansWithId = plansData.map(plan => ({
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
        } catch (err: any) {
            return { error: err.message };
        } finally {
            setLoading(false);
        }
    };

    const deleteService = async (id: string) => {
        try {
            setLoading(true);
            // Plans will be deleted via cascade if set up, otherwise manually
            const { error } = await supabase
                .from('services')
                .delete()
                .eq('id', id);

            if (error) throw error;
            await fetchServices();
            return { error: null };
        } catch (err: any) {
            return { error: err.message };
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
