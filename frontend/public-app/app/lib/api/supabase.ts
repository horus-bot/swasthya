// Mock supabase client to fix build errors after removing @supabase/supabase-js
export const supabase = {
  from: (table: string) => ({
    select: (query: string) => ({
      order: (column: string, opts: any) => Promise.resolve({ data: [], error: null })
    }),
    insert: (data: any) => Promise.resolve({ error: null })
  })
};
