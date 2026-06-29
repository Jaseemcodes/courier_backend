const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Pricing = require('../models/Pricing');

// Load env vars
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Connect to DB
mongoose.connect(process.env.MONGO_URI);

const seedPricing = async () => {
  try {
    const data = fs.readFileSync(path.join(__dirname, '..', '..', 'courier-medicine', 'raw_pricing.txt'), 'utf8');
    const lines = data.split('\n').filter(l => l.trim().length > 0 && !l.includes('---') && !l.includes('S.No'));

    const pricingMap = {};

    lines.forEach(line => {
      const parts = line.trim().split(/\s{2,}/);
      if (parts.length >= 6) {
        const country = parts[1].trim();
        const provider = parts[2].trim();
        const halfKgPrice = parseInt(parts[3].trim());
        const oneKgPrice = parseInt(parts[4].trim());
        const timeline = parts[5].trim();

        if (!pricingMap[country]) {
          pricingMap[country] = [];
        }

        pricingMap[country].push({
          provider,
          halfKgPrice,
          oneKgPrice,
          timeline
        });
      }
    });

    const pricingDataArray = Object.keys(pricingMap).map(country => ({
      country,
      providers: pricingMap[country]
    }));

    await Pricing.deleteMany();
    console.log('Old pricing data destroyed...');

    await Pricing.create(pricingDataArray);
    console.log('Pricing data seeded successfully!');

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedPricing();
