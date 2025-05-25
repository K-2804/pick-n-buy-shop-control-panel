
import React, { useState } from 'react';
import SideNav from '@/components/SideNav';
import DashboardHeader from '@/components/DashboardHeader';
import OrderCard from '@/components/OrderCard';
import { Order } from '@/lib/firebase';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useEffect } from 'react';
import { realFirestore } from '@/lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';

const Orders = () => {
  
  const [searchQuery, setSearchQuery] = useState('');

  const [orders, setOrders] = useState<Order[]>([]);

useEffect(() => {
  const unsubscribe = onSnapshot(collection(realFirestore, 'orders'), (snapshot) => {
    const liveOrders = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Order[];

    setOrders(liveOrders);
  });

  return () => unsubscribe(); // stop listening when page unmounts
}, []);
  
  const handleOrderStatusUpdate = () => {
    // In a real app, you would refresh the orders from Firebase
    console.log('Order status updated');
  };
  
  const filterOrders = (status?: Order['status']) => {
    let filteredOrders = [...orders];
    
    // Filter by status if provided
    if (status) {
      filteredOrders = filteredOrders.filter(order => order.status === status);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredOrders = filteredOrders.filter(order => 
        order.customerName.toLowerCase().includes(query) ||
        order.customerPhone.includes(query) ||
        order.id.toLowerCase().includes(query) ||
        order.orderItems.some(item => item.productName.toLowerCase().includes(query))
      );
    }
    
    return filteredOrders;
  };
  
  const pendingOrders = filterOrders('pending');
  const packedOrders = filterOrders('packed');
  const completedOrders = filterOrders('completed');
  const cancelledOrders = filterOrders('cancelled');
  const allOrders = filterOrders();
  
  return (
    <div className="dashboard-layout">
      <SideNav className="dashboard-sidebar" />
      
      <DashboardHeader title="Order Management" />
      
      <main className="dashboard-main p-6 overflow-y-auto bg-gray-50">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Search and filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                className="pl-10"
                placeholder="Search orders by customer name, order ID or product..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button className="bg-picknpay-purple hover:bg-picknpay-purple-dark">
              Export Orders
            </Button>
          </div>
          
          {/* Tabs for order status */}
          <Tabs defaultValue="all" className="w-full animate-fade-in">
            <TabsList className="grid grid-cols-5">
              <TabsTrigger value="all">
                All ({allOrders.length})
              </TabsTrigger>
              <TabsTrigger value="pending">
                Pending ({pendingOrders.length})
              </TabsTrigger>
              <TabsTrigger value="packed">
                Packed ({packedOrders.length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed ({completedOrders.length})
              </TabsTrigger>
              <TabsTrigger value="cancelled">
                Cancelled ({cancelledOrders.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allOrders.length > 0 ? (
                  allOrders.map((order) => (
                    <OrderCard 
                      key={order.id} 
                      order={order} 
                      onStatusUpdate={handleOrderStatusUpdate}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center p-8">
                    <h3 className="text-lg font-medium">No orders found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search or filter to find what you're looking for.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="pending" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingOrders.length > 0 ? (
                  pendingOrders.map((order) => (
                    <OrderCard 
                      key={order.id} 
                      order={order} 
                      onStatusUpdate={handleOrderStatusUpdate}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center p-8">
                    <h3 className="text-lg font-medium">No pending orders</h3>
                    <p className="text-muted-foreground">
                      All caught up! There are no pending orders at the moment.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="packed" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packedOrders.length > 0 ? (
                  packedOrders.map((order) => (
                    <OrderCard 
                      key={order.id} 
                      order={order} 
                      onStatusUpdate={handleOrderStatusUpdate}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center p-8">
                    <h3 className="text-lg font-medium">No packed orders</h3>
                    <p className="text-muted-foreground">
                      All orders have been completed or are still pending.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="completed" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedOrders.length > 0 ? (
                  completedOrders.map((order) => (
                    <OrderCard 
                      key={order.id} 
                      order={order} 
                      onStatusUpdate={handleOrderStatusUpdate}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center p-8">
                    <h3 className="text-lg font-medium">No completed orders</h3>
                    <p className="text-muted-foreground">
                      Orders that are delivered will appear here.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="cancelled" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cancelledOrders.length > 0 ? (
                  cancelledOrders.map((order) => (
                    <OrderCard 
                      key={order.id} 
                      order={order} 
                      onStatusUpdate={handleOrderStatusUpdate}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center p-8">
                    <h3 className="text-lg font-medium">No cancelled orders</h3>
                    <p className="text-muted-foreground">
                      Great! You don't have any cancelled orders.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Orders;
