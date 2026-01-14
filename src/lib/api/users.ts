import { supabase } from '../supabase';
import type { DbUserProfileUpdate, DbUserProfileInsert } from '../database.types';
import { withTimeout, SHORT_TIMEOUT } from '../utils/timeout';

// Use 'any' for return types since Supabase returns slightly different types
// (e.g., string instead of enum unions)
export async function getUserProfile(userId: string): Promise<any> {
    try {
        const { data, error } = await withTimeout(
            supabase
                .from('user_profiles')
                .select('*')
                .eq('id', userId)
                .single(),
            SHORT_TIMEOUT,
            'User profile fetch timed out'
        );

        if (error) {
            // PGRST116 = no rows found - this is expected for new users
            if (error.code === 'PGRST116') {
                return null;
            }
            console.error('Error fetching user profile:', error);
            return null;
        }

        return data;
    } catch (err) {
        console.error('Error fetching user profile:', err);
        return null;
    }
}

export async function updateUserProfile(
    userId: string, 
    updates: DbUserProfileUpdate
): Promise<{ error: string | null }> {
    try {
        const { error } = await supabase
            .from('user_profiles')
            .update(updates)
            .eq('id', userId);

        if (error) throw error;
        return { error: null };
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error updating profile';
        return { error: message };
    }
}

export async function createUserProfile(
    userId: string,
    data: Omit<DbUserProfileInsert, 'id'>
): Promise<{ profile: any; error: string | null }> {
    try {
        const insertData: DbUserProfileInsert = { 
            id: userId, 
            ...data 
        };
        
        const { data: profile, error } = await supabase
            .from('user_profiles')
            .insert(insertData)
            .select()
            .single();

        if (error) throw error;
        return { profile, error: null };
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error creating profile';
        return { profile: null, error: message };
    }
}

export async function isUserAdmin(userId: string): Promise<boolean> {
    try {
        // Add timeout to prevent hanging - default to false if times out
        const { data, error } = await withTimeout(
            supabase
                .from('user_profiles')
                .select('role')
                .eq('id', userId)
                .single(),
            SHORT_TIMEOUT,
            'Admin check timed out'
        );

        // Any error (including no profile found) = not admin
        if (error) {
            // PGRST116 = no rows found - user has no profile yet
            if (error.code !== 'PGRST116') {
                console.warn('Error checking admin status:', error.message);
            }
            return false;
        }
        
        return data?.role === 'admin';
    } catch (err) {
        // Timeout or other error - default to non-admin for safety
        console.warn('Admin check failed, defaulting to non-admin:', err);
        return false;
    }
}

export async function getAllUserProfiles(): Promise<any[]> {
    const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching user profiles:', error);
        return [];
    }

    return data ?? [];
}
