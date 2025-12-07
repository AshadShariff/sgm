import type { Metadata } from "next"
import Header from "../components/header"
import AiClonePage from "../components/ai-clone-page"

const baseUrl = "https://signatureglobalmedia.com"
const canonicalUrl = baseUrl // Canonical points to base domain
const pageUrl = `${baseUrl}/ai-clone` // Full URL for other uses

export const metadata: Metadata = {
  title: "AI Clone — Create Your Digital Twin in 30 Minutes | Signature Global Media",
  description:
    "Create your AI video clone in just 30 minutes. No camera, no editing, no tech skills needed. Professional AI videos that market your business. Get started for just $37.",
  keywords: [
    "AI clone",
    "AI video clone",
    "digital twin",
    "AI avatar",
    "video clone",
    "AI video generation",
    "automated video creation",
    "AI content creation",
    "video marketing",
    "AI spokesperson",
  ],
  authors: [{ name: "Signature Global Media" }],
  creator: "Signature Global Media",
  publisher: "Signature Global Media",
  alternates: {
    canonical: canonicalUrl,
  },
  openGraph: {
    title: "AI Clone — Create Your Digital Twin in 30 Minutes",
    description:
      "Create your AI video clone in just 30 minutes. No camera, no editing, no tech skills needed. Professional AI videos that market your business.",
    url: pageUrl,
    siteName: "Signature Global Media",
    images: [
      {
        url: `${baseUrl}/og-ai-clone.jpg`,
        width: 1200,
        height: 630,
        alt: "AI Clone - Create Your Digital Twin",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Clone — Create Your Digital Twin in 30 Minutes",
    description:
      "Create your AI video clone in just 30 minutes. No camera, no editing, no tech skills needed.",
    images: [`${baseUrl}/og-ai-clone.jpg`],
    creator: "@SignatureGlobal",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION,
  },
}

export default function AiClone() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "AI Clone Service",
    description:
      "Create your AI video clone in just 30 minutes. No camera, no editing, no tech skills needed. Professional AI videos that market your business.",
    brand: {
      "@type": "Brand",
      name: "Signature Global Media",
    },
    offers: {
      "@type": "Offer",
      price: "37.00",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: pageUrl,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "500",
    },
    category: "AI Video Generation Service",
  }

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Signature Global Media",
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    sameAs: [
      "https://www.facebook.com/signatureglobalmedia",
      "https://www.twitter.com/signatureglobal",
      "https://www.linkedin.com/company/signatureglobalmedia",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      email: "support@signatureglobalmedia.com",
    },
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "AI Clone",
        item: pageUrl,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Header />
      <AiClonePage />
    </>
  )
}

