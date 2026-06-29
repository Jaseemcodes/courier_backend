const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Pricing = require('../models/Pricing');
const Provider = require('../models/Provider');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

mongoose.connect(process.env.MONGO_URI);

const extractProviders = async () => {
  try {
    const pricings = await Pricing.find();
    const uniqueProviders = new Set();
    const providerMap = {}; // name -> image

    for (const pricing of pricings) {
      pricing.providers.forEach(p => {
        uniqueProviders.add(p.provider);
        if (p.image && !providerMap[p.provider]) {
          providerMap[p.provider] = p.image;
        }
      });
    }

    let addedCount = 0;
    for (const name of uniqueProviders) {
      const existing = await Provider.findOne({ name });
      if (!existing) {
        await Provider.create({
          name,
          image: providerMap[name] || ''
        });
        addedCount++;
      }
    }

    // Now remove `image` from Pricing (by setting to undefined/unsetting)
    for (const pricing of pricings) {
      pricing.providers.forEach(p => {
        p.image = undefined;
      });
      await pricing.save();
    }

    console.log(`Extracted ${addedCount} providers globally and removed image from Pricing schema.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

extractProviders();
