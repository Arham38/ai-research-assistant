import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-16 bg-gray-50/50">
      
      {/* --- Hero Section --- */}
      <div className="text-center max-w-3xl mx-auto mb-20">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900 mb-6">
          Supercharge your research with <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-600 to-slate-900">AI</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 mb-10 leading-relaxed px-4">
          Discover, organize, and analyze academic papers faster. Generate comprehensive literature reviews and compare methodologies in seconds.
        </p>
        
        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            href="/search" 
            className="w-full sm:w-auto px-8 py-3.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm hover:shadow-md transition-all text-center"
          >
            Start Searching
          </Link>
          <Link 
            href="/library" 
            className="w-full sm:w-auto px-8 py-3.5 text-sm font-semibold text-slate-900 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg shadow-sm transition-all text-center"
          >
            Go to Library
          </Link>
        </div>
      </div>

      {/* --- Feature Cards Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto w-full">
        
        {/* Card 1: Search */}
        <Link href="/search" className="group p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Search</h3>
          <p className="text-sm text-gray-500 leading-relaxed">Find relevant academic papers quickly using AI-powered semantic search.</p>
        </Link>

        {/* Card 2: Upload */}
        <Link href="/upload" className="group p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Papers</h3>
          <p className="text-sm text-gray-500 leading-relaxed">Add your own PDFs to build a personalized library for instant analysis.</p>
        </Link>

        {/* Card 3: Lit Review */}
        <Link href="/lit-review" className="group p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H14" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Lit Reviews</h3>
          <p className="text-sm text-gray-500 leading-relaxed">Automatically synthesize multiple papers into a cohesive literature review.</p>
        </Link>

        {/* Card 4: Compare */}
        <Link href="/compare" className="group p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Compare</h3>
          <p className="text-sm text-gray-500 leading-relaxed">Extract and compare methodologies, datasets, and results side-by-side.</p>
        </Link>
        
      </div>
    </main>
  );
}