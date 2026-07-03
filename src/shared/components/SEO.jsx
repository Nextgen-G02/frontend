import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEO({ 
  title, 
  description, 
  keywords, 
  image, 
  url, 
  type = "website",
  productData = null
}) {
  const siteName = "Nirosha Sweet House";
  const defaultDescription = "Premium bakery and luxury sweet house offering exquisite custom cakes, fresh pastries, and authentic sweets for all your special occasions.";
  const defaultImage = "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=1200"; // Fallback image
  const defaultKeywords = "luxury cakes, sweet house, premium bakery, custom birthday cakes, wedding cakes, fresh pastries, online cake delivery, eggless cakes";

  const seoTitle = title ? `${title} | ${siteName}` : siteName;
  const seoDescription = description || defaultDescription;
  const seoImage = image || defaultImage;
  const seoUrl = url ? `${import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173'}${url}` : import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173';
  const seoKeywords = keywords || defaultKeywords;

  // Generate JSON-LD Structured Data for Rich Snippets (Crucial for Google Ranking)
  let schemaData = {
    "@context": "https://schema.org",
    "@type": "Bakery",
    "name": siteName,
    "image": defaultImage,
    "description": defaultDescription,
    "url": seoUrl,
    "telephone": "+1234567890",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Main Street",
      "addressLocality": "City",
      "addressRegion": "State",
      "postalCode": "00000",
      "addressCountry": "Country"
    }
  };

  // If this is a product page, output Product schema
  if (type === "product" && productData) {
    schemaData = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": productData.name,
      "image": seoImage,
      "description": seoDescription,
      "sku": productData.id,
      "offers": {
        "@type": "Offer",
        "url": seoUrl,
        "priceCurrency": "USD", // Or your local currency LKR
        "price": productData.price,
        "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
        "itemCondition": "https://schema.org/NewCondition",
        "availability": productData.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "124"
      }
    };
  }

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeywords} />
      
      {/* Open Graph / Facebook (For Social Media Previews) */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={seoUrl} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter (For Twitter Cards) */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={seoUrl} />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />

      {/* Canonical Tag (Prevents Duplicate Content Penalties) */}
      <link rel="canonical" href={seoUrl} />

      {/* JSON-LD Schema (For Rich Snippets on Google Search) */}
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    </Helmet>
  );
}
