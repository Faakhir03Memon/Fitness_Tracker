const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Food = require('./models/Food');

dotenv.config();

const ASIAN_FOOD_DATABASE = [
    { name: 'Omelette (2 eggs)', cal: 180, pro: 12, carb: 2, fat: 14, category: 'Breakfast' },
    { name: 'Paratha (Whole Wheat)', cal: 260, pro: 5, carb: 35, fat: 12, category: 'Breakfast' },
    { name: 'Anda Paratha', cal: 440, pro: 17, carb: 37, fat: 26, category: 'Breakfast' },
    { name: 'Apple', cal: 95, pro: 0.5, carb: 25, fat: 0.3, category: 'Snack' },
    { name: 'Chicken Karahi (250g)', cal: 450, pro: 35, carb: 8, fat: 30, category: 'Lunch/Dinner' },
    { name: 'Roti (Plain)', cal: 120, pro: 4, carb: 24, fat: 0.5, category: 'Lunch/Dinner' },
    { name: 'Dal Chawal (Medium Bowl)', cal: 350, pro: 12, carb: 65, fat: 4, category: 'Lunch/Dinner' },
    { name: 'Beef Biryani (Plate)', cal: 550, pro: 25, carb: 75, fat: 18, category: 'Lunch/Dinner' },
    { name: 'Grilled Chicken Tikka', cal: 220, pro: 38, carb: 2, fat: 6, category: 'Lunch/Dinner' },
    { name: 'Lentil Soup (Dal)', cal: 180, pro: 10, carb: 28, fat: 2, category: 'Lunch/Dinner' },
    { name: 'Mixed Salad', cal: 50, pro: 2, carb: 8, fat: 0, category: 'Side' },
    { name: 'Greek Yogurt (Cup)', cal: 150, pro: 15, carb: 6, fat: 8, category: 'Snack' },
    { name: 'Haleem (Bowl)', cal: 420, pro: 28, carb: 45, fat: 12, category: 'Lunch/Dinner' },
    { name: 'Chicken Biryani (Plate)', cal: 500, pro: 22, carb: 70, fat: 15, category: 'Lunch/Dinner' },
    { name: 'Mutton Karahi (250g)', cal: 520, pro: 30, carb: 5, fat: 40, category: 'Lunch/Dinner' },
    { name: 'Chana Chaat (Bowl)', cal: 250, pro: 10, carb: 45, fat: 5, category: 'Snack' },
    { name: 'Samosa (1 piece)', cal: 260, pro: 4, carb: 32, fat: 14, category: 'Snack' },
    { name: 'Pakora (100g)', cal: 320, pro: 6, carb: 30, fat: 20, category: 'Snack' },
    { name: 'Naan (Plain)', cal: 260, pro: 8, carb: 45, fat: 4, category: 'Lunch/Dinner' },
    { name: 'Garlic Naan', cal: 300, pro: 8, carb: 48, fat: 8, category: 'Lunch/Dinner' },
    { name: 'Seekh Kebab (Beef, 1 pc)', cal: 150, pro: 12, carb: 2, fat: 10, category: 'Lunch/Dinner' },
    { name: 'Chicken Kebab (1 pc)', cal: 120, pro: 14, carb: 2, fat: 6, category: 'Lunch/Dinner' },
    { name: 'Nihari (Bowl)', cal: 450, pro: 25, carb: 15, fat: 30, category: 'Lunch/Dinner' },
    { name: 'Paya (Bowl)', cal: 550, pro: 28, carb: 10, fat: 40, category: 'Lunch/Dinner' },
    { name: 'Aloo Gosht (Bowl)', cal: 380, pro: 22, carb: 20, fat: 22, category: 'Lunch/Dinner' },
    { name: 'Bhindi Masala (Plate)', cal: 210, pro: 4, carb: 15, fat: 14, category: 'Lunch/Dinner' },
    { name: 'Palak Paneer (Plate)', cal: 340, pro: 14, carb: 12, fat: 26, category: 'Lunch/Dinner' },
    { name: 'Aloo Paratha', cal: 350, pro: 8, carb: 45, fat: 16, category: 'Breakfast' },
    { name: 'Halwa Puri (1 Puri + Halwa)', cal: 450, pro: 6, carb: 55, fat: 22, category: 'Breakfast' },
    { name: 'Cholay (Chickpea Curry)', cal: 280, pro: 12, carb: 35, fat: 10, category: 'Lunch/Dinner' },
    { name: 'Lassi (Sweet, Glass)', cal: 220, pro: 8, carb: 30, fat: 8, category: 'Drink' },
    { name: 'Lassi (Salted, Glass)', cal: 150, pro: 8, carb: 10, fat: 8, category: 'Drink' },
    { name: 'Chai (with sugar & milk)', cal: 120, pro: 2, carb: 18, fat: 4, category: 'Drink' },
    { name: 'Green Tea (No Sugar)', cal: 2, pro: 0, carb: 0, fat: 0, category: 'Drink' },
    { name: 'Rooh Afza (Glass)', cal: 180, pro: 0, carb: 45, fat: 0, category: 'Drink' },
    { name: 'Chapli Kebab (1 pc)', cal: 250, pro: 15, carb: 8, fat: 18, category: 'Lunch/Dinner' },
    { name: 'Shami Kebab (1 pc)', cal: 150, pro: 8, carb: 10, fat: 8, category: 'Snack' },
    { name: 'Chicken Pulao (Plate)', cal: 450, pro: 20, carb: 65, fat: 12, category: 'Lunch/Dinner' },
    { name: 'Mutton Pulao (Plate)', cal: 480, pro: 22, carb: 65, fat: 15, category: 'Lunch/Dinner' },
    { name: 'Zarda (Sweet Rice, Plate)', cal: 350, pro: 4, carb: 70, fat: 8, category: 'Dessert' },
    { name: 'Kheer (Bowl)', cal: 280, pro: 6, carb: 40, fat: 10, category: 'Dessert' },
    { name: 'Gulab Jamun (2 pcs)', cal: 300, pro: 4, carb: 45, fat: 12, category: 'Dessert' },
    { name: 'Jalebi (100g)', cal: 350, pro: 2, carb: 70, fat: 8, category: 'Dessert' },
    { name: 'Rasmalai (2 pcs)', cal: 250, pro: 8, carb: 30, fat: 10, category: 'Dessert' },
    { name: 'Kulfi (1 stick)', cal: 200, pro: 5, carb: 20, fat: 12, category: 'Dessert' },
    { name: 'Fruit Chaat (Bowl)', cal: 180, pro: 2, carb: 45, fat: 1, category: 'Snack' },
    { name: 'Daal Mash (Plate)', cal: 250, pro: 14, carb: 30, fat: 8, category: 'Lunch/Dinner' },
    { name: 'Lobiya (Red Beans, Plate)', cal: 220, pro: 12, carb: 35, fat: 4, category: 'Lunch/Dinner' },
    { name: 'Keema (Minced Meat, Plate)', cal: 400, pro: 25, carb: 10, fat: 28, category: 'Lunch/Dinner' },
    { name: 'Karela Gosht', cal: 350, pro: 20, carb: 15, fat: 24, category: 'Lunch/Dinner' },
    { name: 'Tikka Macaroni', cal: 380, pro: 18, carb: 50, fat: 12, category: 'Lunch/Dinner' },
    { name: 'Chicken Shawarma', cal: 450, pro: 20, carb: 40, fat: 22, category: 'Snack' },
    { name: 'Banana', cal: 105, pro: 1, carb: 27, fat: 0.3, category: 'Snack' }
];

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to DB');
    await Food.deleteMany({});
    await Food.insertMany(ASIAN_FOOD_DATABASE);
    console.log('Foods seeded!');
    process.exit(0);
  });
