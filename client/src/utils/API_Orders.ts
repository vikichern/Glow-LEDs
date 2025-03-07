import axios from "axios";
import { create_query } from "./helper_functions";

const order_routes = {
  last_months_orders: () => {
    return axios.get("/api/orders/previous_income/30");
  },
  findAll_orders_a: () => {
    return axios.get("/api/orders/?limit=0&page=1");
  },
  findById_orders_a: (order_id: string) => {
    return axios.get("/api/orders/guest/" + order_id);
  },
  get_invoice: (order: object) => {
    return axios.put("/api/orders/invoice", order);
  },
  top_customers: () => {
    return axios.get("/api/orders/top_customers");
  },
  monthly_expenses: (date_1: string, date_2: string) => {
    return axios.put("/api/expenses/monthly_expenses", { date_1, date_2 });
  },
  income: (year: number, month: string) => {
    return axios.get(`/api/orders/income${year ? "/" + year : ""}${month ? "/" + month : ""}`);
  },
  all_affiliate_code_usage_orders_a: (arg: any) => {
    return axios.get(
      `/api/orders/all_affiliate_code_usage/${arg.year}${arg.month ? "/" + arg.month : ""}${
        arg.position ? `?position=${arg.position}` : ""
      }`
    );
  },
  affiliate_code_usage_orders_a: (promo_code: string, query: any) => {
    return axios.get(`/api/orders/affiliate_code_usage/${promo_code}?${create_query(query)}`);
  },
  promo_code_usage_orders_a: (year: number, month: string, query: string) => {
    //
    return axios.get(`/api/orders/promo_code_usage/${year}${month ? "/" + month : ""}?${create_query(query)}`);
  },
  // yearly_income: (year: number) => {
  // 	return axios.get(`/api/orders/yearly_income/${year}`);
  // },
  yearly_expenses: (date_1: string, date_2: string) => {
    return axios.put("/api/expenses/yearly_expenses", { date_1, date_2 });
  },
  total_expenses: () => {
    return axios.get("/api/expenses/total_expenses");
  },
  mark_as_shipped: () => {
    //
    return axios.put("/api/orders/mark_as_shipped");
  }
};

export default order_routes;
