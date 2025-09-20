export type UserRole = 'admin' | 'user';

export type Brand = {
  id: string;
  name: string;
  channels: Channel[];
};

export type Channel = 'Chat' | 'Email' | 'Voice' | 'Pre-sales';

export type FAQ = {
  id: string;
  qaid: string;
  question: string;
  canonicalAnswer: string;
  brands: string[];
  channels: Channel[];
  status: 'Draft' | 'SIT' | 'PROD';
  tags: string[];
  ticketParameters: Record<string, string>;
  similarUtterances: string[];
  lastUpdated: string;
  createdBy: string;
  versions: FAQVersion[];
};

export type FAQVersion = {
  id: string;
  version: number;
  question: string;
  canonicalAnswer: string;
  timestamp: string;
  author: string;
  changeType: 'Created' | 'Updated' | 'Published' | 'Reverted';
  environment: 'Draft' | 'SIT' | 'PROD';
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  assignedBrands: string[];
};

export type BulkUploadResult = {
  status: 'accepted' | 'duplicate' | 'error';
  qaid?: string;
  suggestedQaid?: string;
  reason?: string;
  row: number;
};

export type AnalyticsEntry = {
  id: string;
  timestamp: string;
  queryText: string;
  servedQaid: string;
  matchMethod: string;
  matchScore: number;
  brand: string;
  channel: Channel;
};

export type PublishRequest = {
  id: string;
  qaid: string;
  requestedBy: string;
  requestedAt: string;
  environment: 'SIT' | 'PROD';
  status: 'Pending' | 'Approved' | 'Rejected';
  approvedBy?: string;
  approvedAt?: string;
};

export interface AppContextType {
  currentUser: User;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
}