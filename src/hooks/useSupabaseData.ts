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
    if (!user) {
      setData(initialData);
      setLoading(false);
      return;
    }

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

      const { data: fetchedData, error } = await query;

      if (error) throw error;

      setData(fetchedData as T[] || []);
    } catch (err) {
      console.error(`Error fetching ${table}:`, err);
      setError(err instanceof Error ? err : new Error(String(err)));
      // Use console.error instead of toast to prevent UI errors
      console.error(`Failed to load ${table}: ${err instanceof Error ? err.message : String(err)}`);
      // Fall back to initial data
      setData(initialData);
    } finally {
      setLoading(false);
    }
  };

  // Add a new item
  const addItem = async (newItem: Omit<T, 'id' | 'created_at' | 'user_id'>) => {
    if (!user) {
      console.warn('You must be logged in to add items');
      return null;
    }

    try {
      setError(null);

      const itemWithUserId = {
        ...newItem,
        user_id: user.id,
      };

      const { data: insertedData, error } = await supabase
        .from(table)
        .insert([itemWithUserId])
        .select();

      if (error) throw error;

      const insertedItem = insertedData?.[0] as T;
      if (insertedItem) {
        setData(prev => [insertedItem, ...prev]);
      }

      return insertedItem || null;
    } catch (err) {
      console.error(`Error adding to ${table}:`, err);
      setError(err instanceof Error ? err : new Error(String(err)));
      console.error(`Failed to add item: ${err instanceof Error ? err.message : String(err)}`);
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
    try {
      fetchData();
    } catch (err) {
      console.error('Error in fetchData useEffect:', err);
      setLoading(false);
      setData(initialData);
    }
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
