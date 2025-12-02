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

export interface ILemonSqueezyOrderWebhook {
  data: {
    id: string;
    type: "orders";
    links: {
      self: string;
    };
    attributes: {
      tax: number;
      urls: {
        receipt: string;
      };
      total: number;
      status: string;
      tax_usd: number;
      currency: string;
      refunded: boolean;
      store_id: number;
      subtotal: number;
      tax_name: string;
      tax_rate: number;
      setup_fee: number;
      test_mode: boolean;
      total_usd: number;
      user_name: string;
      created_at: string;
      identifier: string;
      updated_at: string;
      user_email: string;
      customer_id: number;
      refunded_at: string | null;
      order_number: number;
      subtotal_usd: number;
      currency_rate: string;
      setup_fee_usd: number;
      tax_formatted: string;
      tax_inclusive: boolean;
      discount_total: number;
      refunded_amount: number;
      total_formatted: string;
      first_order_item: {
        id: number;
        price: number;
        order_id: number;
        price_id: number;
        quantity: number;
        test_mode: boolean;
        created_at: string;
        product_id: number;
        updated_at: string;
        variant_id: number;
        product_name: string;
        variant_name: string;
      };
      status_formatted: string;
      discount_total_usd: number;
      subtotal_formatted: string;
      refunded_amount_usd: number;
      setup_fee_formatted: string;
      discount_total_formatted: string;
      refunded_amount_formatted: string;
    };
  };
  meta: {
    test_mode: boolean;
    event_name: string;
    webhook_id: string;
    custom_data: {
      userId: string;
      courseId: string;
    };
  };
}
