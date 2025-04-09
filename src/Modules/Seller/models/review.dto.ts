

export interface ReviewModel {
  comments_amount: number;
  dislikes_amount: number;
  id: string;
  is_rating_participant: boolean;
  likes_amount: number;
  order_status: string;
  photos: string; // JSON string
  photos_amount: number;
  published_at: Date;
  rating: number;
  sku: number;
  status: string;
  text: string;
  videos: string; // JSON string
  videos_amount: number;
}