
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product, firestore } from '@/lib/firebase';
import { Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProductCardProps {
  product: Product;
  onUpdate: () => void;
}

const ProductCard = ({ product, onUpdate }: ProductCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  
  // Form state
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price.toString());
  const [discountedPrice, setDiscountedPrice] = useState(product.discountedPrice?.toString() || '');
  const [category, setCategory] = useState(product.category);
  const [inStock, setInStock] = useState(product.inStock);
  const [isHotDeal, setIsHotDeal] = useState(product.isHotDeal);
  const [quantity, setQuantity] = useState(product.quantity.toString());
  const [unit, setUnit] = useState(product.unit);

  // Update product
  const handleUpdateProduct = async () => {
    try {
      const updatedProduct = {
        name,
        price: parseFloat(price),
        discountedPrice: discountedPrice ? parseFloat(discountedPrice) : undefined,
        category,
        inStock,
        isHotDeal,
        quantity: parseInt(quantity),
        unit,
        updatedAt: new Date()
      };
      
      await firestore.updateProduct(product.id, updatedProduct);
      toast.success(`Product "${name}" updated successfully`);
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      toast.error('Failed to update product');
    }
  };
  
  // Delete product
  const handleDeleteProduct = async () => {
    try {
      await firestore.deleteProduct(product.id);
      toast.success(`Product "${product.name}" deleted`);
      onUpdate();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };
  
  return (
    <Card className="overflow-hidden hover-lift h-full flex flex-col animate-fade-in">
      <div className="aspect-square relative overflow-hidden bg-gray-100">
        <img 
          src={product.imageUrl || "https://images.unsplash.com/photo-1584473457409-ce95a9a4fc33?q=80&w=2070&auto=format&fit=crop"} 
          alt={product.name}
          className="object-cover w-full h-full transition-transform duration-300 hover:scale-110"
        />
        
        {product.isHotDeal && (
          <Badge className="absolute top-2 right-2 bg-picknpay-orange">
            Hot Deal
          </Badge>
        )}
        
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge className="bg-red-500 text-white text-sm px-3 py-1">
              Out of Stock
            </Badge>
          </div>
        )}
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <div className="font-semibold truncate">{product.name}</div>
          <div className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded-full">
            {product.category}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="flex items-baseline">
          {product.discountedPrice ? (
            <>
              <div className="text-lg font-bold">₹{product.discountedPrice.toFixed(2)}</div>
              <div className="text-sm text-gray-500 line-through ml-2">
                ₹{product.price.toFixed(2)}
              </div>
            </>
          ) : (
            <div className="text-lg font-bold">₹{product.price.toFixed(2)}</div>
          )}
          <div className="text-sm text-gray-500 ml-1">/{product.unit}</div>
        </div>
        <div className="text-sm text-gray-500 mt-1">
          Stock: {product.quantity} {product.unit}s
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between mt-auto pt-2">
        {/* Edit Dialog */}
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex-1 mr-2">
              <Edit className="h-4 w-4 mr-2" /> Edit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
              <DialogDescription>
                Make changes to your product here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Product Name</Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input 
                    id="price" 
                    value={price} 
                    onChange={(e) => setPrice(e.target.value)}
                    type="number"
                    step="0.01"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="discountedPrice">Discounted Price (₹)</Label>
                  <Input 
                    id="discountedPrice" 
                    value={discountedPrice} 
                    onChange={(e) => setDiscountedPrice(e.target.value)}
                    type="number"
                    step="0.01"
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Grains">Grains</SelectItem>
                    <SelectItem value="Dairy">Dairy</SelectItem>
                    <SelectItem value="Baking">Baking</SelectItem>
                    <SelectItem value="Bakery">Bakery</SelectItem>
                    <SelectItem value="Fruits">Fruits</SelectItem>
                    <SelectItem value="Vegetables">Vegetables</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input 
                    id="quantity" 
                    value={quantity} 
                    onChange={(e) => setQuantity(e.target.value)}
                    type="number"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Select value={unit} onValueChange={setUnit}>
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
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="inStock" 
                    checked={inStock} 
                    onCheckedChange={setInStock}
                  />
                  <Label htmlFor="inStock">In Stock</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="hotDeal" 
                    checked={isHotDeal} 
                    onCheckedChange={setIsHotDeal}
                  />
                  <Label htmlFor="hotDeal">Hot Deal</Label>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button 
                type="button" 
                className="bg-picknpay-purple hover:bg-picknpay-purple-dark"
                onClick={handleUpdateProduct}
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Delete Alert Dialog */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex-1">
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the product
                "{product.name}" from your store.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                className="bg-red-600 hover:bg-red-700"
                onClick={handleDeleteProduct}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
