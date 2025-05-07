import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

type SupabaseDataOptions<T> = {
  table: string;
  initialData?: T[];
  orderBy?: { column: string; ascending?: boolean };
  select?: string;
};

export function useSupabaseData<T extends { id: string }>(options: SupabaseDataOptions<T>) {
  const { table, initialData = [], orderBy, select = '*' } = options;
  const { user } = useAuth();
  const [data, setData] = useState<T[]>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch data from Supabase
  const fetchData = async () => {
    console.log(`[useSupabaseData] Fetching ${table} data...`);

    if (!user) {
      console.log(`[useSupabaseData] No authenticated user, using initialData for ${table}`);
      setData(initialData);
      setLoading(false);
      return;
    }

    console.log(`[useSupabaseData] User authenticated for ${table}:`, {
      id: user.id,
      email: user.email
    });

    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from(table)
        .select(select)
        .eq('user_id', user.id);

      if (orderBy) {
        query = query.order(orderBy.column, {
          ascending: orderBy.ascending ?? false,
        });
      }

      console.log(`[useSupabaseData] Executing query for ${table}:`, {
        table,
        select,
        user_id: user.id,
        orderBy
      });

      const { data: fetchedData, error } = await query;

      if (error) {
        console.error(`[useSupabaseData] Error in Supabase query for ${table}:`, error);
        throw error;
      }

      console.log(`[useSupabaseData] Fetched ${table} data:`, fetchedData);
      console.log(`[useSupabaseData] Number of ${table} items:`, fetchedData?.length || 0);

      setData(fetchedData as T[] || []);
    } catch (err) {
      console.error(`[useSupabaseData] Error fetching ${table}:`, err);
      setError(err instanceof Error ? err : new Error(String(err)));
      // Use console.error instead of toast to prevent UI errors
      console.error(`[useSupabaseData] Failed to load ${table}: ${err instanceof Error ? err.message : String(err)}`);
      // Fall back to initial data
      setData(initialData);
    } finally {
      setLoading(false);
      console.log(`[useSupabaseData] Finished fetching ${table} data`);
    }
  };

  // Add a new item
  const addItem = async (newItem: Omit<T, 'id' | 'created_at' | 'user_id'>) => {
    console.log(`[useSupabaseData] Adding item to ${table}:`, newItem);

    if (!user) {
      console.warn('[useSupabaseData] You must be logged in to add items');
      return null;
    }

    try {
      setError(null);

      const itemWithUserId = {
        ...newItem,
        user_id: user.id,
      };

      console.log(`[useSupabaseData] Adding item with user_id to ${table}:`, itemWithUserId);

      const { data: insertedData, error } = await supabase
        .from(table)
        .insert([itemWithUserId])
        .select();

      if (error) {
        console.error(`[useSupabaseData] Error inserting into ${table}:`, error);
        throw error;
      }

      console.log(`[useSupabaseData] Insert result for ${table}:`, insertedData);

      const insertedItem = insertedData?.[0] as T;
      if (insertedItem) {
        console.log(`[useSupabaseData] Successfully inserted item into ${table}:`, insertedItem);
        setData(prev => [insertedItem, ...prev]);
      } else {
        console.warn(`[useSupabaseData] No item returned after insert into ${table}`);
      }

      return insertedItem || null;
    } catch (err) {
      console.error(`[useSupabaseData] Error adding to ${table}:`, err);
      setError(err instanceof Error ? err : new Error(String(err)));
      console.error(`[useSupabaseData] Failed to add item: ${err instanceof Error ? err.message : String(err)}`);
      return null;
    }
  };

  // Update an item
  const updateItem = async (id: string, updates: Partial<T>) => {
    if (!user) {
      console.warn('You must be logged in to update items');
      return false;
    }

    try {
      setError(null);

      const { error } = await supabase
        .from(table)
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setData(prev =>
        prev.map(item => (item.id === id ? { ...item, ...updates } : item))
      );

      return true;
    } catch (err) {
      console.error(`Error updating ${table}:`, err);
      setError(err instanceof Error ? err : new Error(String(err)));
      console.error(`Failed to update item: ${err instanceof Error ? err.message : String(err)}`);
      return false;
    }
  };

  // Delete an item
  const deleteItem = async (id: string) => {
    if (!user) {
      console.warn('You must be logged in to delete items');
      return false;
    }

    try {
      setError(null);

      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setData(prev => prev.filter(item => item.id !== id));

      return true;
    } catch (err) {
      console.error(`Error deleting from ${table}:`, err);
      setError(err instanceof Error ? err : new Error(String(err)));
      console.error(`Failed to delete item: ${err instanceof Error ? err.message : String(err)}`);
      return false;
    }
  };

  // Fetch data when user changes
  useEffect(() => {
    console.log(`[useSupabaseData] useEffect triggered for ${table}, user:`, user?.id);
    try {
      fetchData();
    } catch (err) {
      console.error(`[useSupabaseData] Error in fetchData useEffect for ${table}:`, err);
      setLoading(false);
      setData(initialData);
    }

    // Log the current state after the effect runs
    return () => {
      console.log(`[useSupabaseData] Cleanup for ${table} effect, current data:`, data);
    };
  }, [user?.id]);

  return {
    data,
    loading,
    error,
    fetchData,
    addItem,
    updateItem,
    deleteItem,
  };
}
