
import React, { useState } from 'react';
import SideNav from '@/components/SideNav';
import DashboardHeader from '@/components/DashboardHeader';
import ProductCard from '@/components/ProductCard';
import { mockProducts, Product, firestore } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Filter } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

const Products = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [showOutOfStock, setShowOutOfStock] = useState(true);
  const [showHotDealsOnly, setShowHotDealsOnly] = useState(false);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    discountedPrice: '',
    category: 'Grocery',
    inStock: true,
    isHotDeal: false,
    quantity: '1',
    unit: 'kg',
    imageUrl: ''
  });
  
  const handleProductUpdate = () => {
    console.log('Product updated');
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };
  
  const handleAddProduct = async () => {
    try {
      const product = {
        name: newProduct.name,
        price: parseFloat(newProduct.price),
        discountedPrice: newProduct.discountedPrice ? parseFloat(newProduct.discountedPrice) : undefined,
        category: newProduct.category,
        inStock: newProduct.inStock,
        isHotDeal: newProduct.isHotDeal,
        quantity: parseInt(newProduct.quantity),
        unit: newProduct.unit,
        imageUrl: newProduct.imageUrl || undefined
      };
      
      await firestore.addProduct(product);
      toast.success(`Product "${newProduct.name}" added successfully`);
      setIsAddDialogOpen(false);
      setNewProduct({
        name: '',
        price: '',
        discountedPrice: '',
        category: 'Grocery',
        inStock: true,
        isHotDeal: false,
        quantity: '1',
        unit: 'kg',
        imageUrl: ''
      });
      
    } catch (error) {
      toast.error('Failed to add product');
    }
  };
  
  const filteredProducts = products.filter((product) => {
    const matchesSearch = searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = category === '' || product.category === category;
    
    const matchesStock = showOutOfStock || product.inStock;
    
    const matchesHotDeal = !showHotDealsOnly || product.isHotDeal;
    
    return matchesSearch && matchesCategory && matchesStock && matchesHotDeal;
  });
  
  const categories = Array.from(new Set(products.map(p => p.category)));
  
  return (
    <div className="dashboard-layout">
      <SideNav className="dashboard-sidebar" />
      
      <DashboardHeader title="Product Management" />
      
      <main className="dashboard-main p-6 overflow-y-auto bg-gray-50">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Search and actions */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                className="pl-10"
                placeholder="Search products by name or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              className="lg:w-auto"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="mr-2 h-4 w-4" /> Filters
            </Button>
            
            {/* Add Product Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-picknpay-purple hover:bg-picknpay-purple-dark lg:w-auto">
                  <Plus className="mr-2 h-4 w-4" /> Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                  <DialogDescription>
                    Fill in the details below to add a new product to your inventory.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input 
                      id="name" 
                      name="name"
                      value={newProduct.name} 
                      onChange={handleInputChange}
                      placeholder="Basmati Rice"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="price">Price (₹) *</Label>
                      <Input 
                        id="price" 
                        name="price"
                        value={newProduct.price} 
                        onChange={handleInputChange}
                        type="number"
                        step="0.01"
                        placeholder="25.00"
                        required
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="discountedPrice">Discounted Price (₹)</Label>
                      <Input 
                        id="discountedPrice" 
                        name="discountedPrice"
                        value={newProduct.discountedPrice} 
                        onChange={handleInputChange}
                        type="number"
                        step="0.01"
                        placeholder="20.00"
                      />
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select 
                      value={newProduct.category} 
                      onValueChange={(value) => setNewProduct({...newProduct, category: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Grocery">Grocery</SelectItem>
                        <SelectItem value="Grains">Grains</SelectItem>
                        <SelectItem value="Dairy">Dairy</SelectItem>
                        <SelectItem value="Baking">Baking</SelectItem>
                        <SelectItem value="Bakery">Bakery</SelectItem>
                        <SelectItem value="Fruits">Fruits</SelectItem>
                        <SelectItem value="Vegetables">Vegetables</SelectItem>
                        <SelectItem value="Medical">Medical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="quantity">Quantity *</Label>
                      <Input 
                        id="quantity" 
                        name="quantity"
                        value={newProduct.quantity} 
                        onChange={handleInputChange}
                        type="number"
                        placeholder="10"
                        required
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="unit">Unit *</Label>
                      <Select 
                        value={newProduct.unit} 
                        onValueChange={(value) => setNewProduct({...newProduct, unit: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kg">kg</SelectItem>
                          <SelectItem value="L">L</SelectItem>
                          <SelectItem value="piece">piece</SelectItem>
                          <SelectItem value="dozen">dozen</SelectItem>
                          <SelectItem value="loaf">loaf</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input 
                      id="imageUrl" 
                      name="imageUrl"
                      value={newProduct.imageUrl} 
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="inStock" 
                        checked={newProduct.inStock} 
                        onCheckedChange={(checked) => 
                          setNewProduct({...newProduct, inStock: checked})
                        }
                      />
                      <Label htmlFor="inStock">In Stock</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="hotDeal" 
                        checked={newProduct.isHotDeal} 
                        onCheckedChange={(checked) => 
                          setNewProduct({...newProduct, isHotDeal: checked})
                        }
                      />
                      <Label htmlFor="hotDeal">Hot Deal</Label>
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="button" 
                    className="bg-picknpay-purple hover:bg-picknpay-purple-dark"
                    onClick={handleAddProduct}
                    disabled={!newProduct.name || !newProduct.price || !newProduct.quantity}
                  >
                    Add Product
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          {/* Filters section */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-white rounded-lg shadow-sm border animate-fade-in">
              <div>
                <Label htmlFor="category-filter">Filter by Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="out-of-stock" 
                  checked={showOutOfStock} 
                  onCheckedChange={(checked) => setShowOutOfStock(checked as boolean)}
                />
                <Label htmlFor="out-of-stock">Show Out of Stock</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="hot-deals" 
                  checked={showHotDealsOnly} 
                  onCheckedChange={(checked) => setShowHotDealsOnly(checked as boolean)}
                />
                <Label htmlFor="hot-deals">Hot Deals Only</Label>
              </div>
              
              <Button variant="outline" onClick={() => {
                setCategory('');
                setShowOutOfStock(true);
                setShowHotDealsOnly(false);
              }}>
                Reset Filters
              </Button>
            </div>
          )}
          
          {/* Products grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onUpdate={handleProductUpdate}
                />
              ))
            ) : (
              <div className="col-span-full text-center p-8">
                <h3 className="text-lg font-medium">No products found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search or filter to find what you're looking for.
                </p>
                <Button 
                  onClick={() => setIsAddDialogOpen(true)}
                  className="bg-picknpay-purple hover:bg-picknpay-purple-dark"
                >
                  Add New Product
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Products;
