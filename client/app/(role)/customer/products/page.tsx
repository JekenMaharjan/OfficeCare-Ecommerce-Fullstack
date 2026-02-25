"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Product = {
    _id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    image: string;
};

const CustomerProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [addingToCartId, setAddingToCartId] = useState<string | null>(null);
    const [cartCount, setCartCount] = useState(0);

    const API = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        getAllProducts();
        fetchCartCount();
    }, []);

    useEffect(() => {
        // Live filtering whenever searchTerm changes
        const filtered = products.filter((product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProducts(filtered);
    }, [searchTerm, products]);

    const getAllProducts = async () => {
        try {
            const { data } = await axios.get(
                `${API}/api/products`,
                { withCredentials: true }
            );
            setProducts(data);
            setFilteredProducts(data);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };

    const fetchCartCount = async () => {
        try {
            const { data } = await axios.get(`${API}/api/cart/count`,
                { withCredentials: true }
            );
            
            setCartCount(data.count);
        } catch {
            toast.error("Failed fetching cart count !!");
            setCartCount(0);
        }
    };

    const handleAddToCart = async (productId: string) => {
        try {
            setAddingToCartId(productId);
            setCartCount(prev => prev + 1); // update immediately

            const { data } = await axios.post(
                `${API}/api/cart`,
                { productId, quantity: 1 },
                { withCredentials: true }
            );

            // Update product stock in UI
            setProducts(prev =>
                prev.map(product =>
                    product._id === productId
                        ? { ...product, stock: data.updatedStock }
                        : product
                )
            );

            setAddingToCartId(null);
            toast.success("Added to cart!");
        } catch {
            setAddingToCartId(null);
            setCartCount(prev => prev - 1); // revert if failed
            toast.error("Failed to add to cart!");
        }
    };

    const handleSearch = () => {
        const filtered = products.filter((product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProducts(filtered);
    };

    return (
        <div className="min-h-full min-w-full bg-gray-100/50 p-6 pt-10 rounded-xl sm:p-10">
            <h1 className="text-4xl sm:text-5xl font-bold text-center text-gray-900 mb-8">
                Our Products
            </h1>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-end mb-6">
                <Input
                    type="text"
                    placeholder="Search by product name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-80 border-blue-600 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500"
                />
                <Button
                    onClick={handleSearch}
                    className="bg-blue-500 hover:bg-blue-600 w-full sm:w-auto transition-all"
                >
                    Search
                </Button>
            </div>

            <hr className="my-5 border-blue-700"/>

            {/* Product Grid */}
            {filteredProducts && filteredProducts.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                    {filteredProducts.map((product) => (
                        <Card
                            key={product._id}
                            className="flex flex-col gap-0 group w-full overflow-hidden justify-between p-5 pb-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300"
                        >
                            <CardContent className="text-center p-0">
                                <div className="relative flex justify-center w-full h-52 overflow-hidden border-2 border-blue-400 rounded-md p-5">
                                    {product?.image ? (
                                        <Image
                                            src={`${API}${product.image}`}
                                            alt={product.name}
                                            height={170}
                                            width={170}
                                            unoptimized
                                            loading="eager"
                                            className="object-contain w-auto h-auto transition-transform duration-300 group-hover:scale-110"
                                        />
                                    ) : (
                                        <Image
                                            src="/placeholder.png"
                                            alt="Placeholder"
                                            height={170}
                                            width={170}
                                            className="object-contain w-auto h-auto"
                                        />
                                    )}
                                </div>

                                <CardTitle className="text-xl font-semibold line-clamp-1 mt-2">{product.name}</CardTitle>
                                <CardDescription className="text-sm text-gray-600 line-clamp-2">{product.description}</CardDescription>
                                <p className="mt-1 text-sm font-semibold text-gray-800">Stock: {product.stock}</p>
                                <p className="mt-1 font-semibold text-lg text-blue-600">Rs. {(product.price).toLocaleString("en-IN")}</p>
                            </CardContent>

                            <CardFooter className="flex justify-center mt-3 min-w-full p-0">
                                <Button
                                    onClick={() => handleAddToCart(product._id)}
                                    disabled={addingToCartId === product._id || product.stock === 0}
                                    className="bg-yellow-500 hover:bg-yellow-600 w-full"
                                >
                                    {addingToCartId === product._id ? "Adding..." : product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-center mt-10">No Products found</p>
            )}
        </div>
    );
};

export default CustomerProducts;