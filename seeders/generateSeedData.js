const fs = require('fs');
const path = require('path');

const constantsPath = 'C:\\Users\\ahaad\\OneDrive\\Desktop\\courier-medicine\\src\\constants\\index.js';
const seedersDir = __dirname;

try {
  console.log('📖 Reading frontend constants file...');
  const originalContent = fs.readFileSync(constantsPath, 'utf8');

  // Replace export const with const
  let commonJSContent = originalContent.replace(/export const/g, 'const');

  // Append module.exports
  commonJSContent += '\nmodule.exports = { TESTIMONIALS, FAQ_PAGE, BLOG_PAGE, ALL_COUNTRIES, ALL_LOCATIONS };';

  // Write temporary CommonJS file
  const tempPath = path.join(seedersDir, 'temp_constants.js');
  fs.writeFileSync(tempPath, commonJSContent, 'utf8');

  // Require it
  const { TESTIMONIALS, FAQ_PAGE, BLOG_PAGE, ALL_COUNTRIES, ALL_LOCATIONS } = require('./temp_constants');

  // 1. Write countriesData.js
  const countries = ALL_COUNTRIES.map(c => ({
    code: c.code,
    name: c.name,
    slug: c.slug,
    basePrice: c.basePrice,
    advice: c.advice || ''
  }));
  fs.writeFileSync(
    path.join(seedersDir, 'countriesData.js'),
    `module.exports = ${JSON.stringify(countries, null, 2)};\n`,
    'utf8'
  );
  console.log(`✅ Generated countriesData.js with ${countries.length} countries.`);

  // 2. Write locationsData.js
  const locations = ALL_LOCATIONS.map(l => ({
    locationId: l.id,
    city: l.city,
    country: l.country,
    name: l.name,
    slug: l.slug
  }));
  fs.writeFileSync(
    path.join(seedersDir, 'locationsData.js'),
    `module.exports = ${JSON.stringify(locations, null, 2)};\n`,
    'utf8'
  );
  console.log(`✅ Generated locationsData.js with ${locations.length} locations.`);

  // 3. Write testimonialsData.js
  const testimonials = (TESTIMONIALS.list || []).map(t => ({
    name: t.name,
    rating: t.rating || 5,
    country: t.country || 'International',
    avatar: t.avatar || '',
    review: t.review,
    designation: t.designation || 'Verified Customer',
    date: t.date || 'Posted recently'
  }));
  fs.writeFileSync(
    path.join(seedersDir, 'testimonialsData.js'),
    `module.exports = ${JSON.stringify(testimonials, null, 2)};\n`,
    'utf8'
  );
  console.log(`✅ Generated testimonialsData.js with ${testimonials.length} testimonials.`);

  // 4. Write faqsData.js
  const faqs = (FAQ_PAGE.questions || []).map(f => ({
    question: f.q,
    answer: f.a,
    category: 'general'
  }));
  fs.writeFileSync(
    path.join(seedersDir, 'faqsData.js'),
    `module.exports = ${JSON.stringify(faqs, null, 2)};\n`,
    'utf8'
  );
  console.log(`✅ Generated faqsData.js with ${faqs.length} FAQs.`);

  // 5. Write blogsData.js
  const blogs = (BLOG_PAGE.posts || []).map(b => {
    const slug = b.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    return {
      title: b.title,
      slug,
      excerpt: b.excerpt,
      content: b.content || b.excerpt, // fallback if content is empty
      image: b.image || '',
      author: b.author || 'Admin',
      category: b.category || 'Courier Guide',
      tags: b.tags || ['Medicine Courier'],
      readTime: b.readTime || '5 min read',
      isPublished: true,
      publishedAt: new Date('2026-06-19')
    };
  });
  fs.writeFileSync(
    path.join(seedersDir, 'blogsData.js'),
    `module.exports = ${JSON.stringify(blogs, null, 2)};\n`,
    'utf8'
  );
  console.log(`✅ Generated blogsData.js with ${blogs.length} blogs.`);

  // Clean up
  fs.unlinkSync(tempPath);
  console.log('🧹 Cleaned up temporary constants file.');

} catch (error) {
  console.error('❌ Error during data generation:', error);
}
