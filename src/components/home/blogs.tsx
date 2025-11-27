import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

type Blog = {
  title: string;
  category: string;
  excerpt: string;
  image: string;
  content: string;
};

const blogs: Blog[] = [
  {
    title: "Tata Intra V70 – Best Pickup for Heavy Load & Long Routes",
    category: "SCV Cargo",
    excerpt:
      "2000 kg payload, biggest 10.2 ft body & best mileage makes Intra V70 the no.1 choice for serious business…",
    image:
      "https://res.cloudinary.com/dsadzuh5q/image/upload/v1756887778/products/1756887777950-Tata_Intra_%20V70_2000Kg_Payload_%20Gold.png",
    content: `
      <h2 class='text-2xl font-bold mb-4'>Tata Intra V70 – Ultimate Pickup for Profit</h2>
      <p class='mb-3'>Tata Intra V70 is designed for customers who want <strong>maximum payload, bigger body and better mileage</strong>.</p>

      <ul class='list-disc ml-6 space-y-2'>
        <li><strong>Payload:</strong> Up to 2000 kg – ideal for construction & agri load.</li>
        <li><strong>Load body size:</strong> 10.2 ft – segment-best.</li>
        <li><strong>Mileage:</strong> 14–16 kmpl depending on conditions.</li>
        <li><strong>Comfort cabin:</strong> Car-like seats + low NVH.</li>
        <li><strong>No DEF:</strong> Lower lifetime maintenance cost.</li>
      </ul>

      <p class='mt-4'>Perfect for sand/brick supply and district-to-district routes.</p>
    `,
  },
  {
    title: "Tata Ace Gold Diesel – India's Most Trusted Mini Truck",
    category: "SCV Cargo",
    excerpt:
      "900 kg payload, legendary reliability and low maintenance cost make Ace Gold Diesel a favourite…",
    image:
      "https://res.cloudinary.com/dsadzuh5q/image/upload/v1756898971/products/1756898971321-ACE%20GOLD%20Diesel%20HT%2B%20-%2002_4.png",
    content: `
      <h2 class='text-2xl font-bold mb-4'>Why Tata Ace Gold Diesel Still Rules the Market</h2>
      <p class='mb-3'>Ace Gold Diesel is known as <strong>Chhota Hathi</strong> — India's no.1 mini truck.</p>

      <ul class='list-disc ml-6 space-y-2'>
        <li><strong>Payload:</strong> 900 kg.</li>
        <li><strong>Engine:</strong> Proven & fuel-efficient.</li>
        <li><strong>Compact size:</strong> Best for narrow city lanes.</li>
        <li><strong>Low maintenance:</strong> Fewer workshop visits.</li>
        <li><strong>High resale value:</strong> Huge demand in used market.</li>
      </ul>

      <p class='mt-4'>Best choice for first-time owner-drivers.</p>
    `,
  },
  {
    title: "Magic Mantra – The Future of Rural Passenger Mobility",
    category: "Passenger",
    excerpt:
      "High mileage CNG, 10-seat comfort and low running cost make Magic Mantra ideal for rural routes…",
    image:
      "https://res.cloudinary.com/dsadzuh5q/image/upload/v1757243715/products/1757243715023-Magic_Mantra.png",
    content: `
      <h2 class='text-2xl font-bold mb-4'>Magic Mantra – Best for Village to Town Connectivity</h2>
      <p class='mb-3'>Magic Mantra is an <strong>employment generation vehicle</strong>.</p>

      <ul class='list-disc ml-6 space-y-2'>
        <li><strong>Seating:</strong> 9–10 seat layout.</li>
        <li><strong>Fuel:</strong> CNG for ultra-low running cost.</li>
        <li><strong>Comfort:</strong> Safer and better than open jeeps.</li>
        <li><strong>Income:</strong> Multiple trips = daily steady earning.</li>
        <li><strong>Brand trust:</strong> Tata service network.</li>
      </ul>

      <p class='mt-4'>Perfect for school staff routes + rural connectivity.</p>
    `,
  },
  {
    title:
      "Tata Yodha Pickup – Strongest Partner for Rural & Construction Work",
    category: "Pickup",
    excerpt:
      "High ground clearance, strong chassis & powerful diesel engine make Yodha unbeatable…",
    image:
      "https://res.cloudinary.com/dsadzuh5q/image/upload/v1756905230/products/1756905229907-Yodha%202.png",
    content: `
      <h2 class='text-2xl font-bold mb-4'>Yodha – Built Tough for Heavy Duty Jobs</h2>
      <p class='mb-3'>Yodha is trusted by contractors, farmers & fleet owners.</p>

      <ul class='list-disc ml-6 space-y-2'>
        <li><strong>Payload:</strong> 1250–2000 kg.</li>
        <li><strong>Chassis:</strong> Heavy-duty ladder frame.</li>
        <li><strong>Ground clearance:</strong> Perfect for village roads.</li>
        <li><strong>Use cases:</strong> Sand, bricks, agri, market load.</li>
        <li><strong>ROI:</strong> Low downtime + fast payback.</li>
      </ul>
    `,
  },
  {
    title: "7 Proven Ways to Improve Mileage of Commercial Vehicles",
    category: "Maintenance",
    excerpt:
      "Driving habits, tyre pressure and load affect mileage. Here are 7 proven tips…",
    image:
      "https://res.cloudinary.com/dsadzuh5q/image/upload/v1757263271/products/1757263271143-1757010297057-LPT_1212.png",
    content: `
      <h2 class='text-2xl font-bold mb-4'>7 Proven Ways to Improve Mileage</h2>

      <ul class='list-disc ml-6 space-y-2'>
        <li>Maintain tyre pressure.</li>
        <li>Avoid sudden acceleration.</li>
        <li>Regular service.</li>
        <li>No overloading.</li>
        <li>Wheel alignment.</li>
        <li>Right gear, right RPM.</li>
        <li>Avoid idling.</li>
      </ul>

      <p class='mt-4'>Just 5% mileage improvement saves thousands annually.</p>
    `,
  },
  {
    title: "FleetEdge – Smart Fleet & Trip Management System",
    category: "Telematics",
    excerpt:
      "FleetEdge gives live tracking, fuel insights, driver behaviour & maintenance alerts…",
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop",
    content: `
      <h2 class='text-2xl font-bold mb-4'>FleetEdge – Total Fleet Control</h2>

      <ul class='list-disc ml-6 space-y-2'>
        <li>Live tracking.</li>
        <li>Driver behaviour analysis.</li>
        <li>Fuel monitoring.</li>
        <li>Route optimisation.</li>
        <li>Maintenance alerts.</li>
      </ul>

      <p class='mt-4'>Telematics improves profitability by 10–20%.</p>
    `,
  },
  {
    title: "Why Bihar is Rapidly Shifting to CNG Commercial Vehicles",
    category: "CNG Future",
    excerpt:
      "CNG network expansion & ultra-low running cost is transforming Bihar’s CV sector…",
    image:
      "https://4.imimg.com/data4/VN/TP/MY-25299022/tata-ace-cng-bs4-1000x1000.jpg",
    content: `
      <h2 class='text-2xl font-bold mb-4'>CNG – The New Backbone of Transport</h2>

      <ul class='list-disc ml-6 space-y-2'>
        <li>₹2.5/km running cost.</li>
        <li>Growing CNG network.</li>
        <li>Cleaner fuel.</li>
        <li>Higher engine life.</li>
        <li>Govt. push.</li>
      </ul>
    `,
  },
  {
    title: "Annual Maintenance Contract (AMC) – Peace of Mind for Fleet Owners",
    category: "AMC",
    excerpt: "AMC reduces breakdowns, fixes service cost and increases uptime…",
    image:
      "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?q=80&w=1200&auto=format&fit=crop",
    content: `
      <h2 class='text-2xl font-bold mb-4'>Why AMC is a Must</h2>

      <ul class='list-disc ml-6 space-y-2'>
        <li>Predictable cost.</li>
        <li>Zero breakdown mindset.</li>
        <li>Priority service.</li>
        <li>Genuine parts.</li>
        <li>Better resale.</li>
      </ul>
    `,
  },
];

export default function BlogsPage() {
  const [openBlog, setOpenBlog] = useState<Blog | null>(null);

  return (
    <div className="bg-black text-white font-sans">
      <Header />

      {/* Breadcrumb */}
      <nav className="max-w-7xl mx-auto px-6 py-4 text-sm">
        <ol className="flex items-center space-x-2">
          <li>
            <Link to="/" className="text-blue-400 hover:text-blue-500">
              Home
            </Link>
          </li>
          <li className="text-gray-400">›</li>
          <li className="text-white font-medium">Blogs</li>
        </ol>
      </nav>

      {/* Hero */}
      <div
        className="relative h-[380px] md:h-[460px] bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1580674285054-bed31e145f59?q=80&w=1600&auto=format&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-10 flex items-center justify-center h-full text-center px-6">
          <div className="max-w-4xl">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Expert Insights for Tata Commercial Vehicle Owners
            </h1>
            <p className="text-gray-300 text-base md:text-lg">
              Maintenance tips, CNG trends, telematics, AMC benefits & more.
            </p>
          </div>
        </div>
      </div>

      {/* Blog List */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl md:text-3xl font-semibold mb-10 text-center">
          Latest Blogs
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog, index) => (
            <div
              key={index}
              className="bg-[#111] rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition"
            >
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-52 object-cover"
              />

              <div className="p-6">
                <span className="text-[10px] text-blue-400 uppercase tracking-[0.2em]">
                  {blog.category}
                </span>

                <h3 className="text-lg font-bold mt-2 mb-3">{blog.title}</h3>

                <p className="text-gray-300 mb-4 text-sm line-clamp-3">
                  {blog.excerpt}
                </p>

                <button
                  className="text-blue-400 font-semibold hover:underline"
                  onClick={() => setOpenBlog(blog)}
                >
                  Read More →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />

      {/* Lightbox */}
      {openBlog && (
        <div className="fixed inset-0 bg-black/80 z-[999] flex items-center justify-center p-4">
          <div className="bg-[#111] max-w-3xl w-full rounded-2xl shadow-2xl p-6 relative overflow-y-auto max-h-[90vh]">
            <button
              className="text-white text-2xl absolute right-4 top-3 hover:text-red-400"
              onClick={() => setOpenBlog(null)}
            >
              ✕
            </button>

            <img
              src={openBlog.image}
              alt={openBlog.title}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />

            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              {openBlog.title}
            </h2>

            <div
              className="text-gray-300 leading-relaxed prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: openBlog.content }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
