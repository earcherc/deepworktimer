// models.d.ts

// Enum types
enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

enum ConnectionStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  BLOCKED = 'BLOCKED',
}

// UserProfile model
type UserProfile = {
  id: number;
  user_id: number;
  first_name: string | null;
  last_name: string | null;
  date_of_birth: string | null; // Date in ISO string format
  gender: Gender | null;
  interested_in_gender: Gender | null;
  latitude: number | null;
  longitude: number | null;
  profile_photos: ProfilePhoto[] | null;
  sent_connections: Connection[] | null;
  received_connections: Connection[] | null;
  user_details: UserProfileDetails | null;
};

// ProfilePhoto model
type ProfilePhoto = {
  id: number;
  user_profile_id: number;
  url: string;
  caption: string | null;
  is_main: boolean;
  uploaded_at: string; // Date in ISO string format
};

// Connection model
type Connection = {
  id: number;
  user_profile1_id: number;
  user_profile2_id: number;
  status: ConnectionStatus;
  created_at: string; // Date in ISO string format
};

// UserProfileDetails model
type UserProfileDetails = {
  user_profile_id: number;
  bio: string | null;
  job_title: string | null;
  company: string | null;
  school: string | null;
  hobbies: string | null;
  favorite_music: string | null;
  favorite_movies: string | null;
  favorite_books: string | null;
};

// User model
type User = {
  id: number;
  username: string;
  email: string;
  password: string;
  disabled: boolean;
};
