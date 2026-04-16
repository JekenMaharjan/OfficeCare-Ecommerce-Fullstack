"use client"

import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Menu, X } from "lucide-react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
    const [cartCount, setCartCount] = useState(0);
    const [menuOpen, setMenuOpen] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [addingToCartId, setAddingToCartId] = useState<string | null>(null);

    const router = useRouter();
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

    useEffect(() => {
        // Call immediately on mount
        fetchCartCount();
    }, []); // empty dependency array so it runs once on mount

    // GET: Get cart count
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
            toast.error("Failed fetching cart count !!");
            setCartCount(0);
        }
    };

    // GET: Get all products
    const getAllProducts = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Please login again");
                return;
            }

            const { data } = await axios.get(
                `${API}/api/products`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setProducts(data);
            setFilteredProducts(data);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };

    // POST: Add to cart
    const handleAddToCart = async (productId: string) => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Please login again");
            return;
        }

        try {
            setAddingToCartId(productId);

            await axios.post(
                `${API}/api/cart`,
                { productId, quantity: 1 },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setAddingToCartId(null);

            // Update cart count only
            await fetchCartCount();

            toast.success("Added to cart!");
        } catch (error: any) {
            setAddingToCartId(null);
            toast.error(error.response?.data?.message || "Failed to add to cart!");
        }
    };

    // Handle product search
    const handleSearch = () => {
        const filtered = products.filter((product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProducts(filtered);
    };

    return (
        <div className="min-h-screen max-w-screen flex flex-col overflow-hidden">
            {/* <Toaster position="bottom-right" richColors /> */}

            {/* ====================================================================================================================== */}

            {/* Customer Navbar */}
            <nav className="bg-gray-900 text-white">
                <div className="max-w-6xl mx-auto flex items-center justify-between p-2">
                    {/* Logo */}
                    <div className="flex items-center gap-5">
                        <Image
                            src="/OfficeCareLogo.png"
                            alt="OfficeCare Logo"
                            width={90}
                            height={90}
                            loading="eager"
                        />
                        <p className="text-2xl md:text-3xl font-bold text-blue-500">OFFICE CARE</p>
                    </div>

                    {/* Desktop Links */}
                    <div className="hidden md:flex gap-6 items-center">
                        <Link className="font-semibold text-lg hover:text-blue-400" href="/customer/products">
                            Products
                        </Link>

                        <Link href="/customer/cart" className="relative inline-flex items-center justify-center">
                            <ShoppingCart className="w-6 h-6" />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        <Button
                            onClick={() => {
                                localStorage.removeItem("token");
                                router.push("/signin");
                            }}
                            className="bg-red-500 text-white hover:bg-red-600 border-none"
                        >
                            Logout
                        </Button>

                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </div>

                    {/* Mobile Hamburger */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="text-white focus:outline-none"
                        >
                            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {menuOpen && (
                    <div className="md:hidden bg-gray-800 px-5 py-4 space-y-4">
                        <Link
                            className="block font-semibold text-lg hover:text-blue-400"
                            href="/customer/products"
                            onClick={() => setMenuOpen(false)}
                        >
                            Products
                        </Link>

                        <Link
                            href="/customer/cart"
                            className="relative inline-flex items-center justify-center"
                            onClick={() => setMenuOpen(false)}
                        >
                            <ShoppingCart className="w-6 h-6 mr-2" />
                            Cart
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        <Button
                            onClick={() => {
                                localStorage.removeItem("token");
                                router.push("/signin");
                                setMenuOpen(false);
                            }}
                            className="bg-red-500 text-white hover:bg-red-600 border-none w-full"
                        >
                            Logout
                        </Button>

                        <div className="flex items-center gap-3 mt-2">
                            <Avatar>
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <span>User</span>
                        </div>
                    </div>
                )}
            </nav>

            {/* ====================================================================================================================== */}

            {/* Main Container */}
            <main className="flex-1 overflow-auto bg-gradient-to-br from-blue-500 to-purple-500 flex p-10 justify-center w-screen">
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

                    <hr className="my-5 border-blue-700" />

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
            </main>

            {/* ====================================================================================================================== */}

            {/* Customer Footer */}
            <Footer />
        </div>
    );
};

export default CustomerProducts;