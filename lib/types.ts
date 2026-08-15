export interface Actor {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department: string;
  popularity: number;
}

export interface ActorSuggestion {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department: string;
}

export interface ActorDetails {
  id: number;
  name: string;
  profile_path: string | null;
}

export interface MovieCredit {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  character: string;
  vote_average: number;
}

export interface Movie {
  tmdbId: number;
  imdbId: string;
  title: string;
  poster_path: string | null;
  year: string;
  character: string;
  imdbRating: number;
  imdbVotes: string;
}

export interface ActorPageData {
  actor: ActorDetails;
  movies: Movie[];
}
