'use client';

// pages/health-tips.js
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// Mock data for health tips articles
const MOCK_ARTICLES = [
  {
    id: 1,
    title: "Seasonal Allergies: 5 Natural Remedies That Actually Work",
    excerpt: "Discover natural ways to combat seasonal allergies without the drowsiness of traditional medications.",
    image: "/images/seasonal-allergies.jpg",
    category: "Wellness",
    readTime: "4 min read",
    authorName: "Dr. Sarah Johnson",
    authorRole: "Clinical Pharmacist",
    authorImage: "/images/dr-sarah.jpg",
    date: "May 18, 2025",
    featured: true,
  },
  {
    id: 2,
    title: "Understanding Your Medications: Common Side Effects and How to Manage Them",
    excerpt: "Learn about potential side effects of common medications and practical strategies to minimize discomfort.",
    image: "/images/medication-management.jpg",
    category: "Medication",
    readTime: "6 min read",
    authorName: "Pharm. Michael Chen",
    authorRole: "Pharmacotherapy Specialist",
    authorImage: "/images/michael-chen.jpg",
    date: "May 15, 2025",
    featured: false,
  },
  {
    id: 3,
    title: "Heart Health: Simple Daily Habits That Make a Big Difference",
    excerpt: "Small lifestyle changes that can significantly improve your cardiovascular health over time.",
    image: "/images/heart-health.jpg",
    category: "Cardiology",
    readTime: "5 min read",
    authorName: "Dr. Lisa Patel",
    authorRole: "Cardiology Consultant",
    authorImage: "/images/dr-lisa.jpg",
    date: "May 12, 2025",
    featured: false,
  },
  {
    id: 4,
    title: "Probiotics and Gut Health: What Science Really Says",
    excerpt: "A deep dive into the latest research on probiotics and their impact on digestive wellness.",
    image: "/images/gut-health.jpg",
    category: "Nutrition",
    readTime: "7 min read",
    authorName: "Dr. James Wilson",
    authorRole: "Nutritional Pharmacist",
    authorImage: "/images/dr-james.jpg",
    date: "May 10, 2025",
    featured: false,
  },
  {
    id: 5,
    title: "Sleep Better Tonight: Pharmaceutical and Natural Approaches",
    excerpt: "Evidence-based strategies to improve your sleep quality without creating dependency.",
    image: "/images/sleep-better.jpg",
    category: "Wellness",
    readTime: "5 min read",
    authorName: "Dr. Emma Rodriguez",
    authorRole: "Sleep Specialist",
    authorImage: "/images/dr-emma.jpg",
    date: "May 7, 2025",
    featured: true,
  },
  {
    id: 6,
    title: "Diabetes Management: Beyond Medication",
    excerpt: "Complementary strategies to help manage diabetes alongside your prescribed treatment plan.",
    image: "/images/diabetes-management.jpg",
    category: "Chronic Care",
    readTime: "8 min read",
    authorName: "Pharm. David Thompson",
    authorRole: "Diabetes Care Specialist",
    authorImage: "/images/david-thompson.jpg",
    date: "May 5, 2025",
    featured: false,
  }
];

// Available categories for filtering
const CATEGORIES = ["All", "Wellness", "Medication", "Nutrition", "Cardiology", "Chronic Care"];

export default function HealthTips() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [articles, setArticles] = useState([]);
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [email, setEmail] = useState("");

  // Simulate fetching articles from API
  useEffect(() => {
    // Filter articles based on search and category
    const filteredArticles = MOCK_ARTICLES.filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === "All" || article.category === activeCategory;
      return matchesSearch && matchesCategory;
    });

    setArticles(filteredArticles);
    setFeaturedArticles(MOCK_ARTICLES.filter(article => article.featured));
  }, [searchTerm, activeCategory]);

  const handleSubscribe = (e) => {
    e.preventDefault();
    // In a real app, this would call an API to register the email
    setIsSubscribed(true);
    setEmail("");
    // After 3 seconds, reset the subscription state
    setTimeout(() => setIsSubscribed(false), 3000);
  };

  // Handle search input changes
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Function to render placeholder image for demo purposes
  const renderImage = (src, alt, className) => {
    // In a real app, this would use actual images
    return (
      <div className={`bg-gray-200 ${className} flex items-center justify-center overflow-hidden`}>
        <span className="text-gray-400 text-xs">{alt}</span>
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>Health Tips & Wellness Advice | MediFind</title>
        <meta name="description" content="Expert health tips, medication guides, and wellness advice from trusted pharmacists and healthcare professionals." />
      </Head>

      <main className="min-h-screen bg-gradient-to-b from-white to-blue-50">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-indigo-700/90"></div>
            {/* SVG Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="url(#grid)" />
              </svg>
              <defs>
                <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
                  <path d="M0,0 L8,0 L8,8 L0,8 Z" fill="none" stroke="white" strokeWidth="0.5" />
                </pattern>
              </defs>
            </div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Health Tips & Wellness Advice
                </h1>
                <p className="text-xl md:text-2xl max-w-lg mb-6 opacity-90">
                  Expert guidance from trusted pharmacists and healthcare professionals to help you live your healthiest life.
                </p>
                <div className="relative max-w-md">
                  <input
                    type="text"
                    placeholder="Search health tips..."
                    className="w-full py-3 px-4 pr-12 rounded-full text-gray-800 focus:ring-2 focus:ring-blue-300 focus:outline-none shadow-lg"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                  <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="md:w-2/5">
                {/* SVG Illustration */}
                <div className="w-full h-64 md:h-80 relative">
                  {renderImage("/images/health-tips-hero.svg", "Health Tips Illustration", "rounded-lg w-full h-full")}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Category Navigation */}
        <section className="bg-white shadow-md sticky top-0 z-20">
          <div className="container mx-auto px-4 py-2">
            <div className="flex overflow-x-auto hide-scrollbar space-x-2">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    activeCategory === category
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Articles */}
        {featuredArticles.length > 0 && activeCategory === "All" && !searchTerm && (
          <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold mb-8 text-gray-800">Featured Health Insights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {featuredArticles.map((article) => (
                  <div key={article.id} className="bg-white rounded-xl overflow-hidden shadow-lg transition-transform hover:scale-[1.02] duration-300">
                    <div className="h-64 w-full relative">
                      {renderImage(article.image, article.title, "w-full h-full object-cover")}
                      <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                        Featured
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {article.category}
                        </span>
                        <span className="text-gray-500 text-xs">{article.readTime}</span>
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-gray-800">{article.title}</h3>
                      <p className="text-gray-600 mb-4">{article.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden">
                            {renderImage(article.authorImage, article.authorName, "w-full h-full object-cover")}
                          </div>
                          <div>
                            <p className="font-medium text-sm text-gray-800">{article.authorName}</p>
                            <p className="text-xs text-gray-500">{article.authorRole}</p>
                          </div>
                        </div>
                        <Link href={`/health-tips/${article.id}`} className="text-blue-600 font-medium text-sm hover:underline">
                          Read More â†’
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Main Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Articles Grid */}
              <div className="lg:w-2/3">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                  {searchTerm ? `Search Results for "${searchTerm}"` :
                   activeCategory !== "All" ? `${activeCategory} Articles` :
                   "Latest Health Tips"}
                </h2>

                {articles.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-xl font-medium mb-2">No articles found</h3>
                    <p className="text-gray-600 mb-4">
                      We couldn't find any articles matching your search criteria.
                    </p>
                    <button
                      onClick={() => {setSearchTerm(""); setActiveCategory("All");}}
                      className="text-blue-600 font-medium hover:underline"
                    >
                      Clear filters and try again
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {articles.map((article) => (
                      <div key={article.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                        <div className="h-48 relative">
                          {renderImage(article.image, article.title, "w-full h-full object-cover")}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                              {article.category}
                            </span>
                          </div>
                        </div>
                        <div className="p-5">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-500 text-xs">{article.date}</span>
                            <span className="text-gray-500 text-xs">{article.readTime}</span>
                          </div>
                          <h3 className="text-lg font-bold mb-2 text-gray-800">{article.title}</h3>
                          <p className="text-gray-600 text-sm mb-4">{article.excerpt}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 rounded-full overflow-hidden">
                                {renderImage(article.authorImage, article.authorName, "w-full h-full object-cover")}
                              </div>
                              <span className="text-xs text-gray-700">{article.authorName}</span>
                            </div>
                            <Link href={`/health-tips/${article.id}`} className="text-blue-600 text-sm hover:underline">
                              Read More
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {articles.length > 0 && (
                  <div className="mt-10 flex justify-center">
                    <nav className="inline-flex rounded-md shadow">
                      <a href="#" className="py-2 px-4 bg-white text-gray-500 rounded-l-md border border-gray-300 hover:bg-gray-50">
                        Previous
                      </a>
                      <a href="#" className="py-2 px-4 bg-blue-600 text-white border border-blue-600">
                        1
                      </a>
                      <a href="#" className="py-2 px-4 bg-white text-gray-500 border border-gray-300 hover:bg-gray-50">
                        2
                      </a>
                      <a href="#" className="py-2 px-4 bg-white text-gray-500 border border-gray-300 hover:bg-gray-50">
                        3
                      </a>
                      <a href="#" className="py-2 px-4 bg-white text-gray-500 rounded-r-md border border-gray-300 hover:bg-gray-50">
                        Next
                      </a>
                    </nav>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:w-1/3 space-y-8">
                {/* Newsletter Subscription */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 shadow-md">
                  <h3 className="text-xl font-bold mb-3 text-gray-800">Get Health Tips in Your Inbox</h3>
                  <p className="text-gray-600 mb-4">Subscribe to our newsletter for weekly health insights and medication updates.</p>

                  {isSubscribed ? (
                    <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Thank you for subscribing!</span>
                    </div>
                  ) : (
                    <form onSubmit={handleSubscribe} className="space-y-3">
                      <input
                        type="email"
                        placeholder="Your email address"
                        className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-300 focus:border-blue-300 focus:outline-none"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                      >
                        Subscribe Now
                      </button>
                    </form>
                  )}
                </div>

                {/* Popular Categories */}
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <h3 className="text-xl font-bold mb-4 text-gray-800">Popular Categories</h3>
                  <div className="space-y-2">
                    {CATEGORIES.filter(cat => cat !== "All").map((category) => (
                      <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className="flex items-center justify-between w-full px-4 py-2 text-left text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <span>{category}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Health Tip of the Day */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl p-6 shadow-md">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Tip of the Day</h3>
                    <span className="bg-white text-indigo-600 text-xs font-bold px-2 py-1 rounded-full">Daily</span>
                  </div>
                  <p className="text-white/90 mb-4">
                    "                    &quot;Staying hydrated helps medication absorption. Aim for 8 glasses of water daily, especially when taking pills or tablets.&quot;"
                  </p>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-6 h-6 rounded-full overflow-hidden bg-white/20">
                      {renderImage("/images/dr-tip.jpg", "Dr. Tip", "w-full h-full object-cover")}
                    </div>
                    <span className="opacity-80">Dr. Maria Gonzalez, PharmD</span>
                  </div>
                </div>

                {/* Related Resources */}
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <h3 className="text-xl font-bold mb-4 text-gray-800">Related Resources</h3>
                  <ul className="space-y-4">
                    <li>
                      <Link href="/drug/index" className="flex items-start group">
                        <div className="mr-3 mt-1 bg-blue-100 rounded-md p-2 group-hover:bg-blue-200 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors">Drug Information Database</h4>
                          <p className="text-sm text-gray-500">Comprehensive information on medications and usage guidelines</p>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link href="/use-pages/pharmacy/1" className="flex items-start group">
                        <div className="mr-3 mt-1 bg-blue-100 rounded-md p-2 group-hover:bg-blue-200 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors">Find Available Medications</h4>
                          <p className="text-sm text-gray-500">Search for medications by name, symptoms, or condition</p>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link href="/prescriptions" className="flex items-start group">
                        <div className="mr-3 mt-1 bg-blue-100 rounded-md p-2 group-hover:bg-blue-200 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors">Manage Prescriptions</h4>
                          <p className="text-sm text-gray-500">Upload and track your prescriptions in one place</p>
                        </div>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Health Quiz Callout */}
        <section className="py-10 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2 p-8 md:p-12">
                  <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full mb-4">
                    Interactive
                  </span>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                    Test Your Health Knowledge
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Take our interactive health quiz to discover how much you know about common medications
                    and receive personalized recommendations based on your results.
                  </p>
                  <Link href="/health-quiz" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
                    Start the Quiz
                  </Link>
                </div>
                <div className="md:w-1/2 bg-blue-50">
                  <div className="h-full">
                    {renderImage("/images/health-quiz.jpg", "Health Quiz", "w-full h-full object-cover")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer - Ask a Pharmacist */}
        <section className="py-12 bg-gradient-to-r from-indigo-700 to-blue-700 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-3">Have a Health Question?</h2>
            <p className="text-xl text-white/80 mb-6 max-w-2xl mx-auto">
              Our team of professional pharmacists is ready to answer your medication and health-related questions.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center bg-white text-blue-700 font-medium py-3 px-6 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Ask a Pharmacist
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </section>
      </main>

      {/* Custom CSS */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}