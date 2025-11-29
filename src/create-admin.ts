import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import * as bcrypt from 'bcrypt';

async function createAdmin() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const usersService = app.get(UsersService);

    const adminEmail = 'admin@bookstore.com';
    const adminPassword = 'admin123';

    try {
        // Check if admin already exists
        const existingAdmin = await usersService.findByEmail(adminEmail);

        if (existingAdmin) {
            console.log('Admin user already exists!');
            console.log('Email:', adminEmail);
            console.log('Update role to admin...');
            // If exists but not admin, we could update the role here
            await app.close();
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        // Create admin user
        const admin = await usersService.create({
            name: 'Administrator',
            email: adminEmail,
            password: hashedPassword,
        });

        // Update role to admin manually since create doesn't set role
        admin.role = 'admin';
        await admin.save();

        console.log('✅ Admin user created successfully!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('Email:    ', adminEmail);
        console.log('Password: ', adminPassword);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('You can now login with these credentials!');
    } catch (error) {
        console.error('Error creating admin:', error);
    }

    await app.close();
}

createAdmin();
