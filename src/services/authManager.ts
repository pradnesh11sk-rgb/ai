// Zero-Trust Client Authentication & Profile Manager
// Handles secure demo authentication, session state, and user profile management

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  workspace: string;
  accountStatus: 'Active' | 'Pending' | 'Suspended';
  securityStatus: 'Protected' | 'Unprotected';
  lastLogin: string;
  activeSessions: number;
  avatarInitials: string;
  twoFactorEnabled: boolean;
}

const AUTH_STORAGE_KEY = 'trustwall_auth_session';

type AuthListener = (user: UserProfile | null) => void;
const listeners: Set<AuthListener> = new Set();

export function getCurrentUser(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY) || sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Failed to parse auth session', e);
  }
  return null;
}

export function notifyListeners(user: UserProfile | null): void {
  listeners.forEach(fn => fn(user));
}

export function subscribeAuth(listener: AuthListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export async function loginWithCredentials(
  email: string,
  password: string,
  rememberMe: boolean = true
): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
  // Simulate secure network latency (250ms)
  await new Promise(r => setTimeout(r, 250));

  const trimmedEmail = email.trim().toLowerCase();

  // Basic validation
  if (!trimmedEmail) {
    return { success: false, error: 'Email address is required.' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedEmail)) {
    return { success: false, error: 'Please enter a valid email address.' };
  }
  if (!password || password.trim().length === 0) {
    return { success: false, error: 'Password is required to authenticate.' };
  }
  if (password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters.' };
  }

  // Generate clean display name from email if not specific
  let displayName = 'SecOps Analyst';
  if (trimmedEmail.includes('john')) displayName = 'John Doe';
  else if (trimmedEmail.includes('sarah')) displayName = 'Sarah Connor';
  else {
    const prefix = trimmedEmail.split('@')[0];
    displayName = prefix.charAt(0).toUpperCase() + prefix.slice(1).replace(/[^a-zA-Z]/g, ' ');
  }

  const initials = displayName
    .split(' ')
    .map(p => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'TW';

  const user: UserProfile = {
    id: `usr_${Date.now().toString(36)}`,
    name: displayName,
    email: trimmedEmail,
    role: 'Security Operations & AI Auditor',
    workspace: 'Enterprise Zero-Trust Enclave',
    accountStatus: 'Active',
    securityStatus: 'Protected',
    lastLogin: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    activeSessions: 1,
    avatarInitials: initials,
    twoFactorEnabled: true
  };

  try {
    const serialized = JSON.stringify(user);
    if (rememberMe) {
      localStorage.setItem(AUTH_STORAGE_KEY, serialized);
    } else {
      sessionStorage.setItem(AUTH_STORAGE_KEY, serialized);
    }
  } catch (e) {
    // Storage fallback
  }

  notifyListeners(user);
  return { success: true, user };
}

export async function createDemoAccount(
  name: string,
  email: string,
  password: string
): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
  await new Promise(r => setTimeout(r, 250));

  const trimmedName = name.trim();
  const trimmedEmail = email.trim().toLowerCase();

  if (!trimmedName) {
    return { success: false, error: 'Full name is required.' };
  }
  if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    return { success: false, error: 'A valid email address is required.' };
  }
  if (!password || password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters.' };
  }

  const initials = trimmedName
    .split(' ')
    .map(p => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'TW';

  const user: UserProfile = {
    id: `usr_${Date.now().toString(36)}`,
    name: trimmedName,
    email: trimmedEmail,
    role: 'AI Infrastructure Lead',
    workspace: 'Production Guardrail Workspace',
    accountStatus: 'Active',
    securityStatus: 'Protected',
    lastLogin: 'Just now',
    activeSessions: 1,
    avatarInitials: initials,
    twoFactorEnabled: true
  };

  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  } catch (e) {
    // Storage fallback
  }

  notifyListeners(user);
  return { success: true, user };
}

export function logoutUser(): void {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (e) {
    // Fallback
  }
  notifyListeners(null);
}
