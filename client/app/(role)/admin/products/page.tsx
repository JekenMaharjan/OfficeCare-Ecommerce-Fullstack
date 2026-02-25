"use client"

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { FaCheckCircle } from "react-icons/fa";
import { FaCircleXmark } from "react-icons/fa6";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup } from "@/components/ui/field";
import { useRouter } from "next/navigation";

type Product = {
    _id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    image: string;
}

const AdminProducts = () => {
    const API = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();

    const [products, setProducts] = useState<Product[]>([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

    useEffect(() => {
        getAllProducts();
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
            const response = await axios.get(
                `${API}/api/products`,
                { withCredentials: true }
            );
            setProducts(response.data);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    }

    const addProduct = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("description", description);
            formData.append("price", price);
            formData.append("stock", stock);
            if (image) formData.append("image", image);

            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Please login again");
                return;
            }

            await axios.post(
                `${API}/api/products`,
                formData,
                {
                    withCredentials: true,  // this allows cookies, not headers
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            toast.success("Product created successfully !!");
            getAllProducts();
            setName("");
            setDescription("");
            setPrice("");
            setStock("");
            setImage(null);
            setOpen(false);

        } catch (error: any) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const token = localStorage.getItem("token");

            await axios.delete(
                `${API}/api/products/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success("Product deleted !!");
            getAllProducts();
        } catch (error: any) {
            toast.error("Something went wrong");
        }
    };

    const handleSearch = () => {
        const filtered = products.filter((product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProducts(filtered);
    };

    if (!products) {
        return <p className="text-center mt-10">Loading product...</p>;
    }

    return (
        <div className="min-h-full w-7xl bg-gray-100/50 p-6 rounded-md px-10">
            <div className="px-5 pb-5 w-full pt-5">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 text-center mb-6">
                    Admin Panel
                </h1>

                {/* Search Bar */}
                <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-end">
                    <Input
                        type="text"
                        placeholder="Search by product name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full sm:w-72 border-blue-600 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0 focus-visible:border-blue-500"
                    />
                    <Button
                        onClick={handleSearch}
                        className="bg-blue-500 hover:bg-blue-600 transition-all"
                    >
                        Search
                    </Button>
                </div>

                <hr className="my-5 border-blue-700" />

                <div className="flex justify-end mb-5">
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-green-500 border-none text-white hover:text-white hover:bg-green-600" variant="outline">
                                Add Product
                            </Button>
                        </DialogTrigger>

                        <DialogContent className="sm:max-w-sm">
                            <form onSubmit={addProduct} className="flex flex-col gap-4">
                                <DialogHeader>
                                    <DialogTitle>Add Product</DialogTitle>
                                    <DialogDescription>
                                        Add product here. Click save when you&apos;re done.
                                    </DialogDescription>
                                </DialogHeader>

                                <FieldGroup className="flex flex-col gap-4 mt-5">
                                    <Field>
                                        <Label htmlFor="productName">Product Name</Label>
                                        <Input 
                                            type="text" 
                                            id="productName" 
                                            name="productName" 
                                            placeholder="Enter product name" 
                                            onChange={(e) => setName(e.target.value)}
                                            className="rounded-lg" 
                                        />
                                    </Field>

                                    <Field>
                                        <Label htmlFor="productDescription">Description</Label>
                                        <Input 
                                            type="text" 
                                            id="productDescription" 
                                            name="productDescription" 
                                            placeholder="Enter product description" 
                                            onChange={(e) => setDescription(e.target.value)}
                                            className="rounded-lg"
                                        />
                                    </Field>

                                    <Field>
                                        <Label htmlFor="productPrice">Price</Label>
                                        <Input 
                                            type="number" 
                                            id="productPrice" 
                                            name="productPrice" 
                                            placeholder="Enter product price" 
                                            onChange={(e) => setPrice(e.target.value)}
                                            className="rounded-lg"
                                        />
                                    </Field>

                                    <Field>
                                        <Label htmlFor="productStock">Stock</Label>
                                        <Input
                                            type="number"
                                            id="productStock"
                                            name="productStock"
                                            placeholder="Enter product stock"
                                            onChange={(e) => setStock(e.target.value)}
                                            className="rounded-lg"
                                        />
                                    </Field>

                                    <Field>
                                        <Label htmlFor="productImage">Image</Label>
                                        <Input 
                                            type="file" 
                                            id="productImage" 
                                            name="productImage" 
                                            accept="image/*"
                                            onChange={(e) => e.target.files && setImage(e.target.files[0])}
                                            className="rounded-lg"
                                        />
                                    </Field>
                                </FieldGroup>

                                <DialogFooter className="flex gap-5 mt-3">
                                    <DialogClose asChild>
                                        <Button variant="outline" className="rounded-lg">Cancel</Button>
                                    </DialogClose>
                                    <Button type="submit" className="bg-green-500 hover:bg-green-600 border-none">Save</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <Table className="min-w-full">
                        {/* <TableCaption>A list of available products.</TableCaption> */}
                        <TableHeader>
                            <TableRow className="text-md">
                                <TableHead className="w-[100px]">Product Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-center">Stock</TableHead>
                                <TableHead className="text-center">Image</TableHead>
                                <TableHead className="text-center">Price (Rs.)</TableHead>
                                <TableHead className="text-center">Action</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {filteredProducts && filteredProducts.length > 0 ? (
                                filteredProducts.map((product) => (
                                    <TableRow key={product._id}>
                                        <TableCell className="w-50 font-medium whitespace-normal">{product.name}</TableCell>
                                        <TableCell className="w-lg whitespace-normal">{product.description}</TableCell>
                                        <TableCell className="text-center">{product.stock ?? 0}</TableCell>
                                        <TableCell className="flex justify-center">
                                            {
                                            product.image 
                                            ? <FaCheckCircle className="text-green-600 bg-white rounded-full" /> 
                                            : <FaCircleXmark className="text-red-600 bg-white rounded-full"/>
                                            }
                                        </TableCell>
                                        <TableCell className="text-center">{(product.price).toLocaleString("en-IN")}</TableCell>
                                        <TableCell className="flex justify-center gap-5">
                                            <Button
                                                onClick={() => router.push(`/admin/products/${product._id}`)}
                                                className="bg-blue-500 hover:bg-blue-600"
                                            >
                                                Update
                                            </Button>
                                            <Button
                                                onClick={() => handleDelete(product._id)}
                                                className="bg-red-500 hover:bg-red-600"
                                            >
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-6 text-gray-600">
                                        No products found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
};

export default AdminProducts;