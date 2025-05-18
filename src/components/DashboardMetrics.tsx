
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUp, ArrowDown, Package, ShoppingCart, Users } from 'lucide-react';
import { mockOrders } from '@/lib/firebase';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';

// Mock data for charts
const salesData = [
  { name: 'Mon', value: 400 },
  { name: 'Tue', value: 300 },
  { name: 'Wed', value: 500 },
  { name: 'Thu', value: 280 },
  { name: 'Fri', value: 590 },
  { name: 'Sat', value: 800 },
  { name: 'Sun', value: 700 }
];

const DashboardMetrics = () => {
  // Calculate metrics from orders
  const totalOrders = mockOrders.length;
  const totalRevenue = mockOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const pendingOrders = mockOrders.filter(order => order.status === 'pending').length;
  
  const metrics = [
    {
      title: "Total Revenue",
      value: `₹${totalRevenue.toFixed(2)}`,
      change: "+12.5%",
      trend: "up",
      icon: <Package className="h-5 w-5" />
    },
    {
      title: "Total Orders",
      value: totalOrders,
      change: "+8.2%",
      trend: "up",
      icon: <ShoppingCart className="h-5 w-5" />
    },
    {
      title: "New Customers",
      value: "18",
      change: "+4.9%",
      trend: "up",
      icon: <Users className="h-5 w-5" />
    },
    {
      title: "Pending Orders",
      value: pendingOrders,
      change: "-2.3%",
      trend: "down",
      icon: <ShoppingCart className="h-5 w-5" />
    }
  ];
  
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index} className="hover-lift animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                {metric.title}
              </CardTitle>
              <div className={cn(
                "p-2 rounded-full",
                metric.trend === "up" ? "bg-green-100" : "bg-red-100"
              )}>
                {metric.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs flex items-center mt-1">
                {metric.trend === "up" ? (
                  <ArrowUp className="text-green-500 mr-1 h-4 w-4" />
                ) : (
                  <ArrowDown className="text-red-500 mr-1 h-4 w-4" />
                )}
                <span className={cn(
                  metric.trend === "up" ? "text-green-500" : "text-red-500"
                )}>
                  {metric.change} from last week
                </span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Sales Chart */}
      <Card className="animate-fade-in" style={{ animationDelay: '400ms' }}>
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={salesData}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#9b87f5" 
                  fill="url(#colorGradient)" 
                />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9b87f5" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#9b87f5" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardMetrics;
