interface IReviewItem {
  id: string;
  fileName: string;
  date: string;
}

export interface ReviewListProps {
  reviewList: IReviewItem[];
}
