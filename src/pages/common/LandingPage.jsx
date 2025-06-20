import React from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar.jsx'

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-sky-500 via-sky-600 to-purple-800">
                <div className="absolute inset-0 bg-black opacity-10"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl lg:text-7xl">
                            Saigonchildren
                            <span className="block text-yellow-400">Mentoring Program</span>
                        </h1>
                        <p className="mt-6 max-w-3xl mx-auto text-xl text-sky-100 sm:text-2xl">
                            Connecting experienced professionals with ambitious students to build Vietnam's future together
                        </p>
                        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => navigate('/auth/register')}
                                className="px-8 py-4 bg-yellow-400 text-sky-900 font-bold text-lg rounded-full hover:bg-yellow-300 transform hover:scale-105 transition-all duration-200 shadow-lg"
                            >
                                Join as Mentee
                            </button>
                            <button
                                onClick={() => navigate('/auth/register')}
                                className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold text-lg rounded-full hover:bg-white hover:text-sky-700 transform hover:scale-105 transition-all duration-200"
                            >
                                Become a Mentor
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-sky-500">500+</div>
                            <div className="text-gray-600 mt-2">Active Mentors</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-green-600">1,200+</div>
                            <div className="text-gray-600 mt-2">Students Mentored</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-purple-600">50+</div>
                            <div className="text-gray-600 mt-2">Partner Companies</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-yellow-600">95%</div>
                            <div className="text-gray-600 mt-2">Success Rate</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                            Why Choose Our Mentoring Program?
                        </h2>
                        <p className="mt-4 text-xl text-gray-600">
                            Empowering students with real-world guidance from industry experts
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                        <div className="text-center group">
                            <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-sky-200 transition-colors">
                                <svg className="w-8 h-8 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Expert Mentorship</h3>
                            <p className="text-gray-600">
                                Connect with experienced professionals from top tech companies and startups who are passionate about sharing their knowledge.
                            </p>
                        </div>

                        <div className="text-center group">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-200 transition-colors">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Career Acceleration</h3>
                            <p className="text-gray-600">
                                Fast-track your career with personalized guidance on technical skills, interview preparation, and professional development.
                            </p>
                        </div>

                        <div className="text-center group">
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-200 transition-colors">
                                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9-3-9m-9 9a9 9 0 019-9" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Global Network</h3>
                            <p className="text-gray-600">
                                Build valuable connections with professionals worldwide and gain access to international opportunities and perspectives.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* How It Works Section */}
            <div className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                            How It Works
                        </h2>
                        <p className="mt-4 text-xl text-gray-600">
                            Simple steps to start your mentoring journey
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-sky-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Register & Complete Profile</h3>
                            <p className="text-gray-600">Sign up and tell us about your goals, interests, and preferences for the perfect match.</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-sky-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Get Matched</h3>
                            <p className="text-gray-600">Our team carefully matches you with the ideal mentor or mentee based on your profile and preferences.</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-sky-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Growing</h3>
                            <p className="text-gray-600">Begin your mentoring relationship and accelerate your personal and professional development.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-20 bg-gradient-to-r from-sky-500 to-purple-700">
                <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-white sm:text-4xl">
                        Ready to Start Your Journey?
                    </h2>
                    <p className="mt-4 text-xl text-sky-100">
                        Join thousands of students and professionals already part of our community
                    </p>
                    <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigate('/auth/register')}
                            className="px-8 py-4 bg-yellow-400 text-sky-900 font-bold text-lg rounded-full hover:bg-yellow-300 transform hover:scale-105 transition-all duration-200 shadow-lg"
                        >
                            Get Started Today
                        </button>
                        <button
                            onClick={() => navigate('/auth/login')}
                            className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold text-lg rounded-full hover:bg-white hover:text-sky-700 transform hover:scale-105 transition-all duration-200"
                        >
                            Already a Member? Login
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h3 className="text-2xl font-bold mb-4">Saigonchildren Mentoring Program</h3>
                        <p className="text-gray-400 mb-8">
                            Empowering Vietnam's next generation through meaningful mentorship connections
                        </p>
                        <div className="border-t border-gray-800 pt-8">
                            <p className="text-gray-500">
                                © 2024 Saigonchildren. All rights reserved.
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default LandingPage;