import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Progress } from '../ui/progress';
import { 
  Plus, 
  Minus,
  ShoppingCart,
  Clock,
  DollarSign,
  Calendar,
  Utensils,
  Heart,
  Leaf,
  Shield,
  Star,
  Filter
} from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'main' | 'side' | 'drink' | 'dessert' | 'snack';
  image?: string;
  allergens: string[];
  nutritionalInfo: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isPopular: boolean;
  rating: number;
  availability: 'available' | 'limited' | 'sold_out';
  estimatedTime: number; // in minutes
}

interface Order {
  id: string;
  items: {
    menuItem: MenuItem;
    quantity: number;
    specialInstructions?: string;
  }[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  orderDate: string;
  pickupTime?: string;
  estimatedTime: number;
}

interface MealPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  mealsPerDay: number;
  includedItems: string[];
  isActive: boolean;
}

export function StudentCantine() {
  const [activeTab, setActiveTab] = useState('menu');
  const [cart, setCart] = useState<{menuItem: MenuItem, quantity: number}[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock data
  const mockMenuItems: MenuItem[] = [
    {
      id: '1',
      name: 'Grilled Chicken Caesar Salad',
      description: 'Fresh romaine lettuce, grilled chicken breast, parmesan cheese, and caesar dressing',
      price: 8.99,
      category: 'main',
      allergens: ['dairy', 'gluten'],
      nutritionalInfo: {
        calories: 420,
        protein: 35,
        carbs: 12,
        fat: 28
      },
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false,
      isPopular: true,
      rating: 4.6,
      availability: 'available',
      estimatedTime: 10
    },
    {
      id: '2',
      name: 'Vegetarian Buddha Bowl',
      description: 'Quinoa, roasted vegetables, chickpeas, avocado, and tahini dressing',
      price: 9.49,
      category: 'main',
      allergens: ['sesame'],
      nutritionalInfo: {
        calories: 380,
        protein: 15,
        carbs: 45,
        fat: 18
      },
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: true,
      isPopular: true,
      rating: 4.8,
      availability: 'available',
      estimatedTime: 8
    },
    {
      id: '3',
      name: 'Classic Margherita Pizza',
      description: 'Fresh mozzarella, tomato sauce, basil, and olive oil on crispy crust',
      price: 7.99,
      category: 'main',
      allergens: ['dairy', 'gluten'],
      nutritionalInfo: {
        calories: 520,
        protein: 22,
        carbs: 58,
        fat: 24
      },
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: false,
      isPopular: false,
      rating: 4.3,
      availability: 'limited',
      estimatedTime: 15
    },
    {
      id: '4',
      name: 'Fresh Fruit Smoothie',
      description: 'Blend of seasonal fruits, yogurt, and honey',
      price: 4.49,
      category: 'drink',
      allergens: ['dairy'],
      nutritionalInfo: {
        calories: 180,
        protein: 8,
        carbs: 38,
        fat: 2
      },
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: true,
      isPopular: true,
      rating: 4.5,
      availability: 'available',
      estimatedTime: 3
    },
    {
      id: '5',
      name: 'Chocolate Chip Cookies',
      description: 'Freshly baked cookies with premium chocolate chips',
      price: 2.99,
      category: 'dessert',
      allergens: ['dairy', 'gluten', 'eggs'],
      nutritionalInfo: {
        calories: 320,
        protein: 4,
        carbs: 42,
        fat: 16
      },
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: false,
      isPopular: false,
      rating: 4.4,
      availability: 'available',
      estimatedTime: 2
    }
  ];

  const mockOrders: Order[] = [
    {
      id: '1',
      items: [
        {
          menuItem: mockMenuItems[0],
          quantity: 1,
          specialInstructions: 'Extra dressing on the side'
        },
        {
          menuItem: mockMenuItems[3],
          quantity: 1
        }
      ],
      totalAmount: 13.48,
      status: 'ready',
      orderDate: '2024-10-07',
      pickupTime: '12:30',
      estimatedTime: 10
    },
    {
      id: '2',
      items: [
        {
          menuItem: mockMenuItems[1],
          quantity: 1
        }
      ],
      totalAmount: 9.49,
      status: 'preparing',
      orderDate: '2024-10-07',
      estimatedTime: 5
    }
  ];

  const mockMealPlans: MealPlan[] = [
    {
      id: '1',
      name: 'Basic Meal Plan',
      description: 'Essential meals for students',
      monthlyPrice: 299,
      mealsPerDay: 2,
      includedItems: ['Lunch', 'Dinner', 'Basic beverages'],
      isActive: true
    },
    {
      id: '2',
      name: 'Premium Meal Plan',
      description: 'Full coverage with premium options',
      monthlyPrice: 449,
      mealsPerDay: 3,
      includedItems: ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Premium beverages', 'Desserts'],
      isActive: false
    }
  ];

  const addToCart = (item: MenuItem) => {
    const existingItem = cart.find(cartItem => cartItem.menuItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.menuItem.id === item.id 
          ? {...cartItem, quantity: cartItem.quantity + 1}
          : cartItem
      ));
    } else {
      setCart([...cart, {menuItem: item, quantity: 1}]);
    }
  };

  const removeFromCart = (itemId: string) => {
    const existingItem = cart.find(cartItem => cartItem.menuItem.id === itemId);
    if (existingItem && existingItem.quantity > 1) {
      setCart(cart.map(cartItem => 
        cartItem.menuItem.id === itemId 
          ? {...cartItem, quantity: cartItem.quantity - 1}
          : cartItem
      ));
    } else {
      setCart(cart.filter(cartItem => cartItem.menuItem.id !== itemId));
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.menuItem.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getCategoryColor = (category: MenuItem['category']) => {
    switch (category) {
      case 'main':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'side':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'drink':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'dessert':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'snack':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAvailabilityColor = (availability: MenuItem['availability']) => {
    switch (availability) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'limited':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'sold_out':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'preparing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'ready':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredMenuItems = mockMenuItems.filter(item => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0D1B2A] dark:text-white">Cantine</h1>
          <p className="text-gray-600 dark:text-gray-300">Order meals and manage your meal plan</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="relative">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Cart ({getCartItemCount()})
            {getCartItemCount() > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-[#3E92CC] text-white text-xs px-1 min-w-[20px] h-5">
                {getCartItemCount()}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-[#3E92CC]">{formatPrice(getCartTotal())}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Cart Total</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{mockOrders.filter(o => o.status === 'ready').length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Ready for Pickup</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{mockOrders.filter(o => o.status === 'preparing').length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Being Prepared</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-[#0D1B2A] dark:text-white">{mockMealPlans.filter(p => p.isActive).length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Active Plans</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 max-w-lg">
          <TabsTrigger value="menu">Menu</TabsTrigger>
          <TabsTrigger value="orders">My Orders</TabsTrigger>
          <TabsTrigger value="plans">Meal Plans</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="menu" className="mt-6">
          {/* Category Filter */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-300">Category:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {['all', 'main', 'side', 'drink', 'dessert', 'snack'].map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "bg-[#3E92CC] hover:bg-[#3E92CC]/80" : ""}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Menu Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMenuItems.map((item) => (
              <Card key={item.id} className="border-0 shadow-md bg-white dark:bg-[#1B2B3A] hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className={`text-xs px-2 py-1 ${getCategoryColor(item.category)}`}>
                          {item.category}
                        </Badge>
                        <Badge className={`text-xs px-2 py-1 ${getAvailabilityColor(item.availability)}`}>
                          {item.availability.replace('_', ' ')}
                        </Badge>
                        {item.isPopular && (
                          <Badge variant="outline" className="text-xs px-2 py-1 border-orange-500 text-orange-600">
                            Popular
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg mb-1">{item.name}</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{item.description}</p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-lg font-bold text-[#0D1B2A] dark:text-white">
                        {formatPrice(item.price)}
                      </p>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <Star className="h-3 w-3 text-yellow-500 mr-1" />
                        {item.rating}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Dietary Icons */}
                  <div className="flex items-center space-x-2">
                    {item.isVegetarian && (
                      <div className="flex items-center space-x-1 text-green-600">
                        <Leaf className="h-4 w-4" />
                        <span className="text-xs">Vegetarian</span>
                      </div>
                    )}
                    {item.isVegan && (
                      <div className="flex items-center space-x-1 text-green-700">
                        <Heart className="h-4 w-4" />
                        <span className="text-xs">Vegan</span>
                      </div>
                    )}
                    {item.isGlutenFree && (
                      <div className="flex items-center space-x-1 text-blue-600">
                        <Shield className="h-4 w-4" />
                        <span className="text-xs">Gluten-Free</span>
                      </div>
                    )}
                  </div>

                  {/* Nutritional Info */}
                  <div className="p-3 bg-gray-50 dark:bg-[#0D1B2A]/50 rounded-lg">
                    <p className="text-sm font-medium text-[#0D1B2A] dark:text-white mb-2">Nutrition (per serving):</p>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-300">
                      <span>Calories: {item.nutritionalInfo.calories}</span>
                      <span>Protein: {item.nutritionalInfo.protein}g</span>
                      <span>Carbs: {item.nutritionalInfo.carbs}g</span>
                      <span>Fat: {item.nutritionalInfo.fat}g</span>
                    </div>
                  </div>

                  {/* Allergens */}
                  {item.allergens.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-[#0D1B2A] dark:text-white mb-2">Allergens:</p>
                      <div className="flex flex-wrap gap-1">
                        {item.allergens.map((allergen, index) => (
                          <Badge key={index} variant="outline" className="text-xs px-2 py-1 border-red-300 text-red-600">
                            {allergen}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Estimated Time */}
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Clock className="h-4 w-4 mr-1 text-[#3E92CC]" />
                    <span>Ready in ~{item.estimatedTime} minutes</span>
                  </div>

                  {/* Add to Cart */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        disabled={!cart.find(cartItem => cartItem.menuItem.id === item.id)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="text-sm font-medium min-w-[20px] text-center">
                        {cart.find(cartItem => cartItem.menuItem.id === item.id)?.quantity || 0}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addToCart(item)}
                        disabled={item.availability === 'sold_out'}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => addToCart(item)}
                      disabled={item.availability === 'sold_out'}
                      className="bg-[#3E92CC] hover:bg-[#3E92CC]/80"
                    >
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="orders" className="mt-6">
          <div className="space-y-4">
            {mockOrders.map((order) => (
              <Card key={order.id} className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Placed on {order.orderDate}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge className={`text-sm px-3 py-1 ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                      <p className="text-lg font-bold text-[#0D1B2A] dark:text-white mt-1">
                        {formatPrice(order.totalAmount)}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#0D1B2A]/50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-[#0D1B2A] dark:text-white">
                            {item.quantity}x {item.menuItem.name}
                          </p>
                          {item.specialInstructions && (
                            <p className="text-sm text-gray-600 dark:text-gray-300 italic">
                              Note: {item.specialInstructions}
                            </p>
                          )}
                        </div>
                        <span className="font-medium text-[#0D1B2A] dark:text-white">
                          {formatPrice(item.menuItem.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Order Status */}
                  {order.status === 'preparing' && (
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                          Your order is being prepared
                        </span>
                        <span className="text-sm text-yellow-600 dark:text-yellow-400">
                          ~{order.estimatedTime} minutes remaining
                        </span>
                      </div>
                      <Progress value={60} className="h-2" />
                    </div>
                  )}

                  {order.status === 'ready' && (
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <p className="text-sm font-medium text-green-700 dark:text-green-300">
                        Your order is ready for pickup!
                      </p>
                      {order.pickupTime && (
                        <p className="text-sm text-green-600 dark:text-green-400">
                          Pickup by: {order.pickupTime}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center space-x-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    {order.status === 'ready' && (
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        Mark as Picked Up
                      </Button>
                    )}
                    {(order.status === 'pending' || order.status === 'confirmed') && (
                      <Button variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-50">
                        Cancel Order
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="plans" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockMealPlans.map((plan) => (
              <Card key={plan.id} className={`border-0 shadow-md hover:shadow-lg transition-shadow ${
                plan.isActive ? 'ring-2 ring-[#3E92CC] bg-blue-50 dark:bg-blue-900/20' : 'bg-white dark:bg-[#1B2B3A]'
              }`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    {plan.isActive && (
                      <Badge className="bg-[#3E92CC] text-white">Active</Badge>
                    )}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">{plan.description}</p>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="text-center p-4 bg-gray-50 dark:bg-[#0D1B2A]/50 rounded-lg">
                    <p className="text-3xl font-bold text-[#0D1B2A] dark:text-white">
                      {formatPrice(plan.monthlyPrice)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">per month</p>
                  </div>

                  <div>
                    <p className="font-medium text-[#0D1B2A] dark:text-white mb-2">
                      {plan.mealsPerDay} meals per day
                    </p>
                    <div className="space-y-1">
                      {plan.includedItems.map((item, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <div className="w-2 h-2 bg-[#3E92CC] rounded-full mr-2"></div>
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button 
                    className={`w-full ${
                      plan.isActive 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-[#3E92CC] hover:bg-[#3E92CC]/80'
                    }`}
                    disabled={plan.isActive}
                  >
                    {plan.isActive ? 'Current Plan' : 'Subscribe'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
            <CardHeader>
              <CardTitle>Order History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Utensils className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-[#0D1B2A] dark:text-white mb-2">
                  No order history yet
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Your completed orders will appear here.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Floating Cart Summary */}
      {getCartItemCount() > 0 && (
        <div className="fixed bottom-6 right-6 z-50">
          <Card className="border-0 shadow-lg bg-[#3E92CC] text-white min-w-[200px]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Cart ({getCartItemCount()} items)</span>
                <span className="font-bold">{formatPrice(getCartTotal())}</span>
              </div>
              <Button className="w-full bg-white text-[#3E92CC] hover:bg-gray-100">
                Checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}