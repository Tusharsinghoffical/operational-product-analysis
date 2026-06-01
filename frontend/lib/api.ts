const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Helper to get auth token from localStorage
function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
}

// Helper to add auth header to fetch requests
function getAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface Insight {
  id: number;
  message: string;
  severity: string;
  timestamp: string;
}

export interface UploadResponse {
  message: string;
  insights: Insight[];
}

export interface HealthMetrics {
  healthScore: number;
  salesStability: number;
  inventoryAccuracy: number;
  expenseControl: number;
}

export interface RiskItem {
  id: number;
  date: string;
  riskType: string;
  severity: 'High' | 'Medium' | 'Low';
  status: 'Active' | 'Investigating' | 'Resolved';
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function normalizeSeverity(severity: string): 'high' | 'medium' | 'low' {
  const s = (severity || '').toLowerCase();
  if (s === 'high' || s === 'medium' || s === 'low') return s;
  return 'low';
}

export function buildHealthMetricsFromInsights(insights: Insight[]): HealthMetrics {
  const severityCounts = insights.reduce(
    (acc, insight) => {
      const key = normalizeSeverity(insight.severity);
      acc[key] += 1;
      return acc;
    },
    { high: 0, medium: 0, low: 0 }
  );

  const healthScore = clamp(
    100 - severityCounts.high * 12 - severityCounts.medium * 6 - severityCounts.low * 2,
    30,
    98
  );
  const salesStability = clamp(95 - severityCounts.high * 8 - severityCounts.medium * 4, 35, 96);
  const inventoryAccuracy = clamp(92 - severityCounts.high * 6 - severityCounts.medium * 3, 30, 95);
  const expenseControl = clamp(90 - severityCounts.high * 7 - severityCounts.medium * 3, 30, 94);

  return {
    healthScore,
    salesStability,
    inventoryAccuracy,
    expenseControl,
  };
}

export function mapInsightsToRisks(insights: Insight[]): RiskItem[] {
  return insights.map((insight, index) => {
    const severity = normalizeSeverity(insight.severity);
    const date = insight.timestamp
      ? new Date(insight.timestamp).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];

    return {
      id: insight.id,
      date,
      riskType: insight.message.substring(0, 60) + (insight.message.length > 60 ? '...' : ''),
      severity: (severity.charAt(0).toUpperCase() + severity.slice(1)) as 'High' | 'Medium' | 'Low',
      status: index === 0 ? 'Active' : index <= 2 ? 'Investigating' : 'Resolved',
    };
  });
}

// Authentication API Calls
export async function signup(name: string, email: string, password: string): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Signup failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Error during signup:', error);
    throw error;
  }
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Login failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
}

export async function getProfile(): Promise<User> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
}

// API Calls
export async function fetchInsights(): Promise<Insight[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/insights`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    // If unauthorized, clear invalid token
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return [];
    }
    
    if (!response.ok) throw new Error('Failed to fetch insights');
    return await response.json();
  } catch (error) {
    console.error('Error fetching insights:', error);
    return [];
  }
}

export async function uploadSalesData(file: File): Promise<UploadResponse> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('Not authenticated. Please login again.');
    }
    
    const headers: HeadersInit = {};
    headers['Authorization'] = `Bearer ${token}`;
    
    const response = await fetch(`${API_BASE_URL}/upload/sales`, {
      method: 'POST',
      headers: headers,
      body: formData,
    });
    
    // If unauthorized, clear invalid token and redirect
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      throw new Error('Session expired. Please login again.');
    }
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Upload failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

export async function fetchHealthMetrics(): Promise<HealthMetrics> {
  const insights = await fetchInsights();
  return buildHealthMetricsFromInsights(insights);
}

export async function fetchRisks(): Promise<RiskItem[]> {
  const insights = await fetchInsights();
  return mapInsightsToRisks(insights);
}
