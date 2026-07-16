const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Farm = require('./models/Farm');
const Crop = require('./models/Crop');
const SoilRecord = require('./models/SoilRecord');
const Finance = require('./models/Finance');
const Notification = require('./models/Notification');
const GovernmentScheme = require('./models/GovernmentScheme');
const MandiPrice = require('./models/MandiPrice');
const { generateQR } = require('./utils/qrCodeGenerator');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart_agriculture');
    console.log('MongoDB Connected for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Farm.deleteMany({});
    await Crop.deleteMany({});
    await SoilRecord.deleteMany({});
    await Finance.deleteMany({});
    await Notification.deleteMany({});
    await GovernmentScheme.deleteMany({});
    await MandiPrice.deleteMany({});
    console.log('Cleared all existing data from database.');

    // 1. Seed Users (Admin & Farmers)
    console.log('Creating Admin & Farmers...');
    
    const adminQr = await generateQR(JSON.stringify({ id: 'ADM-001', name: 'System Administrator', role: 'admin' }));
    const admin = await User.create({
      email: 'admin@smartagri.com',
      password: 'password123',
      role: 'admin',
      profile: {
        name: 'System Administrator',
        phone: '9999999999',
        farmerId: 'ADM-001',
        qrCode: adminQr,
        photoUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Admin'
      }
    });

    const rameshQr = await generateQR(JSON.stringify({ id: 'FAR-582914', name: 'Ramesh Kumar', phone: '9876543210', village: 'Rampur', role: 'farmer' }));
    const ramesh = await User.create({
      email: 'ramesh@farm.com',
      password: 'password123',
      role: 'farmer',
      profile: {
        name: 'Ramesh Kumar',
        age: 42,
        phone: '9876543210',
        address: 'House 14, Main Mandi Road',
        village: 'Rampur',
        district: 'Karnal',
        state: 'Haryana',
        farmerId: 'FAR-582914',
        farmSize: 5.5,
        soilType: 'Loamy',
        irrigationType: 'Tubewell',
        experience: 15,
        qrCode: rameshQr,
        photoUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Ramesh'
      }
    });

    const sureshQr = await generateQR(JSON.stringify({ id: 'FAR-612739', name: 'Suresh Patel', phone: '9123456789', village: 'Anand', role: 'farmer' }));
    const suresh = await User.create({
      email: 'suresh@farm.com',
      password: 'password123',
      role: 'farmer',
      profile: {
        name: 'Suresh Patel',
        age: 38,
        phone: '9123456789',
        address: 'Farm House 3, Village Anand',
        village: 'Anand',
        district: 'Kheda',
        state: 'Gujarat',
        farmerId: 'FAR-612739',
        farmSize: 12.0,
        soilType: 'Black Soil',
        irrigationType: 'Drip Irrigation',
        experience: 10,
        qrCode: sureshQr,
        photoUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Suresh'
      }
    });

    // 2. Seed Farms
    console.log('Creating Farms...');
    const farm1 = await Farm.create({
      userId: ramesh._id,
      name: 'Ramesh Karnal Farm A',
      location: 'Rampur, Karnal, Haryana',
      latitude: 29.6857,
      longitude: 76.9905,
      area: 3.5,
      soilType: 'Alluvial Soil',
      waterSource: 'Tubewell',
      previousCrop: 'Rice',
      currentCrop: 'Wheat',
      expectedHarvestDate: new Date('2026-10-15')
    });

    const farm2 = await Farm.create({
      userId: ramesh._id,
      name: 'Ramesh Karnal Farm B',
      location: 'Kunjpura, Karnal, Haryana',
      latitude: 29.7180,
      longitude: 77.0850,
      area: 2.0,
      soilType: 'Loamy',
      waterSource: 'Rainfed',
      previousCrop: 'Fallow',
      currentCrop: 'Mustard',
      expectedHarvestDate: new Date('2026-11-01')
    });

    const farm3 = await Farm.create({
      userId: suresh._id,
      name: 'Suresh Anand Cotton Lands',
      location: 'Anand, Kheda, Gujarat',
      latitude: 22.5645,
      longitude: 72.9289,
      area: 12.0,
      soilType: 'Black Soil',
      waterSource: 'Drip Irrigation',
      previousCrop: 'Groundnut',
      currentCrop: 'Cotton',
      expectedHarvestDate: new Date('2026-12-10')
    });

    // 3. Seed Crops
    console.log('Creating Crops...');
    await Crop.create({
      userId: ramesh._id,
      farmId: farm1._id,
      name: 'Wheat',
      variety: 'Kalyan Sona',
      stage: 'Vegetative',
      plantedDate: new Date('2026-05-10'),
      expectedHarvestDate: new Date('2026-10-15'),
      history: [
        { stage: 'Sowing', date: new Date('2026-05-10'), notes: 'Wheat seeds sowed.' },
        { stage: 'Vegetative', date: new Date('2026-06-15'), notes: 'Irrigated and weeded.' }
      ]
    });

    await Crop.create({
      userId: suresh._id,
      farmId: farm3._id,
      name: 'Cotton',
      variety: 'Bt Cotton',
      stage: 'Flowering',
      plantedDate: new Date('2026-04-01'),
      expectedHarvestDate: new Date('2026-12-10'),
      history: [
        { stage: 'Sowing', date: new Date('2026-04-01'), notes: 'Bt Cotton sown using drip irrigation.' },
        { stage: 'Vegetative', date: new Date('2026-05-20'), notes: 'First fertilizer dose applied.' },
        { stage: 'Flowering', date: new Date('2026-07-01'), notes: 'Cotton plants started flowering.' }
      ]
    });

    // 4. Seed Soil Records
    console.log('Creating Soil Records...');
    // Ramesh's Farm A: Slightly nitrogen deficient
    await SoilRecord.create({
      userId: ramesh._id,
      farmId: farm1._id,
      N: 90,
      P: 42,
      K: 180,
      pH: 6.8,
      organicCarbon: 0.65,
      moisture: 45
    });

    // Suresh's Cotton Lands: Very healthy soil
    await SoilRecord.create({
      userId: suresh._id,
      farmId: farm3._id,
      N: 180,
      P: 50,
      K: 240,
      pH: 7.2,
      organicCarbon: 1.1,
      moisture: 52
    });

    // 5. Seed Financial Logs
    console.log('Creating Expenses & Income Logs...');
    // Ramesh logs
    await Finance.create({
      userId: ramesh._id,
      type: 'expense',
      category: 'Seeds',
      amount: 4500,
      farmId: farm1._id,
      crop: 'Wheat',
      description: 'Purchased Kalyan Sona Wheat Seeds',
      date: new Date('2026-05-08')
    });
    await Finance.create({
      userId: ramesh._id,
      type: 'expense',
      category: 'Fertilizers',
      amount: 3200,
      farmId: farm1._id,
      crop: 'Wheat',
      description: 'NPK and Urea fertilizers purchase',
      date: new Date('2026-05-25')
    });
    await Finance.create({
      userId: ramesh._id,
      type: 'income',
      category: 'Market Sale',
      amount: 85000,
      farmId: farm1._id,
      crop: 'Rice',
      description: 'Sold previous Rice harvest in Karnal Mandi',
      date: new Date('2026-04-20')
    });

    // Suresh logs
    await Finance.create({
      userId: suresh._id,
      type: 'expense',
      category: 'Labour',
      amount: 12000,
      farmId: farm3._id,
      crop: 'Cotton',
      description: 'Labour payments for sowing & setup',
      date: new Date('2026-04-05')
    });
    await Finance.create({
      userId: suresh._id,
      type: 'expense',
      category: 'Water',
      amount: 2500,
      farmId: farm3._id,
      crop: 'Cotton',
      description: 'Drip irrigation power charges',
      date: new Date('2026-05-15')
    });
    await Finance.create({
      userId: suresh._id,
      type: 'income',
      category: 'Subsidy',
      amount: 6000,
      description: 'PM Kisan installment received',
      date: new Date('2026-06-01')
    });

    // 6. Seed Mandi Prices
    console.log('Creating Mandi Prices...');
    const cropsToPrice = ['Wheat', 'Rice', 'Cotton', 'Sugarcane', 'Tomato', 'Potato'];
    const markets = [
      { name: 'Karnal Mandi', state: 'Haryana', basePrice: 2200 },
      { name: 'Rajkot Mandi', state: 'Gujarat', basePrice: 2150 },
      { name: 'Hapur Mandi', state: 'Uttar Pradesh', basePrice: 2250 },
      { name: 'Indore Mandi', state: 'Madhya Pradesh', basePrice: 2180 }
    ];

    for (const c of cropsToPrice) {
      let multiplier = 1;
      if (c === 'Cotton') multiplier = 3.2; // Cotton is pricier (e.g. 7000/quintal)
      if (c === 'Sugarcane') multiplier = 0.18; // Sugarcane (e.g. 400/quintal)
      if (c === 'Tomato' || c === 'Potato') multiplier = 0.7; // Vegetables (e.g. 1500/quintal)

      for (const m of markets) {
        // Create price with random variation
        const randomVariation = Math.floor(Math.random() * 200) - 100;
        await MandiPrice.create({
          crop: c,
          market: m.name,
          price: Math.round(m.basePrice * multiplier) + randomVariation,
          state: m.state,
          date: new Date()
        });
      }
    }

    // 7. Seed Government Schemes
    console.log('Creating Government Schemes...');
    await GovernmentScheme.create({
      title: 'PM Kisan Samman Nidhi',
      description: 'An initiative by the Government of India in which all farmers get up to ₹6,000 per year in three equal installments as minimum income support.',
      department: 'Ministry of Agriculture and Farmers Welfare',
      benefit: '₹6,000 per year directly to bank account',
      eligibility: {
        minAge: 18,
        maxAge: 100,
        maxFarmSize: 5.0, // small farmers focus
        states: [] // nationwide
      },
      link: 'https://pmkisan.gov.in'
    });

    await GovernmentScheme.create({
      title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
      description: 'An government-sponsored crop insurance scheme that integrates multiple stakeholders and secures farmers against yield losses.',
      department: 'Ministry of Agriculture and Farmers Welfare',
      benefit: 'Full insurance coverage for crops against natural calamities at low premium (1.5% - 2%)',
      eligibility: {
        minAge: 18,
        maxAge: 100,
        states: []
      },
      link: 'https://pmfby.gov.in'
    });

    await GovernmentScheme.create({
      title: 'Gujarat Drip Irrigation Subsidy',
      description: 'State sponsored scheme in Gujarat to promote water conservation. Grants substantial subsidies on installation of Micro Irrigation Systems.',
      department: 'Gujarat Green Revolution Company (GGRC)',
      benefit: 'Up to 70% subsidy on Drip/Sprinkler Irrigation systems',
      eligibility: {
        minAge: 18,
        maxAge: 100,
        states: ['Gujarat']
      },
      link: 'https://ggrc.co.in'
    });

    // 8. Seed Notifications
    console.log('Creating Notifications...');
    // Global broadcasts
    await Notification.create({
      userId: null,
      title: 'Heavy Rainfall Warning',
      message: 'IMD predicts heavy rainfall across Haryana and Punjab over the next 48 hours. Secure harvested crops.',
      type: 'weather'
    });

    await Notification.create({
      userId: null,
      title: 'PM-Kisan Installment Released',
      message: 'The 17th installment of PM Kisan has been successfully disbursed to eligible bank accounts.',
      type: 'scheme'
    });

    // Farmer specific reminders
    await Notification.create({
      userId: ramesh._id,
      title: 'Soil Card Analysis Available',
      message: 'Your soil health card analysis for Farm A has been compiled. You can now download the PDF card.',
      type: 'general'
    });

    await Notification.create({
      userId: suresh._id,
      title: 'Irrigation Advisory',
      message: 'Anand region temperature is expected to reach 39°C. Increase drip watering duration for Cotton by 15 mins.',
      type: 'water'
    });

    console.log('Database Seeding Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedData();
