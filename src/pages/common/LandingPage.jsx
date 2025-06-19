import React from 'react'
import Navbar from '../../components/Navbar.jsx'

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            {/* Hero Section */}
            <div className="py-20 px-4 sm:px-6 lg:px-8 bg-white">       )
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
                        Welcome to Our Platform
                    </h1>
                    <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                        The best solution for your business needs. Start your journey with us today.
                    </p>
                    <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                        <div className="rounded-md shadow">
                            <a href="#" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10">
                                Get Started
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-12 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {/* Feature 1 */}
                        <div className="p-6 bg-white rounded-lg shadow-sm">
                            <h3 className="text-lg font-medium text-gray-900">Feature One</h3>
                            <p className="mt-2 text-gray-500">Description of your amazing feature goes here.</p>
                        </div>
                        {/* Feature 2 */}
                        <div className="p-6 bg-white rounded-lg shadow-sm">
                            <h3 className="text-lg font-medium text-gray-900">Feature Two</h3>
                            <p className="mt-2 text-gray-500">Another great feature description here.</p>
                        </div>
                        {/* Feature 3 */}
                        <div className="p-6 bg-white rounded-lg shadow-sm">
                            <h3 className="text-lg font-medium text-gray-900">Feature Three</h3>
                            <p className="mt-2 text-gray-500">One more amazing feature description.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LandingPage;