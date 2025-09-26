export interface User {
  userId: string;
  username: string;
  subscriptionTier: 'free' | 'premium' | 'pro';
  preferredStyle: ResponseStyle;
  savedResponses: string[];
  personaSettings: PersonaSettings;
}

export interface Response {
  responseId: string;
  originalQuery: string;
  generatedText: string;
  styleTag: ResponseStyle;
  contextTag: ContextType;
}

export interface SavedResponse {
  savedResponseId: string;
  userId: string;
  responseId: string;
  customNotes?: string;
}

export interface PracticeSession {
  sessionId: string;
  userId: string;
  scenarioType: ScenarioType;
  userResponse: string;
  aiFeedback: string;
  timestamp: Date;
}

export type ResponseStyle = 'sarcastic' | 'humorous' | 'playful' | 'witty' | 'clever';

export type ContextType = 'social_media' | 'work' | 'party' | 'personal' | 'general';

export type ScenarioType = 'awkward_party' | 'work_meeting' | 'social_media_troll' | 'interview' | 'date';

export interface PersonaSettings {
  tone: 'soft' | 'bold' | 'balanced';
  humor_level: 'subtle' | 'moderate' | 'bold';
  sarcasm_level: 'light' | 'medium' | 'heavy';
}

export interface GenerateResponseRequest {
  query: string;
  style: ResponseStyle;
  context: ContextType;
  userId?: string;
}

export interface GenerateResponseResponse {
  responses: Response[];
  success: boolean;
  error?: string;
}
