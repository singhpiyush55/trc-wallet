export async function header() {
    return(
        <div>
            <header className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <span className="text-2xl font-bold text-white tracking-tight">
                                TRC Wallet
                            </span>
                        </div>
                        <nav className="flex items-center space-x-4">
                            <a href="/signin" className="text-white/80 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                Sign In
                            </a>
                            <a href="/signup" className="ml-4 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium backdrop-blur-sm transition-all border border-white/20">
                                Sign Up
                            </a>
                        </nav>
                    </div>
                </div>
            </header>
        </div>
    )
}
