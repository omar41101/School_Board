import { useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import {
  useGetStudentMeQuery,
  useGetCantineQuery,
  useCreateCantineOrderMutation,
} from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import {
  Plus,
  Minus,
  ShoppingCart,
  Clock,
  DollarSign,
  Calendar,
  Utensils,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import type { Cantine } from '../../types';

const MEAL_TYPES = ['breakfast', 'lunch', 'snack', 'dinner'] as const;
const COMMON_ITEMS = [
  { name: 'Sandwich', price: 3.5 },
  { name: 'Salad', price: 4.0 },
  { name: 'Soup', price: 2.5 },
  { name: 'Fruit', price: 1.5 },
  { name: 'Juice', price: 2.0 },
  { name: 'Water', price: 1.0 },
];

export function StudentCantine() {
  const { user } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('orders');
  const [cart, setCart] = useState<{ name: string; price: number; quantity: number }[]>([]);
  const [mealType, setMealType] = useState<string>('lunch');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [orderDate, setOrderDate] = useState(
    new Date().toISOString().split('T')[0],
  );

  const { data: studentMeData } = useGetStudentMeQuery(undefined, {
    skip: (user as { role?: string })?.role !== 'student',
  });
  const studentId = studentMeData?.data?.student?.id;

  const { data: cantineData, isLoading, error } = useGetCantineQuery(
    { student: studentId! },
    { skip: !studentId },
  );
  const [createOrder, { isLoading: isCreating }] = useCreateCantineOrderMutation();

  const orders = (cantineData?.data?.orders || []) as Cantine[];

  const addToCart = (item: { name: string; price: number }) => {
    const existing = cart.find((c) => c.name === item.name);
    if (existing) {
      setCart(
        cart.map((c) =>
          c.name === item.name ? { ...c, quantity: c.quantity + 1 } : c,
        ),
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (name: string) => {
    const existing = cart.find((c) => c.name === name);
    if (existing && existing.quantity > 1) {
      setCart(
        cart.map((c) =>
          c.name === name ? { ...c, quantity: c.quantity - 1 } : c,
        ),
      );
    } else {
      setCart(cart.filter((c) => c.name !== name));
    }
  };

  const getCartTotal = () =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const getCartItemCount = () => cart.reduce((total, item) => total + item.quantity, 0);

  const handlePlaceOrder = async () => {
    if (!studentId || cart.length === 0) return;
    try {
      const items = cart.map((c) => ({
        name: c.name,
        price: c.price,
        quantity: c.quantity,
      }));
      await createOrder({
        studentId,
        date: orderDate,
        mealType,
        items,
        specialInstructions: specialInstructions || undefined,
      }).unwrap();
      setCart([]);
      setSpecialInstructions('');
      setActiveTab('orders');
    } catch (err) {
      console.error('Failed to place order:', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'served':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;

  const readyCount = orders.filter((o) => o.status === 'served').length;
  const preparingCount = orders.filter((o) => o.status === 'confirmed').length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading orders...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <p className="text-gray-600 mb-4">Failed to load cantine data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0D1B2A] dark:text-white">Cantine</h1>
          <p className="text-gray-600 dark:text-gray-300">Order meals and manage your orders</p>
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
              <p className="text-2xl font-bold text-green-600">{readyCount}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Ready for Pickup</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{preparingCount}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Being Prepared</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-[#0D1B2A] dark:text-white">{orders.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Total Orders</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 max-w-lg">
          <TabsTrigger value="menu">Order</TabsTrigger>
          <TabsTrigger value="orders">My Orders</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="menu" className="mt-6">
          <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
            <CardHeader>
              <CardTitle>Place an Order</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Meal Type</Label>
                  <Select value={mealType} onValueChange={setMealType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MEAL_TYPES.map((m) => (
                        <SelectItem key={m} value={m}>
                          {m.charAt(0).toUpperCase() + m.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={orderDate}
                    onChange={(e) => setOrderDate(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label className="mb-2 block">Add Items</Label>
                <div className="flex flex-wrap gap-2">
                  {COMMON_ITEMS.map((item) => (
                    <Button
                      key={item.name}
                      variant="outline"
                      size="sm"
                      onClick={() => addToCart(item)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      {item.name} ({formatPrice(item.price)})
                    </Button>
                  ))}
                </div>
              </div>

              {cart.length > 0 && (
                <div className="space-y-2">
                  <Label>Cart</Label>
                  <div className="border rounded-lg p-4 space-y-2">
                    {cart.map((item) => (
                      <div
                        key={item.name}
                        className="flex items-center justify-between"
                      >
                        <span>
                          {item.quantity}x {item.name} - {formatPrice(item.price * item.quantity)}
                        </span>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.name)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-6 text-center">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => addToCart({ name: item.name, price: item.price })}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <div className="font-bold pt-2 border-t">
                      Total: {formatPrice(getCartTotal())}
                    </div>
                  </div>
                </div>
              )}

              <div>
                <Label>Special Instructions</Label>
                <Textarea
                  placeholder="Allergies, preferences..."
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  rows={2}
                />
              </div>

              <Button
                onClick={handlePlaceOrder}
                disabled={cart.length === 0 || isCreating}
                className="bg-[#3E92CC] hover:bg-[#2E82BC]"
              >
                {isCreating ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Utensils className="h-4 w-4 mr-2" />
                )}
                Place Order
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="mt-6">
          <div className="space-y-4">
            {orders.filter((o) => o.status !== 'served' && o.status !== 'cancelled').length > 0 ? (
              orders
                .filter((o) => o.status !== 'served' && o.status !== 'cancelled')
                .map((order) => (
                  <Card key={order.id} className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {new Date(order.date).toLocaleDateString()} • {order.mealType}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge className={`text-sm px-3 py-1 ${getStatusColor(order.status)}`}>
                            {order.status}
                          </Badge>
                          <p className="text-lg font-bold text-[#0D1B2A] dark:text-white mt-1">
                            {formatPrice(Number(order.totalAmount))}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {(order.items as { name?: string; quantity?: number; price?: number }[])?.map(
                          (item, i) => (
                            <div
                              key={i}
                              className="flex justify-between p-2 bg-gray-50 dark:bg-[#0D1B2A]/50 rounded"
                            >
                              <span>
                                {item.quantity}x {item.name}
                              </span>
                              <span>
                                {formatPrice((item.price || 0) * (item.quantity || 1))}
                              </span>
                            </div>
                          ),
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
            ) : (
              <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
                <CardContent className="p-12 text-center">
                  <Utensils className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-300">No active orders</p>
                  <Button
                    className="mt-4 bg-[#3E92CC] hover:bg-[#2E82BC]"
                    onClick={() => setActiveTab('menu')}
                  >
                    Place an Order
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
            <CardHeader>
              <CardTitle>Order History</CardTitle>
            </CardHeader>
            <CardContent>
              {orders.filter((o) => o.status === 'served' || o.status === 'cancelled').length >
              0 ? (
                <div className="space-y-4">
                  {orders
                    .filter((o) => o.status === 'served' || o.status === 'cancelled')
                    .map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">
                            {new Date(order.date).toLocaleDateString()} - {order.mealType}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatPrice(Number(order.totalAmount))}
                          </p>
                        </div>
                        <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Utensils className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-[#0D1B2A] dark:text-white mb-2">
                    No order history yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Your completed orders will appear here.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {getCartItemCount() > 0 && (
        <div className="fixed bottom-6 right-6 z-50">
          <Card className="border-0 shadow-lg bg-[#3E92CC] text-white min-w-[200px]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Cart ({getCartItemCount()} items)</span>
                <span className="font-bold">{formatPrice(getCartTotal())}</span>
              </div>
              <Button
                className="w-full bg-white text-[#3E92CC] hover:bg-gray-100"
                onClick={() => setActiveTab('menu')}
              >
                View Cart
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
