
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Order } from '@/lib/firebase';
import { Check, Package, Clock, X } from 'lucide-react';
import { toast } from 'sonner';
import { firestore } from '@/lib/firebase';

interface OrderCardProps {
  order: Order;
  onStatusUpdate: () => void;
}

const OrderCard = ({ order, onStatusUpdate }: OrderCardProps) => {
  const { id, customerName, customerPhone, orderItems, totalAmount, status, createdAt } = order;
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'packed':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };
  
  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'packed':
        return <Package className="h-4 w-4" />;
      case 'completed':
        return <Check className="h-4 w-4" />;
      case 'cancelled':
        return <X className="h-4 w-4" />;
      default:
        return null;
    }
  };
  
  const handleUpdateStatus = async (newStatus: Order['status']) => {
    try {
      await firestore.updateOrderStatus(id, newStatus);
      toast.success(`Order #${id.slice(-4)} marked as ${newStatus}`);
      onStatusUpdate();
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };
  
  return (
    <Card className="hover-lift overflow-hidden animate-fade-in">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg">Order #{id.slice(-4)}</CardTitle>
            <p className="text-sm text-gray-500">{formatDate(createdAt)}</p>
          </div>
          <Badge className={`${getStatusColor(status)} flex items-center gap-1 px-2 py-1`}>
            {getStatusIcon(status)}
            <span className="capitalize">{status}</span>
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pb-0">
        <div className="space-y-3">
          <div>
            <p className="text-sm font-semibold">Customer Details</p>
            <div className="flex flex-col text-sm text-gray-600">
              <span>{customerName}</span>
              <span>{customerPhone}</span>
            </div>
          </div>
          
          <div>
            <p className="text-sm font-semibold">Items ({orderItems.length})</p>
            <div className="space-y-1.5 mt-1.5">
              {orderItems.map((item, index) => (
                <div key={index} className="flex justify-between text-sm border-b border-gray-100 pb-1">
                  <span className="truncate max-w-[200px]">
                    {item.productName} x{item.quantity}
                  </span>
                  <span className="font-medium">₹{(Number(item.price) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between items-center pt-4 mt-3 border-t border-gray-100">
        <div className="font-semibold">
          Total: ₹{totalAmount.toFixed(2)}
        </div>
        
        <div className="flex gap-2">
          {status === 'pending' && (
            <Button 
              size="sm" 
              onClick={() => handleUpdateStatus('packed')}
              className="bg-picknpay-purple hover:bg-picknpay-purple-dark"
            >
              Mark Packed
            </Button>
          )}
          
          {status === 'packed' && (
            <Button 
              size="sm" 
              onClick={() => handleUpdateStatus('completed')}
              className="bg-green-600 hover:bg-green-700"
            >
              Complete
            </Button>
          )}
          
          {(status === 'pending' || status === 'packed') && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleUpdateStatus('cancelled')}
            >
              Cancel
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default OrderCard;
