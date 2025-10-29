export interface ILemonSqueezyProduct {
  id: string;
  type: string;
  attributes: {
    name: string;
    slug: string;
    description: string;
    status: string;
    status_formatted: string;
    price: number;
    created_at: string;
    updated_at: string;
    large_thumb_url: string;
    buy_now_url: string;
  };
}

export interface ILemonSqueezyResponse<T> {
  meta: {
    page: {
      currentPage: number;
      from: number;
      lastPage: number;
      perPage: number;
      to: number;
      total: number;
    };
  };
  jsonapi: {
    version: string;
  };
  links: {
    first: string;
    last: string;
    next?: string;
    prev?: string;
  };
  data: T;
}
