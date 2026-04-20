"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as Yup from "yup";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import axios from "axios";
import { toast } from "sonner";

const validationSchema = Yup.object({
    email: Yup.string()
        .email("Invalid email format!")
        .required("Email is required!"),

    password: Yup.string()
        .min(6, "Password must be at least 6 characters!")
        .required("Password is required!"),
});

const SignIn = () => {
    const API = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema,

        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                if (!API) {
                    toast.error("API URL is not configured");
                    return;
                }

                const res = await axios.post(
                    `${API}/api/auth/signin`,
                    values,
                    { withCredentials: true }
                );

                const token = res?.data?.token;
                const user = res?.data?.user;

                if (!token || !user) {
                    toast.error("Invalid response from server");
                    return;
                }

                // Store safely
                localStorage.setItem("token", token);
                localStorage.setItem("role", user.role);
                localStorage.setItem("user", JSON.stringify(user));

                toast.success(
                    user.role === "admin"
                        ? "Admin Login Successful!"
                        : "Login Successful!"
                );

                // Role-based routing
                if (user.role === "admin") {
                    router.push("/admin/products");
                } else {
                    router.push("/customer/products");
                }

                resetForm();

            } catch (error: any) {
                const message =
                    error?.response?.data?.message ||
                    "Failed to Login User!";

                toast.error(message);

            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-500 to-purple-500 p-4">

            <Card className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl shadow-2xl rounded-3xl bg-white/90 backdrop-blur-sm border border-white/20">

                <CardHeader className="text-center pt-8">
                    <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                        Sign In to Your Account
                    </CardTitle>
                    <CardDescription className="text-gray-600 mt-2">
                        Enter your credentials to continue
                    </CardDescription>
                </CardHeader>

                <CardContent className="flex flex-col px-6 sm:px-10 gap-5">

                    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5">

                        {/* Email */}
                        <div className="flex flex-col gap-2">
                            <Label>Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="abc@example.com"
                                onChange={formik.handleChange}
                                value={formik.values.email}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.email && formik.errors.email && (
                                <p className="text-xs text-red-500">
                                    {formik.errors.email}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="flex flex-col gap-2">
                            <Label>Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Enter your password"
                                onChange={formik.handleChange}
                                value={formik.values.password}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.password && formik.errors.password && (
                                <p className="text-xs text-red-500">
                                    {formik.errors.password}
                                </p>
                            )}
                        </div>

                        {/* Button */}
                        <Button
                            type="submit"
                            disabled={formik.isSubmitting}
                            className="w-full bg-blue-500 hover:bg-blue-600 mt-5 text-white py-3 rounded-xl shadow-lg transition disabled:opacity-50"
                        >
                            {formik.isSubmitting ? "Signing In..." : "Sign In"}
                        </Button>

                    </form>

                </CardContent>

                <CardFooter className="flex flex-col gap-3 py-6">
                    <p className="text-sm text-center text-gray-600">
                        Don't have an account?{" "}
                        <Link href="/register" className="text-blue-600 font-medium hover:underline">
                            Register
                        </Link>
                    </p>
                </CardFooter>

            </Card>

        </div>
    );
};

export default SignIn;



