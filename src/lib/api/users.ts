import { supabase } from '../supabase';
import type { DbUserProfile, DbUserProfileUpdate, UserRole } from '../database.types';

export async function getUserProfile(userId: string): Promise<DbUserProfile | null> {
    const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) {
        console.error('Error fetching user profile:', error);
        return null;
    }

    return data as DbUserProfile;
}

export async function updateUserProfile(
    userId: string, 
    updates: Partial<DbUserProfileUpdate>
): Promise<{ error: string | null }> {
    try {
        const { error } = await (supabase
            .from('user_profiles') as any)
            .update(updates)
            .eq('id', userId);

        if (error) throw error;
        return { error: null };
    } catch (err: any) {
        return { error: err.message };
    }
}

export async function createUserProfile(
    userId: string,
    data: Partial<DbUserProfileUpdate>
): Promise<{ profile: DbUserProfile | null; error: string | null }> {
    try {
        const { data: profile, error } = await supabase
            .from('user_profiles')
            .insert({ id: userId, ...data } as any)
            .select()
            .single();

        if (error) throw error;
        return { profile: profile as DbUserProfile, error: null };
    } catch (err: any) {
        return { profile: null, error: err.message };
    }
}

export async function isUserAdmin(userId: string): Promise<boolean> {
    try {
        // Use direct query instead of RPC for better type compatibility
        const { data, error } = await supabase
            .from('user_profiles')
            .select('role')
            .eq('id', userId)
            .single();

        if (error) return false;
        return (data as any)?.role === 'admin';
    } catch (err: any) {
        console.error('Error checking admin status:', err);
        return false;
    }
}

export async function getAllUserProfiles(): Promise<DbUserProfile[]> {
    const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching user profiles:', error);
        return [];
    }

    return (data as DbUserProfile[]) || [];
}
