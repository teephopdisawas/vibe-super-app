
export enum Feature {
  StoryWeaver = 'StoryWeaver',
  ImageSpark = 'ImageSpark',
  CodeCompanion = 'CodeCompanion',
  TravelPlanner = 'TravelPlanner',
  KnowledgeSeeker = 'KnowledgeSeeker',
  WordProcessor = 'WordProcessor',
  Spreadsheet = 'Spreadsheet',
  PresentationMaker = 'PresentationMaker',
  Calculator = 'Calculator',
}

export interface DayPlan {
  day: number;
  title: string;
  activities: string[];
  food_suggestions: string;
}

export interface Itinerary {
  trip_title: string;
  days: DayPlan[];
}

export interface GroundingChunk {
  web: {
    uri: string;
    title: string;
  };
}
