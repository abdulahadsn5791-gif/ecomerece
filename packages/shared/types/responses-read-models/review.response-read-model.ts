export type ReviewResponseReadModel = {
  _id: string;
  productId: string;
  authorName: string;
  authorAvatar: string;
  rating: number;
  title: string;
  dislikes: number;
  likes: number;
  comment: string;
  images: string[];
  isVerifiedPurchase: boolean;
  vendorReply: string | null;
  createdAt: Date;
};
