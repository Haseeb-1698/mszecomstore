import { supabase } from '../supabase';
import type { 
    DbOrder, 
    DbOrderItem,
    DbOrderInsert,
    DbOrderItemInsert,
    DbOrderUpdate,
    OrderStatus
} from '../database.types';

export interface OrderWithItems extends DbOrder {
    items: DbOrderItem[];
}

export interface CreateOrderInput {
    userId: string;
    planId: string;
    amount: number;
    customerName: string;
    customerEmail: string;
    customerWhatsapp: string;
    specialInstructions?: string;
    items: {
        planId: string;
        serviceName: string;
        planName: string;
        durationMonths: number;
        price: number;
        quantity: number;
    }[];
}

export async function createOrder(input: CreateOrderInput): Promise<{ order: any; error: string | null }> {
    try {
        // Create the order with properly typed insert object
        const orderInsert: DbOrderInsert = {
            user_id: input.userId,
            plan_id: input.planId,
            amount: input.amount,
            customer_name: input.customerName,
            customer_email: input.customerEmail,
            customer_whatsapp: input.customerWhatsapp,
            special_instructions: input.specialInstructions ?? null,
            status: 'pending'
        };

        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert(orderInsert)
            .select()
            .single();

        if (orderError) throw orderError;
        if (!order) throw new Error('No order returned after creation');

        // Create order items
        if (input.items.length > 0) {
            const orderItems: DbOrderItemInsert[] = input.items.map(item => ({
                order_id: order.id,
                plan_id: item.planId,
                service_name: item.serviceName,
                plan_name: item.planName,
                duration_months: item.durationMonths,
                price: item.price,
                quantity: item.quantity
            }));

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItems);

            if (itemsError) {
                console.error('Error creating order items:', itemsError);
                // Don't fail the whole order, just log the error
            }
        }

        return { order, error: null };
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error creating order';
        console.error('Error creating order:', err);
        return { order: null, error: message };
    }
}

export async function getOrders(userId?: string): Promise<OrderWithItems[]> {
    let query = supabase
        .from('orders')
        .select(`
            *,
            items:order_items (*)
        `)
        .order('created_at', { ascending: false });

    if (userId) {
        query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching orders:', error);
        return [];
    }

    // Transform the response to match OrderWithItems type
    return (data ?? []).map(order => ({
        ...order,
        items: order.items ?? []
    })) as OrderWithItems[];
}

export async function getOrderById(orderId: string): Promise<OrderWithItems | null> {
    const { data, error } = await supabase
        .from('orders')
        .select(`
            *,
            items:order_items (*)
        `)
        .eq('id', orderId)
        .single();

    if (error) {
        console.error('Error fetching order:', error);
        return null;
    }

    if (!data) return null;

    return {
        ...data,
        items: data.items ?? []
    } as OrderWithItems;
}

export async function updateOrderStatus(
    orderId: string, 
    status: OrderStatus
): Promise<{ error: string | null }> {
    try {
        const updateData: DbOrderUpdate = { status };
        
        if (status === 'delivered') {
            updateData.delivered_at = new Date().toISOString();
        }

        const { error } = await supabase
            .from('orders')
            .update(updateData)
            .eq('id', orderId);

        if (error) throw error;
        return { error: null };
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error updating order';
        return { error: message };
    }
}

export async function getAdminDashboardStats(): Promise<{
    total_revenue: number;
    pending_orders: number;
    active_customers: number;
    delivered_today: number;
} | null> {
    try {
        // Use type assertion for the RPC function name since it's defined in the database
        const { data, error } = await supabase.rpc('get_admin_dashboard_stats');

        if (error) throw error;
        
        // The RPC returns an array, get the first item
        const stats = Array.isArray(data) ? data[0] : data;
        return stats ?? null;
    } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        return null;
    }
}
