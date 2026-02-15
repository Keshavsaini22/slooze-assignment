import { PrismaClient, Role, DietaryType } from '@prisma/client';

const prisma = new PrismaClient();

const CUISINES = ['Italian', 'Indian', 'Chinese', 'American', 'Mexican', 'Japanese', 'Thai', 'Mediterranean'];
const COUNTRIES = ['India', 'America', 'UK', 'Canada', 'Australia'];

const MENU_ITEMS_DATA = {
    Italian: [
        { name: 'Margherita Pizza', price: 10.99, type: DietaryType.VEG, description: 'Classic cheese and tomato' },
        { name: 'Pasta Carbonara', price: 14.99, type: DietaryType.NON_VEG, description: 'Creamy pasta with bacon' },
        { name: 'Tiramisu', price: 6.99, type: DietaryType.EGG, description: 'Coffee flavoured dessert' },
        { name: 'Risotto', price: 16.99, type: DietaryType.VEG, description: 'Mushroom rising' },
        { name: 'Lasagna', price: 15.99, type: DietaryType.NON_VEG, description: 'Layered pasta with meat' },
    ],
    Indian: [
        { name: 'Butter Chicken', price: 13.99, type: DietaryType.NON_VEG, description: 'Creamy tomato curry' },
        { name: 'Paneer Tikka', price: 11.99, type: DietaryType.VEG, description: 'Grilled cottage cheese' },
        { name: 'Biryani', price: 12.99, type: DietaryType.NON_VEG, description: 'Spiced rice with meat' },
        { name: 'Naan', price: 2.99, type: DietaryType.VEG, description: 'Flatbread' },
        { name: 'Gulab Jamun', price: 4.99, type: DietaryType.VEG, description: 'Sweet dough balls' },
    ],
    American: [
        { name: 'Cheeseburger', price: 9.99, type: DietaryType.NON_VEG, description: 'Beef patty with cheese' },
        { name: 'Fries', price: 3.99, type: DietaryType.VEG, description: 'Crispy fried potatoes' },
        { name: 'Caesar Salad', price: 8.99, type: DietaryType.EGG, description: 'Salad with caesar dressing' },
        { name: 'Hot Dog', price: 5.99, type: DietaryType.NON_VEG, description: 'Sausage in a bun' },
        { name: 'Apple Pie', price: 4.99, type: DietaryType.EGG, description: 'Classic dessert' },
    ],
    Mexican: [
        { name: 'Tacos', price: 3.99, type: DietaryType.NON_VEG, description: 'Corn tortilla with filling' },
        { name: 'Burrito', price: 9.99, type: DietaryType.NON_VEG, description: 'Wrapped tortilla' },
        { name: 'Guacamole', price: 5.99, type: DietaryType.VEG, description: 'Avocado dip' },
        { name: 'Quesadilla', price: 7.99, type: DietaryType.VEG, description: 'Cheese filled tortilla' },
        { name: 'Churros', price: 4.99, type: DietaryType.EGG, description: 'Fried dough pastry' },
    ],
    Chinese: [
        { name: 'Kung Pao Chicken', price: 11.99, type: DietaryType.NON_VEG, description: 'Spicy chicken stir-fry' },
        { name: 'Dumplings', price: 6.99, type: DietaryType.NON_VEG, description: 'Steamed dough parcels' },
        { name: 'Spring Rolls', price: 4.99, type: DietaryType.VEG, description: 'Crispy vegetable rolls' },
        { name: 'Fried Rice', price: 8.99, type: DietaryType.EGG, description: 'Rice with egg and veggies' },
        { name: 'Mapo Tofu', price: 10.99, type: DietaryType.VEG, description: 'Spicy tofu dish' },
    ]
};

async function main() {
    console.log('Starting seed...');

    // 1. Create Users
    const usersData = [
        { email: 'nick.fury@slooze.xyz', name: 'Nick Fury', role: Role.ADMIN, country: 'America' },
        { email: 'captain.marvel@slooze.xyz', name: 'Captain Marvel', role: Role.MANAGER, country: 'India' },
        { email: 'captain.america@slooze.xyz', name: 'Captain America', role: Role.MANAGER, country: 'America' },
        { email: 'thanos@slooze.xyz', name: 'Thanos', role: Role.MEMBER, country: 'India' },
        { email: 'thor@slooze.xyz', name: 'Thor', role: Role.MEMBER, country: 'India' },
        { email: 'travis@slooze.xyz', name: 'Travis', role: Role.MEMBER, country: 'America' },
    ];

    for (const u of usersData) {
        await prisma.user.upsert({
            where: { email: u.email },
            update: {
                password: 'password123',
                name: u.name,
                role: u.role,
                country: u.country
            },
            create: {
                email: u.email,
                name: u.name,
                role: u.role,
                country: u.country,
                password: 'password123',
            },
        });
    }
    console.log('Users created.');

    // 2. Create Restaurants
    // Clear existing restaurants to avoid duplicates if re-running (optional, but good for clean seed)
    // await prisma.orderItem.deleteMany();
    // await prisma.menuItem.deleteMany();
    // await prisma.order.deleteMany();
    // await prisma.restaurant.deleteMany();
    // WARNING: Be careful with deleteMany in production. For dev it is fine.

    for (let i = 1; i <= 20; i++) {
        const cuisine = CUISINES[Math.floor(Math.random() * CUISINES.length)];
        const country = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
        // Pick random items from the cuisine list, or generic if not found (fallback to Italian items)
        const baseItems = MENU_ITEMS_DATA[cuisine as keyof typeof MENU_ITEMS_DATA] || MENU_ITEMS_DATA['Italian'];

        // Generate 20-30 menu items by duplicating and slightly modifying base items
        const menuItemsCreateInput = [];
        const numberOfItems = Math.floor(Math.random() * 10) + 20; // 20 to 30 items

        for (let j = 0; j < numberOfItems; j++) {
            const baseItem = baseItems[j % baseItems.length];
            menuItemsCreateInput.push({
                name: `${baseItem.name} ${j + 1}`,
                description: baseItem.description,
                price: parseFloat((baseItem.price + (Math.random() * 5)).toFixed(2)),
                dietaryType: baseItem.type,
                image: `https://placehold.co/400?text=${encodeURIComponent(baseItem.name)}`
            });
        }

        await prisma.restaurant.create({
            data: {
                name: `${cuisine} Bistro ${i}`,
                address: `Street ${i}, City ${Math.floor(Math.random() * 100)}`,
                country: country,
                cuisine: cuisine,
                image: `https://placehold.co/600x400?text=${encodeURIComponent(cuisine + ' Restaurant')}`,
                menuItems: {
                    create: menuItemsCreateInput
                }
            }
        });
    }

    console.log('20 Restaurants with menu items created.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
