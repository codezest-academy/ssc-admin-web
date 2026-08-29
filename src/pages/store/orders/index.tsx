import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ErrorState } from "@/components/ui/error-state";
import { StoreAPI, type StoreOrder } from "@/api/store";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Package, Truck, CheckCircle2, MapPin, Phone, User as UserIcon } from "lucide-react";
import { toast } from "sonner";

const COLUMNS = [
  { id: "PENDING", title: "Pending", icon: Package, color: "text-amber-500" },
  { id: "PROCESSING", title: "Processing", icon: Truck, color: "text-blue-500" },
  { id: "SHIPPED", title: "Shipped", icon: Truck, color: "text-purple-500" },
  { id: "DELIVERED", title: "Delivered", icon: CheckCircle2, color: "text-green-500" },
];

export default function StoreOrdersPage() {
  const queryClient = useQueryClient();
  const { data: orders = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["store-orders"],
    queryFn: StoreAPI.getOrders,
  });

  const [shippingModalOpen, setShippingModalOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState<StoreOrder | null>(null);
  const [trackingInfo, setTrackingInfo] = useState({ courierName: "", trackingNumber: "" });

  const statusMutation = useMutation({
    mutationFn: ({ id, status, tracking }: { id: string, status: string, tracking?: any }) => 
      StoreAPI.updateOrderStatus(id, { status, ...tracking }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["store-orders"] });
      toast.success("Order status updated");
      setShippingModalOpen(false);
      setActiveOrder(null);
    },
    onError: () => toast.error("Failed to update status"),
  });

  const columnsData = useMemo(() => {
    const cols: Record<string, StoreOrder[]> = {
      PENDING: [],
      PROCESSING: [],
      SHIPPED: [],
      DELIVERED: [],
      CANCELLED: [],
    };
    orders.forEach((order: StoreOrder) => {
      if (cols[order.status]) cols[order.status].push(order);
    });
    return cols;
  }, [orders]);

  const onDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;

    const newStatus = destination.droppableId;
    const orderId = draggableId;
    const order = orders.find((o: StoreOrder) => o.id === orderId);

    if (newStatus === "SHIPPED") {
      // Open modal to collect tracking info
      setActiveOrder(order || null);
      setTrackingInfo({ courierName: order?.courierName || "", trackingNumber: order?.trackingNumber || "" });
      setShippingModalOpen(true);
      return;
    }

    statusMutation.mutate({ id: orderId, status: newStatus });
  };

  if (isError) {
    return (
      <div className="p-8">
        <ErrorState title="Failed to load orders" onRetry={() => refetch()} />
      </div>
    );
  }

  if (isLoading) return <div>Loading orders...</div>;

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-12 pt-4 px-4 h-[calc(100vh-4rem)] flex flex-col">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Fulfillment Board</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Drag and drop orders to update their fulfillment status.
        </p>
      </div>

      <div className="flex-1 flex gap-4 overflow-x-auto pb-4">
        <DragDropContext onDragEnd={onDragEnd}>
          {COLUMNS.map(col => (
            <div key={col.id} className="flex-1 min-w-[300px] flex flex-col bg-muted/30 rounded-xl border border-border">
              <div className="p-3 border-b border-border flex items-center justify-between bg-muted/50 rounded-t-xl">
                <div className="flex items-center gap-2">
                  <col.icon className={`w-4 h-4 ${col.color}`} />
                  <span className="font-semibold">{col.title}</span>
                </div>
                <Badge variant="secondary">{columnsData[col.id].length}</Badge>
              </div>
              
              <Droppable droppableId={col.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 p-3 flex flex-col gap-3 overflow-y-auto transition-colors ${
                      snapshot.isDraggingOver ? "bg-muted/50" : ""
                    }`}
                  >
                    {columnsData[col.id].map((order: StoreOrder, index: number) => (
                      <Draggable key={order.id} draggableId={order.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`bg-card border border-border rounded-lg p-3 shadow-sm ${
                              snapshot.isDragging ? "shadow-md ring-2 ring-primary ring-offset-1" : ""
                            }`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="font-medium text-sm">{order.item.name}</div>
                              <span className="text-xs text-muted-foreground">#{order.id.slice(-6).toUpperCase()}</span>
                            </div>
                            
                            <div className="space-y-2 mb-3">
                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <UserIcon className="w-3.5 h-3.5" />
                                <span className="truncate">{order.user.name}</span>
                              </div>
                              <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
                                <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                                <span className="line-clamp-2">
                                  {order.addressLine1}, {order.city} {order.pincode}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Phone className="w-3.5 h-3.5" />
                                <span>{order.phone}</span>
                              </div>
                            </div>

                            {order.trackingNumber && (
                              <div className="mt-2 pt-2 border-t border-border/50 text-xs flex items-center justify-between">
                                <span className="text-muted-foreground">{order.courierName}</span>
                                <span className="font-mono font-medium">{order.trackingNumber}</span>
                              </div>
                            )}
                            
                            <div className="mt-2 pt-2 border-t border-border/50 text-[10px] text-muted-foreground text-right">
                              {format(new Date(order.createdAt), "MMM d, h:mm a")}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </DragDropContext>
      </div>

      <Dialog open={shippingModalOpen} onOpenChange={setShippingModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Provide Shipping Details</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <p className="text-sm text-muted-foreground">
              You are marking order <strong>#{activeOrder?.id.slice(-6).toUpperCase()}</strong> as Shipped. 
              Please provide tracking info.
            </p>
            <div className="space-y-2">
              <Label>Courier Name</Label>
              <Input 
                placeholder="e.g. BlueDart, Delhivery" 
                value={trackingInfo.courierName}
                onChange={e => setTrackingInfo({...trackingInfo, courierName: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Tracking Number</Label>
              <Input 
                placeholder="e.g. BD123456789IN" 
                value={trackingInfo.trackingNumber}
                onChange={e => setTrackingInfo({...trackingInfo, trackingNumber: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShippingModalOpen(false)}>Cancel</Button>
            <Button 
              disabled={!trackingInfo.courierName || !trackingInfo.trackingNumber || statusMutation.isPending}
              onClick={() => {
                if (activeOrder) {
                  statusMutation.mutate({ 
                    id: activeOrder.id, 
                    status: "SHIPPED", 
                    tracking: trackingInfo 
                  });
                }
              }}
            >
              {statusMutation.isPending ? "Saving..." : "Confirm Shipment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
