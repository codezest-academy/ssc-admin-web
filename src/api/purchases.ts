import { api } from "@/lib/axios";

export interface Purchase {
  id: string;
  studentId: string;
  productId: string;
  amountPaid: number;
  status: "PENDING" | "SUCCESS" | "FAILED";
  razorpayOrderId: string | null;
  paymentRefId: string | null;
  createdAt: string;
  updatedAt: string;
  product?: {
    name: string;
    type: string;
  };
  student?: {
    name: string;
    email: string;
  };
}

export const getAllPurchases = async (): Promise<Purchase[]> => {
  const { data } = await api.get("/payments/admin/purchases");
  return data;
};
