import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllPurchases } from "@/api/purchases";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, IndianRupee } from "lucide-react";
import { TableSkeleton } from "@/components/ui/loading-skeletons";

export default function PurchasesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: purchases, isLoading } = useQuery({
    queryKey: ["purchases"],
    queryFn: getAllPurchases,
  });

  const filteredPurchases = purchases?.filter(
    (p) =>
      p.student?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.student?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.product?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.paymentRefId?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return (
          <Badge className="bg-success/10 text-success border-none">
            Success
          </Badge>
        );
      case "PENDING":
        return (
          <Badge
            variant="secondary"
            className="bg-warning/10 text-warning border-none"
          >
            Pending
          </Badge>
        );
      case "FAILED":
        return (
          <Badge
            variant="destructive"
            className="bg-destructive/10 text-destructive border-none"
          >
            Failed
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const totalRevenue =
    purchases
      ?.filter((p) => p.status === "SUCCESS")
      .reduce((sum, p) => sum + p.amountPaid, 0) || 0;

  if (isLoading) {
    return <TableSkeleton />;
  }

  return (
    <div className="space-y-6 max-w-full w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Sales & Purchases
          </h1>
          <p className="text-muted-foreground mt-1">
            View all transactions, subscriptions, and product sales.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-primary/10 text-primary px-4 py-2 rounded-lg border border-primary/20">
          <IndianRupee className="w-5 h-5" />
          <div className="flex flex-col">
            <span className="text-xs uppercase font-semibold">
              Total Revenue
            </span>
            <span className="text-xl font-bold leading-none">
              ₹{totalRevenue}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-card p-4 rounded-xl border shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by student, email, product, or ref ID..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Date</TableHead>
              <TableHead>Student</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Ref ID</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPurchases?.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-32 text-center text-muted-foreground"
                >
                  No purchases found.
                </TableCell>
              </TableRow>
            ) : (
              filteredPurchases?.map((purchase) => (
                <TableRow key={purchase.id}>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {new Date(purchase.createdAt).toLocaleDateString()}
                    <br />
                    <span className="text-xs">
                      {new Date(purchase.createdAt).toLocaleTimeString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{purchase.student?.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {purchase.student?.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium line-clamp-1">
                      {purchase.product?.name}
                    </div>
                    <Badge variant="outline" className="mt-1 text-xs">
                      {purchase.product?.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    ₹{purchase.amountPaid}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {purchase.paymentRefId || "-"}
                  </TableCell>
                  <TableCell>{getStatusBadge(purchase.status)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
