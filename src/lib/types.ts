export type Sport = 'Basketball' | 'Soccer' | 'Tennis';

export type Match = {
  id: number;
  sport: Sport;
  location: string;
  district: string;
  dateTime: Date;
  playersJoined: number;
  playersNeeded: number;
  avatar: string;
  image: string;
  organizer: string;
};
