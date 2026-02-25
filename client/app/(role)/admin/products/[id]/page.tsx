"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Label } from "@/components/ui/label";

type Product = {
    _id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    image: string;
};

const UpdateProductPage = () => {
    const API = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();

    // This reads the dynamic part of your URL
    const params = useParams();
    const id = params.id as string; // Take the id value from the URL and treat it as a string

    // State management
    const [product, setProduct] = useState<Product | null>(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [image, setImage] = useState<File | null>(null);  // for new uploaded file
    const [preview, setPreview] = useState<string | null>(null); // for showing image
    
    useEffect(() => {
        if (!id) return;
        getProduct();
    }, [id]);

    // Get products detail from db
    const getProduct = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                toast.error("Please login again");
                return;
            }

            const { data } = await axios.get(
                `${API}/api/products/${id}`,
                { 
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setProduct(data);
            setName(data.name);
            setDescription(data.description);
            setPrice(String(data.price));
            setStock(String(data.stock));

            console.log(data.image);
            // Set preview directly from backend image path
            if (data.image) {
                setPreview(`${API}${data.image}`);
            }

        } catch (error) {
            toast.error("Product not found!");
        }
    };

    // Update selected product by id
    const updateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Please login again");
                return;
            }

            const formData = new FormData();
            formData.append("name", name);
            formData.append("description", description);
            formData.append("price", price);
            formData.append("stock", stock);
            if (image) formData.append("image", image);

            await axios.put(`${API}/api/products/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            toast.success("Product updated successfully !!");
            router.push("/admin/products");
        } catch (error: any) {
            console.log(error.response?.data || error.message);
            toast.error(error.response?.data?.message || "Failed to update product!");
        }
    };

    if (!product) return <p className="text-center mt-10">Loading product...</p>;

    return (
        <div className="flex gap-10 bg-gray-100/50 p-12 rounded-md">
                {/* Product Details Card */}
                <Card className="max-h-full w-md">
                    <CardHeader>
                        <CardTitle className="text-xl">Product Details</CardTitle>
                        <CardDescription>Check product details here!</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <div className="flex group justify-center items-center h-54 border-2 border-blue-300 rounded-lg p-3">
                            {product?.image && (
                                <div className="relative w-40 aspect-square">
                                    <Image
                                        src={`${API}${product.image}`}
                                        alt={product.image}
                                        className="object-contain w-auto h-auto transition-transform duration-300 group-hover:scale-110"
                                        fill
                                        unoptimized
                                        loading="eager"
                                    />
                                </div>
                            )}
                        </div>
                        
                        <div className="flex flex-col gap-2">
                            <p className="line-clamp-2 text-sm"><strong className="font-medium">Name:</strong> {product?.name}</p>
                            <p className="line-clamp-3 text-sm"><strong className="font-medium">Description:</strong> {product?.description}</p>
                            <p className="line-clamp-1 text-sm"><strong className="font-medium">Stock:</strong> {product?.stock}</p>
                        <p className="line-clamp-1 text-sm"><strong className="font-medium">Price:</strong> Rs. {(product?.price).toLocaleString("en-IN")}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Update Product Card */}
                <Card className="h-full w-xl">
                    <CardHeader>
                        <CardTitle className="text-xl">Update Product</CardTitle>
                        <CardDescription>Update product here!</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={updateProduct} className="flex flex-col gap-4">
                            <div className="flex gap-5 max-w-full">
                                <span className="flex flex-col gap-2 flex-1">
                                    <Label htmlFor="productName">Product Name</Label>
                                    <Input
                                        type="text"
                                        value={name}
                                        id="productName"
                                        name="productName"
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Product Name"
                                        className="text-gray-500 border-gray-500"
                                        required
                                    />
                                </span>

                                <span className="flex flex-col gap-2 flex-1">
                                    <Label htmlFor="productStock">Product Stock</Label>
                                    <Input
                                        type="number"
                                        value={stock}
                                        id="productStock"
                                        name="productStock"
                                        onChange={(e) => setStock(e.target.value)}
                                        placeholder="Stock"
                                        className="text-gray-500 border-gray-500"
                                        required
                                    />
                                </span>
                            </div>

                            <div className="flex gap-5 max-w-full">
                                <span className="flex flex-col gap-2 flex-1">
                                    <Label htmlFor="productDescription">Product Description</Label>
                                    <Textarea
                                        id="productDescription"
                                        name="productDescription"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Description"
                                        className="text-gray-500 border-gray-500 min-h-[110px]"
                                        required
                                    />
                                </span>

                                <div className="flex flex-col gap-4 w-63">
                                    <span className="flex flex-col gap-2 flex-1">
                                        <Label htmlFor="productPrice">Product Price</Label>
                                        <Input
                                            type="number"
                                            value={price}
                                            id="productPrice"
                                            name="productPrice"
                                            className="text-gray-500 border-gray-500"
                                            onChange={(e) => setPrice(e.target.value)}
                                            placeholder="Price"
                                            required
                                        />
                                    </span>

                                    <span className="flex flex-col gap-2 flex-1">
                                        <Label htmlFor="productImage">Product Image</Label>
                                        <Input
                                            type="file"
                                            id="productImage"
                                            name="productImage"
                                            className="border-gray-500"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (!file) return;
                                                setImage(file);
                                                // create preview safely
                                                const objectUrl = URL.createObjectURL(file);
                                                setPreview(objectUrl);
                                            }}
                                        />
                                    </span>
                                </div>
                            </div>

                        <div className="flex group justify-center items-center h-54 border-2 border-blue-300 rounded-lg p-3">
                                {preview ? (
                                <div className="relative w-40 aspect-square">
                                        <img
                                            src={preview}
                                            alt="Preview"
                                            className="object-contain w-auto h-auto transition-transform duration-300 group-hover:scale-110"
                                            onError={() => setPreview(null)}
                                        />
                                    </div>
                                ) : (
                                    <div className="flex h-50 w-sm justify-center items-center border-2 border-blue-300 rounded-lg">
                                        <p className="text-center p-2 text-sm text-gray-500">
                                            Here's your selected image preview
                                        </p>
                                    </div>
                                )}
                            </div>

                            <Button type="submit" className="bg-green-500 hover:bg-green-600">
                                Update
                            </Button>
                        </form>
                    </CardContent>
                </Card>
        </div>
    );
};

export default UpdateProductPage;
