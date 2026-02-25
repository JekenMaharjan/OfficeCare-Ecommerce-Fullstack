import bcrypt from "bcrypt";
import User from "./models/user.js";

// Creates Admin role user if no Admin role user
const seedAdmin = async () => {
    try {
        const existingAdmin = await User.findOne({ role: "admin" });
        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash("admin@123", 10);
            await User.create({
                fullName: "Admin",
                email: "admin@gmail.com",
                password: hashedPassword,
                role: "admin",
            });
            console.log("Admin seeded successfully");
        } else {
            console.log("Admin already exists");
        }
    } catch (error) {
        console.error("Error seeding admin:", error);
    }
};

export default seedAdmin;