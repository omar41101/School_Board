import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { Switch } from '../ui/switch';
import { Progress } from '../ui/progress';
import { 
  Utensils, 
  Plus, 
  Search, 
  Filter, 
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  DollarSign,
  Users,
  ShoppingCart,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  Leaf,
  Package
} from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'starter' | 'main' | 'dessert' | 'drink';
  image: string;
  available: boolean;
  allergens: string[];
  nutritional: {
    calories: number;
    proteins: number;
    carbs: number;
    fats: number;
  };
  vegetarian: boolean;
  vegan: boolean;
}

interface DailyMenu {
  id: string;
  date: string;
  starter: MenuItem[];
  main: MenuItem[];
  dessert: MenuItem[];
  drink: MenuItem[];
  totalOrders: number;
  revenue: number;
}

interface Order {
  id: string;
  studentId: string;
  studentName: string;
  studentClass: string;
  items: {
    menuItem: MenuItem;
    quantity: number;
  }[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'prepared' | 'served' | 'cancelled';
  orderTime: string;
  scheduledFor: string;
}

export function CantinePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const mockMenuItems: MenuItem[] = [
    {
      id: '1',
      name: 'Salade César',
      description: 'Salade fraîche avec croûtons, parmesan et sauce césar',
      price: 8.50,
      category: 'starter',
      image: '/api/placeholder/150/150',
      available: true,
      allergens: ['gluten', 'dairy'],
      nutritional: { calories: 320, proteins: 12, carbs: 18, fats: 24 },
      vegetarian: true,
      vegan: false
    },
    {
      id: '2',
      name: 'Burger Végétarien',
      description: 'Burger maison avec steak végétal, légumes frais et frites',
      price: 12.00,
      category: 'main',
      image: '/api/placeholder/150/150',
      available: true,
      allergens: ['gluten'],
      nutritional: { calories: 580, proteins: 22, carbs: 65, fats: 18 },
      vegetarian: true,
      vegan: true
    },
    {
      id: '3',
      name: 'Tiramisu',
      description: 'Dessert italien traditionnel au café et mascarpone',
      price: 5.50,
      category: 'dessert',
      image: '/api/placeholder/150/150',
      available: true,
      allergens: ['dairy', 'eggs'],
      nutritional: { calories: 280, proteins: 6, carbs: 32, fats: 14 },
      vegetarian: true,
      vegan: false
    },
    {
      id: '4',
      name: 'Jus d\'Orange Frais',
      description: 'Jus d\'orange pressé maison, 100% naturel',
      price: 3.50,
      category: 'drink',
      image: '/api/placeholder/150/150',
      available: true,
      allergens: [],
      nutritional: { calories: 112, proteins: 2, carbs: 26, fats: 0 },
      vegetarian: true,
      vegan: true
    }
  ];

  const mockOrders: Order[] = [
    {
      id: 'ORD001',
      studentId: 'STU001',
      studentName: 'Emma Johnson',
      studentClass: '10-A',
      items: [
        { menuItem: mockMenuItems[0], quantity: 1 },
        { menuItem: mockMenuItems[1], quantity: 1 }
      ],
      totalAmount: 20.50,
      status: 'confirmed',
      orderTime: '2024-01-20 10:30',
      scheduledFor: '2024-01-20 12:30'
    },
    {
      id: 'ORD002',
      studentId: 'STU002',
      studentName: 'Lucas Martin',
      studentClass: '11-B',
      items: [
        { menuItem: mockMenuItems[1], quantity: 1 },
        { menuItem: mockMenuItems[3], quantity: 2 }
      ],
      totalAmount: 19.00,
      status: 'prepared',
      orderTime: '2024-01-20 11:15',
      scheduledFor: '2024-01-20 13:00'
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'starter': return '🥗';
      case 'main': return '🍽️';
      case 'dessert': return '🍰';
      case 'drink': return '🥤';
      default: return '🍽️';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'prepared': return 'bg-purple-100 text-purple-800';
      case 'served': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0D1B2A] dark:text-white">Cantine Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage menus, orders, and food services</p>
        </div>
        <Button className="bg-[#0D1B2A] hover:bg-[#1B2B3A] text-white">
          <Plus className="mr-2 h-4 w-4" />
          Add Menu Item
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="h-8 w-8 text-[#3E92CC]" />
              <div>
                <p className="text-2xl font-bold text-[#0D1B2A] dark:text-white">147</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Orders Today</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold text-[#0D1B2A] dark:text-white">€1,847</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Revenue Today</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-[#3E92CC]" />
              <div>
                <p className="text-2xl font-bold text-[#0D1B2A] dark:text-white">89</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Students</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold text-[#0D1B2A] dark:text-white">94%</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Satisfaction Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="menu" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="menu">Menu Items</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="planning">Menu Planning</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="menu" className="mt-6">
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1 max-w-md">
                <Input 
                  placeholder="Search menu items..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="starter">Starters</SelectItem>
                  <SelectItem value="main">Main Courses</SelectItem>
                  <SelectItem value="dessert">Desserts</SelectItem>
                  <SelectItem value="drink">Drinks</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {mockMenuItems.map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow duration-200">
                  <div className="relative">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-40 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-2 right-2">
                      {item.vegetarian && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800 mr-1">
                          <Leaf className="mr-1 h-3 w-3" />
                          Veggie
                        </Badge>
                      )}
                    </div>
                    <div className="absolute top-2 left-2">
                      <span className="text-2xl">{getCategoryIcon(item.category)}</span>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-[#0D1B2A] dark:text-white">{item.name}</h3>
                      <div className="flex items-center">
                        <Switch checked={item.available} />
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {item.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-[#3E92CC]">€{item.price}</span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm">4.5</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-xs">
                        <span>Calories</span>
                        <span>{item.nutritional.calories} kcal</span>
                      </div>
                      <div className="flex space-x-2 text-xs">
                        <span>P: {item.nutritional.proteins}g</span>
                        <span>C: {item.nutritional.carbs}g</span>
                        <span>F: {item.nutritional.fats}g</span>
                      </div>
                    </div>
                    
                    {item.allergens.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-1">Allergens:</p>
                        <div className="flex flex-wrap gap-1">
                          {item.allergens.map((allergen) => (
                            <Badge key={allergen} variant="outline" className="text-xs">
                              {allergen}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="mr-1 h-3 w-3" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="orders" className="mt-6">
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1 max-w-md">
                <Input placeholder="Search orders..." />
              </div>
              <Select>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Order Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="prepared">Prepared</SelectItem>
                  <SelectItem value="served">Served</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Today
              </Button>
            </div>

            <div className="space-y-4">
              {mockOrders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <Avatar>
                          <AvatarFallback>{order.studentName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-[#0D1B2A] dark:text-white">
                              {order.studentName}
                            </h3>
                            <Badge variant="outline">{order.studentClass}</Badge>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                          </div>
                          
                          <div className="space-y-2 mb-3">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex items-center justify-between text-sm">
                                <span>{item.quantity}x {item.menuItem.name}</span>
                                <span>€{(item.menuItem.price * item.quantity).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                          
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>Ordered: {order.orderTime}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>Scheduled: {order.scheduledFor}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-bold text-[#3E92CC]">€{order.totalAmount.toFixed(2)}</p>
                          <p className="text-xs text-gray-500">Order #{order.id}</p>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {order.status === 'pending' && (
                            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                              <CheckCircle className="mr-1 h-4 w-4" />
                              Confirm
                            </Button>
                          )}
                          {order.status === 'confirmed' && (
                            <Button size="sm" className="bg-[#3E92CC] hover:bg-[#2E82BC] text-white">
                              <Package className="mr-1 h-4 w-4" />
                              Prepare
                            </Button>
                          )}
                          {order.status === 'prepared' && (
                            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                              <CheckCircle className="mr-1 h-4 w-4" />
                              Serve
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="planning" className="mt-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[#0D1B2A] dark:text-white">Weekly Menu Planning</h2>
              <Button className="bg-[#0D1B2A] hover:bg-[#1B2B3A] text-white">
                <Plus className="mr-2 h-4 w-4" />
                Plan Menu
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => (
                <Card key={day} className="min-h-96">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-center text-sm">{day}</CardTitle>
                    <p className="text-center text-xs text-gray-500">Jan {21 + index}</p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400">Starter</h4>
                      <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded text-xs">
                        {index < 5 ? 'Salade César' : 'Not planned'}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400">Main</h4>
                      <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded text-xs">
                        {index < 5 ? 'Burger Végétarien' : 'Not planned'}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400">Dessert</h4>
                      <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded text-xs">
                        {index < 5 ? 'Tiramisu' : 'Not planned'}
                      </div>
                    </div>
                    
                    <Button size="sm" variant="outline" className="w-full">
                      <Edit className="mr-1 h-3 w-3" />
                      Edit
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Popular Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Burger Végétarien</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={85} className="w-20" />
                      <span className="text-sm">85%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Salade César</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={72} className="w-20" />
                      <span className="text-sm">72%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Tiramisu</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={68} className="w-20" />
                      <span className="text-sm">68%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Jus d'Orange</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={91} className="w-20" />
                      <span className="text-sm">91%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-[#3E92CC] rounded-full"></div>
                      <span>Main Courses</span>
                    </div>
                    <span className="font-medium">€847 (46%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-[#0D1B2A] rounded-full"></div>
                      <span>Drinks</span>
                    </div>
                    <span className="font-medium">€412 (22%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>Starters</span>
                    </div>
                    <span className="font-medium">€368 (20%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span>Desserts</span>
                    </div>
                    <span className="font-medium">€220 (12%)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Cantine Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Online Ordering</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Allow students to order online</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Advance Booking</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Allow orders for future dates</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-2">
                  <Label>Order Deadline</Label>
                  <Input type="time" defaultValue="10:00" />
                  <p className="text-xs text-gray-500">Orders must be placed before this time</p>
                </div>

                <div className="space-y-2">
                  <Label>Service Hours</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input type="time" defaultValue="11:30" placeholder="Start" />
                    <Input type="time" defaultValue="14:00" placeholder="End" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Prepaid System</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Require account balance</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Daily Limits</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Set spending limits per day</p>
                  </div>
                  <Switch />
                </div>

                <div className="space-y-2">
                  <Label>Default Daily Limit</Label>
                  <Input type="number" defaultValue="25" />
                  <p className="text-xs text-gray-500">Maximum amount per student per day (€)</p>
                </div>

                <div className="space-y-2">
                  <Label>Low Balance Alert</Label>
                  <Input type="number" defaultValue="10" />
                  <p className="text-xs text-gray-500">Send alert when balance is below this amount (€)</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}