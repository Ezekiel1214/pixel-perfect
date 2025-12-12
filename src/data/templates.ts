export interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  html: string;
}

export const templates: Template[] = [
  {
    id: "landing-page",
    name: "Landing Page",
    description: "A modern landing page with hero, features, and CTA sections",
    thumbnail: "🚀",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Modern Landing Page</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-900 text-white">
  <nav class="flex items-center justify-between p-6">
    <div class="text-2xl font-bold">Brand</div>
    <div class="flex gap-6">
      <a href="#" class="hover:text-blue-400">Home</a>
      <a href="#" class="hover:text-blue-400">Features</a>
      <a href="#" class="hover:text-blue-400">Pricing</a>
      <a href="#" class="hover:text-blue-400">Contact</a>
    </div>
  </nav>
  
  <section class="py-20 px-6 text-center">
    <h1 class="text-5xl font-bold mb-6">Build Something Amazing</h1>
    <p class="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">Create stunning websites with our powerful platform. No coding required.</p>
    <div class="flex gap-4 justify-center">
      <button class="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold">Get Started</button>
      <button class="border border-gray-600 hover:border-gray-500 px-8 py-3 rounded-lg font-semibold">Learn More</button>
    </div>
  </section>
  
  <section class="py-16 px-6">
    <h2 class="text-3xl font-bold text-center mb-12">Features</h2>
    <div class="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      <div class="bg-gray-800 p-6 rounded-xl">
        <div class="text-4xl mb-4">⚡</div>
        <h3 class="text-xl font-semibold mb-2">Lightning Fast</h3>
        <p class="text-gray-400">Optimized for speed and performance.</p>
      </div>
      <div class="bg-gray-800 p-6 rounded-xl">
        <div class="text-4xl mb-4">🎨</div>
        <h3 class="text-xl font-semibold mb-2">Beautiful Design</h3>
        <p class="text-gray-400">Stunning templates and customization options.</p>
      </div>
      <div class="bg-gray-800 p-6 rounded-xl">
        <div class="text-4xl mb-4">🔒</div>
        <h3 class="text-xl font-semibold mb-2">Secure</h3>
        <p class="text-gray-400">Enterprise-grade security built-in.</p>
      </div>
    </div>
  </section>
  
  <section class="py-16 px-6 bg-blue-600 text-center">
    <h2 class="text-3xl font-bold mb-4">Ready to get started?</h2>
    <p class="text-xl mb-8 opacity-90">Join thousands of satisfied customers today.</p>
    <button class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100">Start Free Trial</button>
  </section>
  
  <footer class="py-8 px-6 text-center text-gray-400">
    <p>&copy; 2024 Brand. All rights reserved.</p>
  </footer>
</body>
</html>`
  },
  {
    id: "portfolio",
    name: "Portfolio",
    description: "A clean portfolio to showcase your work",
    thumbnail: "💼",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Portfolio</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-950 text-white">
  <nav class="flex items-center justify-between p-6 max-w-6xl mx-auto">
    <div class="text-xl font-bold">John Doe</div>
    <div class="flex gap-6">
      <a href="#about" class="hover:text-purple-400">About</a>
      <a href="#work" class="hover:text-purple-400">Work</a>
      <a href="#contact" class="hover:text-purple-400">Contact</a>
    </div>
  </nav>
  
  <section class="py-32 px-6 text-center">
    <div class="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto mb-8"></div>
    <h1 class="text-4xl font-bold mb-4">Creative Developer</h1>
    <p class="text-xl text-gray-400 max-w-xl mx-auto">I craft beautiful digital experiences that blend design and technology.</p>
  </section>
  
  <section id="work" class="py-16 px-6 max-w-6xl mx-auto">
    <h2 class="text-2xl font-bold mb-8">Selected Work</h2>
    <div class="grid md:grid-cols-2 gap-6">
      <div class="bg-gray-900 rounded-xl overflow-hidden group cursor-pointer">
        <div class="h-48 bg-gradient-to-br from-blue-500 to-purple-600"></div>
        <div class="p-6">
          <h3 class="text-lg font-semibold mb-2">Project Alpha</h3>
          <p class="text-gray-400 text-sm">Web Design, Development</p>
        </div>
      </div>
      <div class="bg-gray-900 rounded-xl overflow-hidden group cursor-pointer">
        <div class="h-48 bg-gradient-to-br from-green-500 to-teal-600"></div>
        <div class="p-6">
          <h3 class="text-lg font-semibold mb-2">Project Beta</h3>
          <p class="text-gray-400 text-sm">Mobile App, UI/UX</p>
        </div>
      </div>
      <div class="bg-gray-900 rounded-xl overflow-hidden group cursor-pointer">
        <div class="h-48 bg-gradient-to-br from-orange-500 to-red-600"></div>
        <div class="p-6">
          <h3 class="text-lg font-semibold mb-2">Project Gamma</h3>
          <p class="text-gray-400 text-sm">Branding, Identity</p>
        </div>
      </div>
      <div class="bg-gray-900 rounded-xl overflow-hidden group cursor-pointer">
        <div class="h-48 bg-gradient-to-br from-pink-500 to-purple-600"></div>
        <div class="p-6">
          <h3 class="text-lg font-semibold mb-2">Project Delta</h3>
          <p class="text-gray-400 text-sm">E-commerce, Development</p>
        </div>
      </div>
    </div>
  </section>
  
  <section id="contact" class="py-16 px-6 text-center">
    <h2 class="text-2xl font-bold mb-4">Let's Work Together</h2>
    <p class="text-gray-400 mb-8">Have a project in mind? Let's talk.</p>
    <a href="mailto:hello@example.com" class="inline-block bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-lg font-semibold">Get in Touch</a>
  </section>
  
  <footer class="py-8 px-6 text-center text-gray-500 text-sm">
    <p>&copy; 2024 John Doe. All rights reserved.</p>
  </footer>
</body>
</html>`
  },
  {
    id: "restaurant",
    name: "Restaurant",
    description: "A restaurant website with menu and reservations",
    thumbnail: "🍽️",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fine Dining Restaurant</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-stone-950 text-white">
  <nav class="flex items-center justify-between p-6 max-w-6xl mx-auto">
    <div class="text-2xl font-serif">La Maison</div>
    <div class="flex gap-6 text-sm uppercase tracking-wider">
      <a href="#menu" class="hover:text-amber-400">Menu</a>
      <a href="#about" class="hover:text-amber-400">About</a>
      <a href="#reserve" class="hover:text-amber-400">Reserve</a>
    </div>
  </nav>
  
  <section class="py-32 px-6 text-center bg-gradient-to-b from-stone-900 to-stone-950">
    <p class="text-amber-400 uppercase tracking-widest text-sm mb-4">Fine Dining Experience</p>
    <h1 class="text-5xl md:text-7xl font-serif mb-6">La Maison</h1>
    <p class="text-xl text-stone-400 max-w-xl mx-auto mb-8">Where culinary artistry meets timeless elegance</p>
    <button class="border border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-stone-950 px-8 py-3 uppercase tracking-wider text-sm transition-colors">Reserve a Table</button>
  </section>
  
  <section id="menu" class="py-20 px-6 max-w-4xl mx-auto">
    <h2 class="text-3xl font-serif text-center mb-12">Our Menu</h2>
    <div class="space-y-8">
      <div class="flex justify-between items-baseline border-b border-stone-800 pb-4">
        <div>
          <h3 class="text-lg font-semibold">Truffle Risotto</h3>
          <p class="text-stone-400 text-sm">Arborio rice, black truffle, aged parmesan</p>
        </div>
        <span class="text-amber-400">$42</span>
      </div>
      <div class="flex justify-between items-baseline border-b border-stone-800 pb-4">
        <div>
          <h3 class="text-lg font-semibold">Wagyu Beef Tenderloin</h3>
          <p class="text-stone-400 text-sm">A5 grade, seasonal vegetables, red wine jus</p>
        </div>
        <span class="text-amber-400">$85</span>
      </div>
      <div class="flex justify-between items-baseline border-b border-stone-800 pb-4">
        <div>
          <h3 class="text-lg font-semibold">Lobster Thermidor</h3>
          <p class="text-stone-400 text-sm">Maine lobster, cognac cream, gruyère crust</p>
        </div>
        <span class="text-amber-400">$68</span>
      </div>
    </div>
  </section>
  
  <section id="reserve" class="py-20 px-6 bg-stone-900 text-center">
    <h2 class="text-3xl font-serif mb-4">Make a Reservation</h2>
    <p class="text-stone-400 mb-8">Experience an unforgettable evening</p>
    <div class="flex flex-col md:flex-row gap-4 justify-center max-w-xl mx-auto">
      <input type="text" placeholder="Name" class="bg-stone-800 px-4 py-3 rounded-lg flex-1">
      <input type="date" class="bg-stone-800 px-4 py-3 rounded-lg">
      <button class="bg-amber-400 text-stone-950 px-8 py-3 rounded-lg font-semibold">Reserve</button>
    </div>
  </section>
  
  <footer class="py-8 px-6 text-center text-stone-500">
    <p>123 Gourmet Street, New York • Open Tue-Sun, 6PM-11PM</p>
  </footer>
</body>
</html>`
  },
  {
    id: "blog",
    name: "Blog",
    description: "A minimalist blog layout",
    thumbnail: "📝",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>The Blog</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-950 text-gray-100">
  <nav class="max-w-3xl mx-auto flex items-center justify-between p-6">
    <div class="text-xl font-bold">The Blog</div>
    <div class="flex gap-4 text-sm">
      <a href="#" class="hover:text-blue-400">Articles</a>
      <a href="#" class="hover:text-blue-400">About</a>
      <a href="#" class="hover:text-blue-400">Newsletter</a>
    </div>
  </nav>
  
  <main class="max-w-3xl mx-auto px-6 py-12">
    <article class="mb-16">
      <span class="text-blue-400 text-sm">Technology</span>
      <h2 class="text-3xl font-bold mt-2 mb-4 hover:text-blue-400 cursor-pointer">The Future of Web Development in 2024</h2>
      <p class="text-gray-400 mb-4">Exploring the latest trends and technologies shaping the web development landscape this year...</p>
      <div class="flex items-center gap-4 text-sm text-gray-500">
        <span>Jan 15, 2024</span>
        <span>•</span>
        <span>5 min read</span>
      </div>
    </article>
    
    <article class="mb-16">
      <span class="text-green-400 text-sm">Design</span>
      <h2 class="text-3xl font-bold mt-2 mb-4 hover:text-green-400 cursor-pointer">Minimalism in Modern UI Design</h2>
      <p class="text-gray-400 mb-4">Why less is more when it comes to creating effective user interfaces...</p>
      <div class="flex items-center gap-4 text-sm text-gray-500">
        <span>Jan 10, 2024</span>
        <span>•</span>
        <span>4 min read</span>
      </div>
    </article>
    
    <article class="mb-16">
      <span class="text-purple-400 text-sm">AI</span>
      <h2 class="text-3xl font-bold mt-2 mb-4 hover:text-purple-400 cursor-pointer">How AI is Transforming Content Creation</h2>
      <p class="text-gray-400 mb-4">A deep dive into the tools and techniques revolutionizing how we create content...</p>
      <div class="flex items-center gap-4 text-sm text-gray-500">
        <span>Jan 5, 2024</span>
        <span>•</span>
        <span>7 min read</span>
      </div>
    </article>
  </main>
  
  <footer class="max-w-3xl mx-auto px-6 py-8 border-t border-gray-800 text-center text-gray-500 text-sm">
    <p>&copy; 2024 The Blog. Built with passion.</p>
  </footer>
</body>
</html>`
  },
  {
    id: "saas",
    name: "SaaS Product",
    description: "A SaaS product page with pricing",
    thumbnail: "💻",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SaaS Product</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-950 text-white">
  <nav class="flex items-center justify-between p-6 max-w-6xl mx-auto">
    <div class="text-xl font-bold text-blue-500">ProductX</div>
    <div class="flex items-center gap-6">
      <a href="#features" class="text-sm hover:text-blue-400">Features</a>
      <a href="#pricing" class="text-sm hover:text-blue-400">Pricing</a>
      <button class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm">Get Started</button>
    </div>
  </nav>
  
  <section class="py-24 px-6 text-center">
    <div class="inline-block bg-blue-600/20 text-blue-400 px-4 py-1 rounded-full text-sm mb-6">Now with AI features</div>
    <h1 class="text-5xl font-bold mb-6 max-w-3xl mx-auto">The all-in-one platform for your business</h1>
    <p class="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">Streamline your workflow, boost productivity, and scale your business with our powerful suite of tools.</p>
    <div class="flex gap-4 justify-center">
      <button class="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold">Start Free Trial</button>
      <button class="border border-slate-700 hover:border-slate-600 px-8 py-3 rounded-lg font-semibold">Watch Demo</button>
    </div>
  </section>
  
  <section id="pricing" class="py-20 px-6 max-w-5xl mx-auto">
    <h2 class="text-3xl font-bold text-center mb-12">Simple, transparent pricing</h2>
    <div class="grid md:grid-cols-3 gap-6">
      <div class="bg-slate-900 p-8 rounded-2xl border border-slate-800">
        <h3 class="text-lg font-semibold mb-2">Starter</h3>
        <div class="text-4xl font-bold mb-4">$9<span class="text-lg text-slate-400">/mo</span></div>
        <ul class="space-y-3 text-slate-400 mb-8">
          <li>✓ 5 team members</li>
          <li>✓ 10GB storage</li>
          <li>✓ Basic analytics</li>
        </ul>
        <button class="w-full border border-slate-700 hover:border-slate-600 py-2 rounded-lg">Get Started</button>
      </div>
      <div class="bg-blue-600 p-8 rounded-2xl relative">
        <div class="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-400 text-xs px-3 py-1 rounded-full">Popular</div>
        <h3 class="text-lg font-semibold mb-2">Pro</h3>
        <div class="text-4xl font-bold mb-4">$29<span class="text-lg opacity-70">/mo</span></div>
        <ul class="space-y-3 opacity-90 mb-8">
          <li>✓ Unlimited members</li>
          <li>✓ 100GB storage</li>
          <li>✓ Advanced analytics</li>
          <li>✓ Priority support</li>
        </ul>
        <button class="w-full bg-white text-blue-600 py-2 rounded-lg font-semibold hover:bg-blue-50">Get Started</button>
      </div>
      <div class="bg-slate-900 p-8 rounded-2xl border border-slate-800">
        <h3 class="text-lg font-semibold mb-2">Enterprise</h3>
        <div class="text-4xl font-bold mb-4">Custom</div>
        <ul class="space-y-3 text-slate-400 mb-8">
          <li>✓ Everything in Pro</li>
          <li>✓ Unlimited storage</li>
          <li>✓ Custom integrations</li>
          <li>✓ Dedicated support</li>
        </ul>
        <button class="w-full border border-slate-700 hover:border-slate-600 py-2 rounded-lg">Contact Sales</button>
      </div>
    </div>
  </section>
  
  <footer class="py-8 px-6 text-center text-slate-500 text-sm">
    <p>&copy; 2024 ProductX. All rights reserved.</p>
  </footer>
</body>
</html>`
  }
];
