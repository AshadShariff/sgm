"use client"

export default function Footer() {
  return (
    <footer className="bg-black border-t border-[#B45309] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span>✱</span>
              <span>Signature Global Media</span>
            </h3>
            <p className="text-gray-400 text-sm">Creating the future of video production.</p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="/ai-clone" className="hover:text-[#F59E0B] transition-colors">
                  AI Clone
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#F59E0B] transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#F59E0B] transition-colors">
                  Features
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="#" className="hover:text-[#F59E0B] transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#F59E0B] transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#F59E0B] transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Connect</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="#" className="hover:text-[#F59E0B] transition-colors">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#F59E0B] transition-colors">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#F59E0B] transition-colors">
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[#B45309] pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">&copy; 2025 Signature Global Media. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0 text-sm text-gray-400">
            <a href="#" className="hover:text-[#F59E0B] transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-[#F59E0B] transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-[#F59E0B] transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

