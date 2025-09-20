import { Brand, FAQ, User, AnalyticsEntry, PublishRequest, Channel } from '@/types';

export const mockBrands: Brand[] = [
  {
    id: 'brand-a',
    name: 'Brand A',
    channels: ['Chat', 'Email', 'Voice']
  },
  {
    id: 'brand-b', 
    name: 'Brand B',
    channels: ['Chat', 'Pre-sales']
  }
];

export const mockUsers: User[] = [
  {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@company.com',
    role: 'admin',
    assignedBrands: ['brand-a', 'brand-b']
  },
  {
    id: 'user-1',
    name: 'FAQ Editor',
    email: 'editor@company.com',
    role: 'user',
    assignedBrands: ['brand-a']
  }
];

export const mockFAQs: FAQ[] = [
  {
    id: 'faq-1',
    qaid: 'QA1001',
    question: 'How do I reset my password?',
    canonicalAnswer: '1. Go to login page\n2. Click "Forgot Password"\n3. Enter your email\n4. Check your inbox for reset link',
    brands: ['brand-a'],
    channels: ['Chat', 'Email'],
    status: 'PROD',
    tags: ['password', 'login', 'account'],
    ticketParameters: {
      'category': 'account',
      'priority': 'medium',
      'department': 'support'
    },
    similarUtterances: ['reset password', 'forgot password', 'password recovery'],
    lastUpdated: '2024-01-15',
    createdBy: 'user-1',
    versions: [
      {
        id: 'v1',
        version: 1,
        question: 'How do I reset my password?',
        canonicalAnswer: '1. Go to login page\n2. Click "Forgot Password"\n3. Enter your email\n4. Check your inbox for reset link',
        timestamp: '2024-01-15T10:30:00Z',
        author: 'user-1',
        changeType: 'Created',
        environment: 'Draft'
      }
    ]
  },
  {
    id: 'faq-2',
    qaid: 'QA1002',
    question: 'What are your business hours?',
    canonicalAnswer: 'Our support team is available:\n- Monday to Friday: 9 AM to 6 PM EST\n- Saturday: 10 AM to 4 PM EST\n- Sunday: Closed',
    brands: ['brand-a', 'brand-b'],
    channels: ['Chat', 'Email', 'Voice'],
    status: 'SIT',
    tags: ['hours', 'availability', 'support'],
    ticketParameters: {
      'category': 'general',
      'priority': 'low'
    },
    similarUtterances: ['business hours', 'when are you open', 'support hours'],
    lastUpdated: '2024-01-14',
    createdBy: 'admin-1',
    versions: []
  },
  {
    id: 'faq-3',
    qaid: 'QA1003',
    question: 'How do I cancel my subscription?',
    canonicalAnswer: 'To cancel your subscription:\n1. Log into your account\n2. Go to Billing & Subscriptions\n3. Click "Cancel Subscription"\n4. Follow the confirmation steps',
    brands: ['brand-b'],
    channels: ['Chat', 'Pre-sales'],
    status: 'Draft',
    tags: ['subscription', 'billing', 'cancel'],
    ticketParameters: {
      'category': 'billing',
      'priority': 'high'
    },
    similarUtterances: ['cancel subscription', 'stop billing', 'end subscription'],
    lastUpdated: '2024-01-16',
    createdBy: 'user-1',
    versions: []
  }
];

export const mockAnalytics: AnalyticsEntry[] = [
  {
    id: 'analytics-1',
    timestamp: '2024-01-16T14:30:00Z',
    queryText: 'how to reset ***',
    servedQaid: 'QA1001',
    matchMethod: 'semantic',
    matchScore: 0.95,
    brand: 'Brand A',
    channel: 'Chat'
  },
  {
    id: 'analytics-2',
    timestamp: '2024-01-16T14:25:00Z',
    queryText: 'business hours ***',
    servedQaid: 'QA1002',
    matchMethod: 'keyword',
    matchScore: 0.87,
    brand: 'Brand B',
    channel: 'Email'
  }
];

export const mockPublishRequests: PublishRequest[] = [
  {
    id: 'pub-1',
    qaid: 'QA1003',
    requestedBy: 'user-1',
    requestedAt: '2024-01-16T15:00:00Z',
    environment: 'PROD',
    status: 'Pending'
  }
];