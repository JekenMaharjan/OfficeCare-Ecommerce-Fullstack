"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner";

type ProductItem = {
    product: { name: string; price: number };
    quantity: number;
};

type Order = {
    _id: string;
    user: { name: string; email: string };
    fullName: string;
    products: ProductItem[];
    totalAmount: number;
    status: string;
    createdAt: string;
};

const AdminOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [openOrderId, setOpenOrderId] = useState<string | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<string>("");

    const API = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        fetchOrders();
    }, []);

    // GET: Get all orders details
    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                toast.error("Please login again");
                return;
            }

            const res = await axios.get(`${API}/api/orders`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setOrders(res.data);
        } catch (err) {
            console.error("Fetch Orders Error:", err);
        }
    };

    // PATCH: Updates status of the order
    const updateStatus = async (id: string, status: string) => {
        try {
            await axios.patch(
                `${API}/api/orders/${id}`,
                { status },
                { withCredentials: true }
            );
            fetchOrders();
        } catch (err) {
            console.error("Update Status Error:", err);
        }
    };

    // Helper functions
    const getTotalItems = (order: Order) =>
        order.products.reduce((sum, item) => sum + item.quantity, 0);

    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });

    const filteredOrders = orders.filter((order) =>
        order.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (!orders) {
        return <p className="text-center mt-10">Loading orders...</p>;
    }

    return (
        <div className="min-h-full w-full bg-gray-100/50 p-6 rounded-md">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 text-center mb-6">
                Orders
            </h1>

            {/* Search */}
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-end mb-5">
                <Input
                    type="text"
                    placeholder="Search by customer name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-72 border-blue-600 focus-visible:ring-2 focus-visible:ring-blue-500"
                />
                <Button className="bg-blue-500 hover:bg-blue-600 transition-all">
                    Search
                </Button>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-center">Order ID</TableHead>
                            <TableHead className="text-center">Customer</TableHead>
                            <TableHead className="text-center">Items</TableHead>
                            <TableHead className="text-center">Total</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead className="text-center">Order Date</TableHead>
                            <TableHead className="text-center">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredOrders && filteredOrders.length > 0 ? (
                            filteredOrders.map((order) => (
                                <TableRow key={order._id}>
                                    <TableCell className="p-0 py-2 text-center">
                                        {order._id.slice(0, 7)}
                                    </TableCell>
                                    <TableCell className="p-0 py-2 text-center flex flex-col font-medium">
                                        <p>{order.fullName}</p>
                                        <p>{order?.user?.email}</p>
                                    </TableCell>
                                    <TableCell className="text-center p-0 py-2">{getTotalItems(order)}</TableCell>
                                    <TableCell className="text-center p-0 py-2">{order.totalAmount}</TableCell>
                                    <TableCell className="text-center p-0 py-2">{order.status}</TableCell>
                                    <TableCell className="text-center p-0 py-2">{formatDate(order.createdAt)}</TableCell>
                                    <TableCell className="text-center p-0 py-2">
                                        <Dialog
                                            open={openOrderId === order._id}
                                            onOpenChange={(isOpen) => {
                                                setOpenOrderId(isOpen ? order._id : null);
                                                if (isOpen) setSelectedStatus(order.status); // set current order status when opening
                                            }}
                                        >
                                            <DialogTrigger className="bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded-md font-semibold text-white">
                                                Update
                                            </DialogTrigger>

                                            <DialogContent className="w-80">
                                                <DialogHeader>
                                                    <DialogTitle>Update Order Status</DialogTitle>
                                                    <DialogDescription>Select a new status for this order</DialogDescription>

                                                    <div className="flex justify-center mt-2">
                                                        <select
                                                            value={selectedStatus}
                                                            onChange={(e) => setSelectedStatus(e.target.value)}
                                                            className="w-full bg-white border border-gray-300 rounded-md px-2 py-1 text-sm hover:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                        >
                                                            <option value="Pending">Pending</option>
                                                            <option value="Processing">Processing</option>
                                                            <option value="Shipped">Shipped</option>
                                                            <option value="Delivered">Delivered</option>
                                                            <option value="Cancelled">Cancelled</option>
                                                        </select>
                                                    </div>
                                                </DialogHeader>

                                                <Button
                                                    className="bg-green-500 hover:bg-green-600 mt-4 w-full"
                                                    onClick={() => {
                                                        updateStatus(order._id, selectedStatus); // call API
                                                        setOpenOrderId(null); // close dialog
                                                    }}
                                                >
                                                    Save
                                                </Button>
                                            </DialogContent>
                                        </Dialog>
                                    </TableCell>
                                </TableRow>
                            )
                        )) : (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-6 text-gray-600">
                                        No order found
                                    </TableCell>
                                </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default AdminOrders;