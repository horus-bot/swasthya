
// In-memory mock supabase client for hospital-app
// Replaces @supabase/supabase-js during local development/testing.

const now = () => new Date().toISOString();

const mockDb: Record<string, any[]> = {
  appointments: [
    {
      id: 'appt-1',
      created_at: now(),
      name: 'Test Patient',
      email: 'patient@example.com',
      phone: '9999999999',
      emergency_contact: null,
      depart: 'General',
      preferred_doc: 'Dr. Mock',
      appointment_date: now(),
      preferred_time: '10:00',
      d_o_birth: '1990-01-01'
    }
  ],
  advisories: [
    {
      id: 'adv-1',
      title: 'Mock advisory',
      category: 'General',
      severity: 'Info',
      message: 'This is mock advisory data',
      payload: {},
      created_at: now()
    }
  ],
  bed_status: [
    { id: 'bs-1', hospital_id: 'h-1', total_beds: 100, available_beds: 20, occupied_beds: 80, updated_at: now() }
  ],
  beds: [],
  equipment: [],
  hospitals: [ { id: 'h-1', name: 'Mock Hospital', city: 'Mockville' } ],
};

function ensure(name: string) {
  if (!mockDb[name]) mockDb[name] = [];
  return mockDb[name];
}

function clone(v: any) {
  return JSON.parse(JSON.stringify(v));
}

function parseOrFilter(orString: string, arr: any[]) {
  // supports patterns like: "title.ilike.%foo%,message.ilike.%foo%"
  const parts = orString.split(',');
  const q = parts.map((p) => p.trim()).map((p) => {
    const [lhs, rest] = p.split('.ilike.');
    if (rest) {
      const val = rest.replace(/%/g, '');
      return (item: any) => String(item[lhs] ?? '').toLowerCase().includes(val.toLowerCase());
    }
    return () => false;
  });
  return arr.filter((item) => q.some((fn) => fn(item)));
}

function createQuery(table: string) {
  const coll = ensure(table);
  let working = clone(coll);
  const filters: any[] = [];
  let orderField: string | null = null;
  let ascending = true;
  let lim: number | null = null;
  let singleFlag = false;

  const buildResult = () => {
    let res = working.slice();
    // apply filters
    for (const f of filters) {
      if (f.type === 'eq') res = res.filter((r: any) => r[f.field] === f.val);
      if (f.type === 'is') res = res.filter((r: any) => (f.val === null ? r[f.field] === null : r[f.field] === f.val));
    }
    if (orderField) {
      res = res.slice().sort((a: any, b: any) => {
        const ta = new Date(a[orderField]).getTime();
        const tb = new Date(b[orderField]).getTime();
        return ascending ? ta - tb : tb - ta;
      });
    }
    if (lim != null) res = res.slice(0, lim);
    if (singleFlag) return { data: res[0] ?? null, error: null };
    return { data: res, error: null };
  };

  const q: any = {
    select: (_fields?: string) => q,
    order: (field: string, opts?: { ascending?: boolean }) => {
      orderField = field;
      ascending = opts?.ascending ?? true;
      return { then: async (cb: any) => cb(buildResult()) };
    },
    eq: (field: string, val: any) => {
      filters.push({ type: 'eq', field, val });
      return q;
    },
    is: (field: string, val: any) => {
      filters.push({ type: 'is', field, val });
      return q;
    },
    limit: (n: number) => { lim = n; return q; },
    single: async () => {
      singleFlag = true;
      const r = buildResult();
      // return an object matching the real Supabase client: { data, error }
      return { data: r.data ?? null, error: null };
    },
    insert: async (items: any[] | any) => {
      const arr = Array.isArray(items) ? items : [items];
      const inserted = arr.map((it: any) => {
        const obj = { ...it };
        if (!obj.id) obj.id = `${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
        if (!obj.created_at) obj.created_at = now();
        coll.unshift(obj);
        return obj;
      });
      return { data: inserted, error: null };
    },
    update: (updates: any) => ({
      eq: async (field: string, val: any) => {
        const idx = coll.findIndex((r: any) => r[field] === val);
        if (idx === -1) return { data: null, error: { message: 'Not found' } };
        coll[idx] = { ...coll[idx], ...updates };
        return { data: [coll[idx]], error: null };
      }
    }),
    delete: () => ({
      eq: async (field: string, val: any) => {
        const idx = coll.findIndex((r: any) => r[field] === val);
        if (idx === -1) return { data: null, error: { message: 'Not found' } };
        coll.splice(idx, 1);
        return { data: null, error: null };
      }
    }),
    or: (orString: string) => {
      working = parseOrFilter(orString, working);
      return q;
    },
    then: async (cb: any) => cb(buildResult()),
  };

  return q;
}

const supabase = {
  from: (table: string) => createQuery(table),
  auth: {
    signInWithPassword: async (_: { email: string; password: string }) => ({ data: null, error: { message: 'Auth not available in mock' } }),
    signOut: async () => ({ error: { message: 'Auth not available in mock' } }),
    onAuthStateChange: (_cb: any) => ({ data: null, subscription: { unsubscribe: () => {} } }),
    // Return a session-like object to match Supabase client API
    getSession: async () => {
      try {
        if (typeof window !== 'undefined') {
          const logged = localStorage.getItem('hospital_auth') === 'true';
          const id = localStorage.getItem('hospital_id') || null;
          const name = localStorage.getItem('hospital_name') || null;
          const session = logged ? { user: { id, name }, expires_at: null } : null;
          return { data: { session }, error: null };
        }
      } catch (err) {
        // ignore
      }
      return { data: { session: null }, error: null };
    },
  }
};

export { supabase };

export const clearInvalidSession = async () => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('hospital-app-auth');
      localStorage.removeItem('hospital_id');
    }
  } catch (error) {
    console.error('Error clearing session:', error);
  }
};