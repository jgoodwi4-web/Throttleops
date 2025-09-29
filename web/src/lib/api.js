const TOKEN_KEY = 'throttleops_token'
const USER_KEY = 'throttleops_user'

export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const setToken = (t) => localStorage.setItem(TOKEN_KEY, t)
export const setUser = (u) => localStorage.setItem(USER_KEY, JSON.stringify(u||null))
export const getUser = () => { try { return JSON.parse(localStorage.getItem(USER_KEY)||'null') } catch { return null } }
export const logout = () => { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY) }

const req = async (path, opts={}) => {
  const token = getToken()
  const headers = { 'Content-Type':'application/json', ...(opts.headers||{}) }
  if (token) headers.Authorization = `Bearer ${token}`
  const res = await fetch(path, { ...opts, headers })
  const data = await res.json().catch(()=> ({}))
  if (!res.ok) throw new Error(data.error || res.statusText)
  return data
}

export const api = {
  login: (email,password) => req('/api/auth/login',{ method:'POST', body: JSON.stringify({email,password}) }),
  register: (name,email,password,role) => req('/api/auth/register',{ method:'POST', body: JSON.stringify({name,email,password,role}) }),

  drivers: {
    list: () => req('/api/drivers'),
    create: (payload) => req('/api/drivers',{ method:'POST', body: JSON.stringify(payload) }),
    update: (id, payload) => req(`/api/drivers/${id}`,{ method:'PATCH', body: JSON.stringify(payload) }),
    del: (id) => req(`/api/drivers/${id}`,{ method:'DELETE' }),
  },

  vehicles: {
    list: () => req('/api/vehicles'),
    create: (payload) => req('/api/vehicles',{ method:'POST', body: JSON.stringify(payload) }),
    update: (id, payload) => req(`/api/vehicles/${id}`,{ method:'PATCH', body: JSON.stringify(payload) }),
    del: (id) => req(`/api/vehicles/${id}`,{ method:'DELETE' }),
  },

  loads: {
    list: () => req('/api/loads'),
    create: (payload) => req('/api/loads',{ method:'POST', body: JSON.stringify(payload) }),
    update: (id, payload) => req(`/api/loads/${id}`,{ method:'PATCH', body: JSON.stringify(payload) }),
    track: (id, lat, lng) => req(`/api/loads/${id}/track`,{ method:'POST', body: JSON.stringify({lat,lng}) })
  },

  invoices: {
    list: () => req('/api/invoices'),
    fromLoad: (loadId) => req(`/api/invoices/from-load/${loadId}`, { method:'POST' }),
    markPaid: (id) => req(`/api/invoices/${id}/paid`, { method:'POST' }),
  },

  logs: {
    list: (driverId) => req('/api/logs' + (driverId?`?driverId=${driverId}`:'')),
    upsert: (payload) => req('/api/logs',{ method:'POST', body: JSON.stringify(payload) }),
    sign: (id, signedBy) => req(`/api/logs/${id}/sign`,{ method:'POST', body: JSON.stringify({signedBy}) }),
  },

  weight: {
    reference: () => req('/api/weight/reference')
  }
}
