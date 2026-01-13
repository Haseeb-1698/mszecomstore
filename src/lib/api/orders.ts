import { supabase } from '../supabase';
import type { 
    DbOrder, 
    DbOrderItem,
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

export async function createOrder(input: CreateOrderInput): Promise<{ order: DbOrder | null; error: string | null }> {
    try {
        // Create the order
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
                user_id: input.userId,
                plan_id: input.planId,
                amount: input.amount,
                customer_name: input.customerName,
                customer_email: input.customerEmail,
                customer_whatsapp: input.customerWhatsapp,
                special_instructions: input.specialInstructions,
                status: 'pending' as OrderStatus
            } as any)
            .select()
            .single();

        if (orderError) throw orderError;

        // Create order items
        if (input.items.length > 0) {
            const orderItems = input.items.map(item => ({
                order_id: (order as any).id,
                plan_id: item.planId,
                service_name: item.serviceName,
                plan_name: item.planName,
                duration_months: item.durationMonths,
                price: item.price,
                quantity: item.quantity
            }));

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItems as any);

            if (itemsError) {
                console.error('Error creating order items:', itemsError);
                // Don't fail the whole order, just log the error
            }
        }

        return { order: order as DbOrder, error: null };
    } catch (err: any) {
        console.error('Error creating order:', err);
        return { order: null, error: err.message };
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

    return (data as any[]) || [];
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

    return data as any;
}

export async function updateOrderStatus(
    orderId: string, 
    status: OrderStatus
): Promise<{ error: string | null }> {
    try {
        const updateData: Record<string, any> = { status };
        
        if (status === 'delivered') {
            updateData.delivered_at = new Date().toISOString();
        }

        const { error } = await (supabase
            .from('orders') as any)
            .update(updateData)
            .eq('id', orderId);

        if (error) throw error;
        return { error: null };
    } catch (err: any) {
        return { error: err.message };
    }
}

export async function getAdminDashboardStats(): Promise<{
    total_revenue: number;
    pending_orders: number;
    active_customers: number;
    delivered_today: number;
} | null> {
    try {
        const { data, error } = await supabase
            .rpc('get_admin_dashboard_stats' as any);

        if (error) throw error;
        return (data as any)?.[0] || null;
    } catch (err: any) {
        console.error('Error fetching dashboard stats:', err);
        return null;
    }
}
