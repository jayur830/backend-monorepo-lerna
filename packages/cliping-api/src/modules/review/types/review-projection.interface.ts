export interface ReviewProjection {
  id: number;
  place_id: string;
  title: string;
  content: string | null;
  image_Url: string | null;
  rating: number;
  instagram_post_url: string | null;
  created_at: number;
  updated_at: number;
  user_id: string;
  profile_image_url: string | null;
  review_like_count: number;
}
