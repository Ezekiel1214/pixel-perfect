export interface ComponentItem {
  id: string;
  name: string;
  category: "header" | "hero" | "features" | "cta" | "footer" | "testimonials";
  thumbnail: string;
  html: string;
}

export const componentLibrary: ComponentItem[] = [
  {
    id: "header-simple",
    name: "Simple Header",
    category: "header",
    thumbnail: "📍",
    html: `<nav class="flex items-center justify-between p-6 bg-gray-900">
  <div class="text-2xl font-bold text-white">Brand</div>
  <div class="flex gap-6">
    <a href="#" class="text-gray-300 hover:text-white">Home</a>
    <a href="#" class="text-gray-300 hover:text-white">About</a>
    <a href="#" class="text-gray-300 hover:text-white">Services</a>
    <a href="#" class="text-gray-300 hover:text-white">Contact</a>
  </div>
</nav>`
  },
  {
    id: "header-cta",
    name: "Header with CTA",
    category: "header",
    thumbnail: "🎯",
    html: `<nav class="flex items-center justify-between p-6 bg-gray-900">
  <div class="text-2xl font-bold text-white">Brand</div>
  <div class="flex items-center gap-6">
    <a href="#" class="text-gray-300 hover:text-white">Features</a>
    <a href="#" class="text-gray-300 hover:text-white">Pricing</a>
    <button class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">Get Started</button>
  </div>
</nav>`
  },
  {
    id: "hero-centered",
    name: "Centered Hero",
    category: "hero",
    thumbnail: "🌟",
    html: `<section class="py-24 px-6 text-center bg-gray-900">
  <h1 class="text-5xl font-bold text-white mb-6">Your Amazing Headline</h1>
  <p class="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">A compelling description that explains what your product does and why visitors should care.</p>
  <div class="flex gap-4 justify-center">
    <button class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold">Primary Action</button>
    <button class="border border-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:border-gray-500">Secondary</button>
  </div>
</section>`
  },
  {
    id: "hero-split",
    name: "Split Hero",
    category: "hero",
    thumbnail: "📐",
    html: `<section class="flex flex-col md:flex-row items-center gap-12 py-20 px-6 bg-gray-900">
  <div class="flex-1">
    <h1 class="text-4xl font-bold text-white mb-4">Build Faster, Ship Smarter</h1>
    <p class="text-gray-400 mb-6">Empower your team with the tools they need to succeed. Our platform makes it easy to build and deploy.</p>
    <button class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold">Get Started Free</button>
  </div>
  <div class="flex-1">
    <div class="bg-gradient-to-br from-blue-500 to-purple-600 h-64 rounded-xl"></div>
  </div>
</section>`
  },
  {
    id: "features-grid",
    name: "Features Grid",
    category: "features",
    thumbnail: "📊",
    html: `<section class="py-16 px-6 bg-gray-900">
  <h2 class="text-3xl font-bold text-white text-center mb-12">Features</h2>
  <div class="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
    <div class="bg-gray-800 p-6 rounded-xl">
      <div class="text-4xl mb-4">⚡</div>
      <h3 class="text-xl font-semibold text-white mb-2">Lightning Fast</h3>
      <p class="text-gray-400">Optimized for speed and performance.</p>
    </div>
    <div class="bg-gray-800 p-6 rounded-xl">
      <div class="text-4xl mb-4">🎨</div>
      <h3 class="text-xl font-semibold text-white mb-2">Beautiful Design</h3>
      <p class="text-gray-400">Stunning templates and customization.</p>
    </div>
    <div class="bg-gray-800 p-6 rounded-xl">
      <div class="text-4xl mb-4">🔒</div>
      <h3 class="text-xl font-semibold text-white mb-2">Secure</h3>
      <p class="text-gray-400">Enterprise-grade security built-in.</p>
    </div>
  </div>
</section>`
  },
  {
    id: "testimonials-cards",
    name: "Testimonials",
    category: "testimonials",
    thumbnail: "💬",
    html: `<section class="py-16 px-6 bg-gray-900">
  <h2 class="text-3xl font-bold text-white text-center mb-12">What People Say</h2>
  <div class="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
    <div class="bg-gray-800 p-6 rounded-xl">
      <p class="text-gray-300 mb-4">"This product has completely transformed how we work. Highly recommended!"</p>
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-blue-500 rounded-full"></div>
        <div>
          <p class="text-white font-semibold">Jane Doe</p>
          <p class="text-gray-400 text-sm">CEO, TechCorp</p>
        </div>
      </div>
    </div>
    <div class="bg-gray-800 p-6 rounded-xl">
      <p class="text-gray-300 mb-4">"Incredible value for money. The best decision we made this year."</p>
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-green-500 rounded-full"></div>
        <div>
          <p class="text-white font-semibold">John Smith</p>
          <p class="text-gray-400 text-sm">CTO, StartupXYZ</p>
        </div>
      </div>
    </div>
  </div>
</section>`
  },
  {
    id: "cta-banner",
    name: "CTA Banner",
    category: "cta",
    thumbnail: "📢",
    html: `<section class="py-16 px-6 bg-blue-600 text-center">
  <h2 class="text-3xl font-bold text-white mb-4">Ready to get started?</h2>
  <p class="text-xl text-blue-100 mb-8">Join thousands of satisfied customers today.</p>
  <button class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50">Start Free Trial</button>
</section>`
  },
  {
    id: "footer-simple",
    name: "Simple Footer",
    category: "footer",
    thumbnail: "📋",
    html: `<footer class="py-8 px-6 bg-gray-900 text-center">
  <div class="flex justify-center gap-6 mb-4">
    <a href="#" class="text-gray-400 hover:text-white">Privacy</a>
    <a href="#" class="text-gray-400 hover:text-white">Terms</a>
    <a href="#" class="text-gray-400 hover:text-white">Contact</a>
  </div>
  <p class="text-gray-500">&copy; 2024 Brand. All rights reserved.</p>
</footer>`
  },
  {
    id: "footer-detailed",
    name: "Detailed Footer",
    category: "footer",
    thumbnail: "📑",
    html: `<footer class="py-12 px-6 bg-gray-900">
  <div class="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
    <div>
      <h3 class="text-white font-bold mb-4">Brand</h3>
      <p class="text-gray-400 text-sm">Building the future of web development.</p>
    </div>
    <div>
      <h4 class="text-white font-semibold mb-4">Product</h4>
      <ul class="space-y-2 text-gray-400 text-sm">
        <li><a href="#" class="hover:text-white">Features</a></li>
        <li><a href="#" class="hover:text-white">Pricing</a></li>
        <li><a href="#" class="hover:text-white">Changelog</a></li>
      </ul>
    </div>
    <div>
      <h4 class="text-white font-semibold mb-4">Company</h4>
      <ul class="space-y-2 text-gray-400 text-sm">
        <li><a href="#" class="hover:text-white">About</a></li>
        <li><a href="#" class="hover:text-white">Blog</a></li>
        <li><a href="#" class="hover:text-white">Careers</a></li>
      </ul>
    </div>
    <div>
      <h4 class="text-white font-semibold mb-4">Legal</h4>
      <ul class="space-y-2 text-gray-400 text-sm">
        <li><a href="#" class="hover:text-white">Privacy</a></li>
        <li><a href="#" class="hover:text-white">Terms</a></li>
      </ul>
    </div>
  </div>
  <div class="max-w-6xl mx-auto mt-8 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
    &copy; 2024 Brand. All rights reserved.
  </div>
</footer>`
  }
];
