// In-memory mock for Supabase-like API used by the app.
// Replaces the real `@supabase/supabase-js` client during local development/testing.

type GovtComplaint = any;

const now = () => new Date().toISOString();

const mockDb: Record<string, any[]> = {
  govt_complaints: [
    {
      id: 'mock-1',
      hospital_id: null,
      category: 'Initial Mock Advisory',
      severity: 'LOW',
      payload: { title: 'Welcome', description: 'This is mock data' },
      message: 'This is a mock advisory',
      created_at: now(),
    },
  ],
  advisories: [
    {
      id: 'adv-1',
      title: 'Mock advisory',
      category: 'General',
      severity: 'Low',
      message: 'This is a mock advisory used when Supabase is disabled.',
      created_at: now(),
    },
  ],
};

function ensureCollection(name: string) {
  if (!mockDb[name]) mockDb[name] = [];
  return mockDb[name];
}

function clone(v: any) {
  return JSON.parse(JSON.stringify(v));
}

function createQuery(table: string) {
  const collection = ensureCollection(table);

  return {
    select: (_fields?: string) => {
      const base = clone(collection);
      return {
        is: (field: string, val: any) => {
          const filtered = base.filter((r: any) => (val === null ? r[field] === null : r[field] === val));
          return {
            order: async (orderField: string, opts?: { ascending?: boolean }) => {
              const asc = opts?.ascending ?? true;
              const sorted = filtered.slice().sort((a: any, b: any) => {
                const ta = new Date(a[orderField]).getTime();
                const tb = new Date(b[orderField]).getTime();
                return asc ? ta - tb : tb - ta;
              });
              return { data: sorted, error: null };
            },
          };
        },
        eq: (field: string, val: any) => {
          const filtered = base.filter((r: any) => r[field] === val);
          return {
            order: async (orderField: string, opts?: { ascending?: boolean }) => {
              const asc = opts?.ascending ?? true;
              const sorted = filtered.slice().sort((a: any, b: any) => {
                const ta = new Date(a[orderField]).getTime();
                const tb = new Date(b[orderField]).getTime();
                return asc ? ta - tb : tb - ta;
              });
              return { data: sorted, error: null };
            },
            then: async (cb: any) => cb({ data: filtered, error: null }),
          };
        },
        order: async (orderField: string, opts?: { ascending?: boolean }) => {
          const asc = opts?.ascending ?? true;
          const sorted = base.slice().sort((a: any, b: any) => {
            const ta = new Date(a[orderField]).getTime();
            const tb = new Date(b[orderField]).getTime();
            return asc ? ta - tb : tb - ta;
          });
          return { data: sorted, error: null };
        },
      };
    },
    insert: async (items: any[] | any) => {
      const arr = Array.isArray(items) ? items : [items];
      const inserted = arr.map((it: any) => {
        const obj = { ...it };
        if (!obj.id) obj.id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        if (!obj.created_at) obj.created_at = now();
        collection.unshift(obj);
        return obj;
      });
      return { data: inserted, error: null };
    },
    update: (updates: any) => ({
      eq: async (field: string, val: any) => {
        const idx = collection.findIndex((r: any) => r[field] === val);
        if (idx === -1) return { data: null, error: { message: 'Not found' } };
        collection[idx] = { ...collection[idx], ...updates };
        return { data: [collection[idx]], error: null };
      },
    }),
    delete: () => ({
      eq: async (field: string, val: any) => {
        const idx = collection.findIndex((r: any) => r[field] === val);
        if (idx === -1) return { data: null, error: { message: 'Not found' } };
        collection.splice(idx, 1);
        return { data: null, error: null };
      },
    }),
  };
}

const supabase = {
  from: (table: string) => createQuery(table),
  // Minimal auth stub kept for compatibility
  auth: {
    signInWithPassword: async (_: { email: string; password: string }) => ({ data: null, error: { message: 'Auth not available in mock' } }),
    signOut: async () => ({ error: { message: 'Auth not available in mock' } }),
    onAuthStateChange: (_cb: any) => ({ data: null, subscription: { unsubscribe: () => {} } }),
    // Return a session-like object to match Supabase client API
    getSession: async () => {
      try {
        if (typeof window !== 'undefined') {
          const logged = localStorage.getItem('gov_auth') === 'true';
          const username = localStorage.getItem('gov_username') || null;
          const session = logged ? { user: { id: username, email: null }, expires_at: null } : null;
          return { data: { session }, error: null };
        }
      } catch (err) {
        // ignore
      }
      return { data: { session: null }, error: null };
    },
  },
};

export { supabase };

export const clearInvalidSession = async () => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('gov-app-auth');
      localStorage.removeItem('gov_auth');
      localStorage.removeItem('gov_username');
    }
  } catch (error) {
    console.error('Error clearing session:', error);
  }
};