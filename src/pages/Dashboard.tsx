
import React from 'react';
import SideNav from '@/components/SideNav';
import DashboardHeader from '@/components/DashboardHeader';
import DashboardMetrics from '@/components/DashboardMetrics';
import OrderCard from '@/components/OrderCard';
import ProductCard from '@/components/ProductCard';
import { mockOrders, mockProducts } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  // Get 3 most recent orders
  const recentOrders = [...mockOrders]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 3);
  
  const hotDeals = mockProducts.filter(product => product.isHotDeal).slice(0, 3);
  
  const handleOrderStatusUpdate = () => {
    console.log('Order status updated');
    // In a real app, you would refresh the orders from Firebase
  };
  
  const handleProductUpdate = () => {
    console.log('Product updated');
    // In a real app, you would refresh the products from Firebase
  };
  
  return (
    <div className="dashboard-layout">
      <SideNav className="dashboard-sidebar" />
      
      <DashboardHeader title="Dashboard" />
      
      <main className="dashboard-main p-6 overflow-y-auto bg-gray-50">
        <div className="space-y-6 max-w-7xl mx-auto">
          {/* Metrics */}
          <DashboardMetrics />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Orders */}
            <Card className="animate-fade-in" style={{ animationDelay: '500ms' }}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Manage your latest customer orders</CardDescription>
                </div>
                <Link to="/orders">
                  <Button variant="ghost" className="text-picknpay-purple">
                    View All <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentOrders.map((order) => (
                  <OrderCard 
                    key={order.id} 
                    order={order} 
                    onStatusUpdate={handleOrderStatusUpdate} 
                  />
                ))}
                
                {recentOrders.length === 0 && (
                  <div className="text-center p-6">
                    <p className="text-muted-foreground">No recent orders</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Hot Deals */}
            <Card className="animate-fade-in" style={{ animationDelay: '600ms' }}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Hot Deals</CardTitle>
                  <CardDescription>Your discounted products</CardDescription>
                </div>
                <Link to="/products">
                  <Button variant="ghost" className="text-picknpay-purple">
                    Manage Products <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {hotDeals.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      onUpdate={handleProductUpdate} 
                    />
                  ))}
                  
                  {hotDeals.length === 0 && (
                    <div className="col-span-3 text-center p-6">
                      <p className="text-muted-foreground">No hot deals available</p>
                      <Button className="mt-4 bg-picknpay-purple">
                        Create Hot Deal
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
