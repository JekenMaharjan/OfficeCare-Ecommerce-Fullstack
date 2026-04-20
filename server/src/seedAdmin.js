import bcrypt from "bcrypt";
import User from "./models/user.js";

// Creates default admin user if not exists
const seedAdmin = async () => {
    try {
        const existingAdmin = await User.findOne({ role: "admin" });

        if (existingAdmin) {
            console.log("Admin already exists");
            return;
        }

        const hashedPassword = await bcrypt.hash("admin@123", 10);

        const adminUser = new User({
            fullName: "Admin",
            email: "admin@gmail.com",
            password: hashedPassword,
            role: "admin",
        });

        await adminUser.save();

        console.log("Admin seeded successfully");

    } catch (error) {
        console.error("Error seeding admin:", error.message);
    }
};

export default seedAdmin;