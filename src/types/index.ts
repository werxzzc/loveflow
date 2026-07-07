export type ClientStatus = 'active' | 'inactive';

export interface Client {
  id: string;
  name: string;
  telegram: string | null;
  token: string;
  credits_total: number;
  credits_used: number;
  status: ClientStatus;
  comment: string | null;
  created_at: string;
  last_activity: string;
}

export type InvitationStatus = 'draft' | 'pending' | 'completed';

export interface Answer {
  id: string;
  text: string;
  emoji: string;
  color: string;
  is_runaway: boolean;
}

export interface Question {
  id: string;
  text: string;
  emoji: string;
  answers: Answer[];
}

export interface InvitationCustomColors {
  primary?: string;
  accent?: string;
  background?: string;
  text?: string;
}

export interface Invitation {
  id: string;
  client_id: string;
  token: string;
  girl_name: string;
  title: string;
  subtitle: string;
  welcome_message: string;
  description: string;
  final_message: string;
  theme: ThemeId;
  custom_colors: InvitationCustomColors;
  font: string;
  questions: Question[];
  status: InvitationStatus;
  created_at: string;
  completed_at: string | null;
}

export interface ResultAnswer {
  question_id: string;
  question_text: string;
  answer_text: string;
  answer_emoji: string;
  answer_color: string;
}

export interface Result {
  id: string;
  invitation_id: string;
  result_token: string;
  girl_name: string;
  answers: ResultAnswer[];
  time_taken_seconds: number;
  completed_at: string;
}

export type ThemeId = 'sakura' | 'sunset' | 'beach' | 'galaxy' | 'coffee' | 'minimal';

export interface Theme {
  id: ThemeId;
  name: string;
  emoji: string;
  description: string;
  colors: {
    primary: string;
    primaryLight: string;
    accent: string;
    bg: string;
    bgSecondary: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    buttonText: string;
  };
  gradient: string;
  particleType: 'petals' | 'stars' | 'bubbles' | 'none' | 'leaves' | 'snowflakes';
  fontStyle: 'romantic' | 'elegant' | 'playful' | 'cosmic' | 'cozy' | 'clean';
  animation: 'float' | 'twinkle' | 'drift' | 'pulse' | 'none';
}

export interface QuestionTemplate {
  id: string;
  name: string;
  emoji: string;
  description: string;
  questions: Omit<Question, 'id'>[];
}
