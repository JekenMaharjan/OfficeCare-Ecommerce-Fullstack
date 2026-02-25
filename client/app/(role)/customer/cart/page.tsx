"use client"

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Card, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

type Product = {
    _id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    image: string;
    quantityInCart: number;
};

const CustomerCart = () => {
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [placingOrder, setPlacingOrder] = useState(false);
    const [open, setOpen] = useState(false);

    const [cartItems, setCartItems] = useState<Product[]>([]);
    const [cartCount, setCartCount] = useState(0);
    const [removingId, setRemovingId] = useState<string | null>(null);

    const API = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        fetchCartItems();
        fetchCartCount();
    }, []);

    // Fetch all cart items
    const fetchCartItems = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Please login again");
                return;
            }

            const { data } = await axios.get(`${API}/api/cart/items`,
                { 
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const itemsArray = data?.items || [];
            const items = itemsArray.map((item: any) => ({
                _id: item.product._id,
                name: item.product.name,
                description: item.product.description,
                price: item.product.price,
                stock: item.product.stock,
                image: item.product.image,
                quantityInCart: item.quantity
            }));
            setCartItems(items);
        } catch (error) {
            toast.error("Failed to fetch cart items!");
            setCartItems([]);
        }
    };

    // Fetch count of cart
    const fetchCartCount = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Please login again");
                return;
            }

            const { data } = await axios.get(`${API}/api/cart/count`, 
                { 
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setCartCount(data.count);
        } catch {
            setCartCount(0);
        }
    };

    // Remove ALL quantity of a product from cart
    const handleRemoveFromCart = async (productId: string, quantity: number) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Please login again");
                return;
            }

            setRemovingId(productId);
            await axios.delete(`${API}/api/cart`, {
                data: { productId, quantity },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Update UI
            setCartItems(prev => prev.filter(item => item._id !== productId));
            setCartCount(prev => prev - quantity);

            toast.success("Removed from cart!");
        } catch {
            toast.error("Failed to remove from cart!");
        } finally {
            setRemovingId(null);
        }
    };

    // Remove just 1 quantity of a product
    const handleDecreaseOne = async (productId: string) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Please login again");
                return;
            }

            await axios.patch(
                `${API}/api/cart/quantity`,
                { productId, action: "decrease" },
                { 
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setCartItems(prev =>
                prev
                    .map(item =>
                        item._id === productId
                            ? { ...item, quantityInCart: item.quantityInCart - 1 }
                            : item
                    )
                    .filter(item => item.quantityInCart > 0)
            );

            setCartCount(prev => prev - 1);

        } catch {
            toast.error("Failed to decrease item");
        }
    };

    // Add just 1 quantity of a product
    const handleAddOne = async (productId: string) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Please login again");
                return;
            }

            setRemovingId(productId);

            await axios.patch(
                `${API}/api/cart/quantity`,
                { productId, action: "increase" },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                },
                }
            );

            setCartItems(prev =>
                prev.map(item =>
                    item._id === productId
                        ? { ...item, quantityInCart: item.quantityInCart + 1 }
                        : item
                )
            );

            setCartCount(prev => prev + 1);

        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to add item!");
        } finally {
            setRemovingId(null);
        }
    };

    // Calculate total amount of the all products to the cart
    const totalAmount = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantityInCart,
        0
    );

    // Handle place order
    const handlePlaceOrder = async () => {
        if (placingOrder) return;

        setPlacingOrder(true); // LOCK IMMEDIATELY

        // Validation
        if (!fullName.trim() || !phone.trim() || !address.trim()) {
            toast.error("Please fill all fields");
            setPlacingOrder(false);
            return;
        }

        if (cartItems.length === 0) {
            toast.error("Cart is empty");
            setPlacingOrder(false);
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Please login again");
            setPlacingOrder(false);
            return;
        }

        try {
            await axios.post(
                `${API}/api/orders`,
                {
                    fullName: fullName.trim(),
                    phone: phone.trim(),
                    shippingAddress: address.trim(),
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success("Order placed successfully!");

            setFullName("");
            setPhone("");
            setAddress("");

            await fetchCartItems();
            await fetchCartCount();

            setOpen(false);

        } catch (error: any) {
            toast.error(
                error?.response?.data?.message || "Failed to place order"
            );
        } finally {
            setPlacingOrder(false);
        }
    };

// ======================================================================================================================

    return (
        <div className="min-h-full w-6xl bg-gray-100/50 p-6 rounded-md mx-auto">
            <h1 className="text-4xl font-bold text-center mb-6">Your Cart</h1>

            {cartItems.length === 0 ? (
                <p className="text-center text-gray-700">Your cart is empty!</p>
            ) : (
                <div className="flex flex-col gap-5">
                    {cartItems.map(item => (
                        <Card key={item._id} className="p-5">
                            <CardContent className="flex justify-between items-center">
                                <div className="relative w-40 h-40">
                                    <Image
                                        src={`${API}/uploads/${item.image}`}
                                        alt={item.name}
                                        height={170}
                                        width={170}
                                        unoptimized
                                        loading="eager"
                                        className="object-contain w-auto h-auto"
                                    />
                                </div>

                                <div className="flex flex-col gap-2 lg:w-sm sm:w-20">
                                    <CardTitle className="text-xl font-semibold">{item.name}</CardTitle>
                                    <CardDescription className="text-sm text-gray-600 line-clamp-2">{item.description}</CardDescription>
                                </div>

                                <p className="font-semibold text-center text-blue-600 w-25">Rs. {item.price.toLocaleString("en-IN")}</p>

                                <div className="w-30 text-center">
                                    <p className="font-semibold">Quantity: {item.quantityInCart}</p>
                                    <p className="text-sm mt-2"><strong>Total:</strong> Rs. {(item.quantityInCart * item.price).toLocaleString("en-IN")}</p>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <div className="flex justify-between">
                                        <Button onClick={() => handleAddOne(item._id)} className="w-17 text-xl bg-green-500 hover:bg-green-600">
                                            +
                                        </Button>
                                        <Button onClick={() => handleDecreaseOne(item._id)} className="w-17 text-xl bg-red-500 hover:bg-red-600">
                                            -
                                        </Button>
                                    </div>

                                    <Button
                                        onClick={() => handleRemoveFromCart(item._id, item.quantityInCart)}
                                        disabled={removingId === item._id}
                                        className="bg-red-500 hover:bg-red-600"
                                    >
                                        {removingId === item._id ? "Removing..." : "Remove from Cart"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Checkout Cart */}
            <div className="mt-8 flex justify-end">
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button
                            disabled={cartItems.length === 0}
                            className="bg-yellow-500 hover:bg-yellow-600 px-8"
                        >
                            Proceed to Checkout
                        </Button>
                    </DialogTrigger>

                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Checkout</DialogTitle>
                            <DialogDescription>
                                Please confirm your order details.
                            </DialogDescription>
                        </DialogHeader>

                        {/* Order Summary */}
                        <div className="space-y-3 mt-4">
                            {cartItems.map(item => (
                                <div key={item._id} className="flex justify-between text-sm">
                                    <span className="w-xs">{item.name} (x{item.quantityInCart})</span>
                                    <span>Rs. {(item.price * item.quantityInCart).toLocaleString("en-IN")}</span>
                                </div>
                            ))}

                            <div className="border-t pt-3 flex justify-between font-semibold">
                                <span>Total</span>
                                <span>Rs. {totalAmount.toLocaleString("en-IN")}</span>
                            </div>
                        </div>

                        {/* Shipping Form */}
                        <div className="mt-6 space-y-3">
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full border rounded p-2"
                            />

                            <input
                                type="text"
                                placeholder="Phone Number"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full border rounded p-2"
                            />

                            <textarea
                                placeholder="Delivery Address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="w-full border rounded p-2"
                            />
                        </div>

                        {/* Confirm Button */}
                        <Button
                            type="button"
                            className="w-full mt-6 bg-green-600 hover:bg-green-700"
                            onClick={handlePlaceOrder}
                            disabled={placingOrder}
                        >
                            {placingOrder ? "Placing Order..." : "Confirm Order"}
                        </Button>
                    </DialogContent>
                </Dialog>
            </div>

            <p className="mt-6 text-right font-semibold text-gray-800 text-md mr-2">
                Total Items: {cartCount}
            </p>
        </div>
    );
};

export default CustomerCart;