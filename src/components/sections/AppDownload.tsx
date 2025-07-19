import { Smartphone, Download } from 'lucide-react'

export default function AppDownload() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Content */}
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-4xl font-semibold text-gray-800 mb-6">
              Available on iOS & Android
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Download the app and start saving today
            </p>
            
            {/* Download buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button className="flex items-center justify-center gap-3 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors">
                <div className="w-8 h-8 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-xs">Download on the</div>
                  <div className="text-lg font-semibold">App Store</div>
                </div>
              </button>
              
              <button className="flex items-center justify-center gap-3 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors">
                <div className="w-8 h-8 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-xs">GET IT ON</div>
                  <div className="text-lg font-semibold">Google Play</div>
                </div>
              </button>
            </div>
          </div>
          
          {/* Mobile mockups */}
          <div className="flex-1 flex justify-center lg:justify-end">
            <div className="relative">
              {/* Phone 1 */}
              <div className="relative bg-gray-900 rounded-3xl p-2 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="bg-white rounded-2xl h-96 w-48 overflow-hidden">
                  <div className="h-full w-full bg-gradient-to-br from-blue-50 to-green-50 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
                      <div className="flex gap-1">
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                          <div className="text-right">
                            <div className="text-xs text-gray-500">+$32</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
                          <div className="text-right">
                            <div className="text-xs text-gray-500">+$15</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div className="w-6 h-6 bg-purple-500 rounded-full"></div>
                          <div className="text-right">
                            <div className="text-xs text-gray-500">+$8</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Phone 2 */}
              <div className="absolute top-8 left-8 bg-gray-900 rounded-3xl p-2 shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="bg-white rounded-2xl h-96 w-48 overflow-hidden">
                  <div className="h-full w-full bg-gradient-to-br from-green-50 to-blue-50 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-8 h-8 bg-green-500 rounded-full"></div>
                      <div className="flex gap-1">
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="text-2xl font-bold text-gray-800">$1,247</div>
                        <div className="text-sm text-gray-500">Total Savings</div>
                      </div>
                      
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                          <div className="text-sm text-gray-700">Office Supplies</div>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                          <div className="text-sm text-gray-700">Software</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
