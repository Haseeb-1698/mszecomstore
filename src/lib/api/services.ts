import { supabase } from '../supabase';

export async function getServices() {
    const { data, error } = await supabase
        .from('services')
        .select(`
      *,
      plans (*)
    `)
        .eq('is_active', true)
        .order('name');

    if (error) {
        console.error('Error fetching services:', error);
        return [];
    }

    return (data as any[]).map(service => ({
        ...service,
        // Provide fallbacks for missing fields to preserve visuals
        slug: service.slug || service.name.toLowerCase().replace(/ /g, '-'),
        logo: service.icon_url || '/icons/default-service.svg',
        longDescription: service.description,
        pricingTiers: (service.plans || []).map((plan: any) => ({
            name: plan.name,
            price: `$${plan.price}/mo`,
            quality: plan.duration_months === 1 ? 'Standard' : 'Premium'
        }))
    }));
}

export async function getServiceBySlug(slug: string) {
    // Since we don't have slug in schema yet, we might need to filter manually or hope it exists
    const { data, error } = await supabase
        .from('services')
        .select(`
      *,
      plans (*)
    `);

    if (error) {
        console.error('Error fetching service by slug:', error);
        return null;
    }

    const service = (data as any[]).find(s => s.slug === slug || s.name.toLowerCase().replace(/ /g, '-') === slug);

    if (!service) return null;

    return {
        ...service,
        slug: service.slug || service.name.toLowerCase().replace(/ /g, '-'),
        logo: '/icons/default-service.svg',
        longDescription: service.description,
        pricingTiers: (service.plans || []).map((plan: any) => ({
            name: plan.name,
            price: `$${plan.price}/mo`,
            quality: plan.duration_months === 1 ? 'Standard' : 'Premium'
        }))
    };
}
