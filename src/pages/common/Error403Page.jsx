import React from 'react'
import { useNavigate } from 'react-router-dom'

const Error403Page = () => {
    const navigate = useNavigate()

    const handleGoBack = () => {
        navigate(-1)
    }

    const handleGoHome = () => {
        navigate('/')
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 text-center">
                {/* Error Icon */}
                <div className="mx-auto flex items-center justify-center h-32 w-32 rounded-full bg-red-100 border-4 border-red-200">
                    <svg
                        className="h-16 w-16 text-red-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                    </svg>
                </div>

                {/* Error Code */}
                <div>
                    <h1 className="text-6xl sm:text-7xl font-bold text-red-500 mb-4">
                        403
                    </h1>
                    <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-2">
                        Access Forbidden
                    </h2>
                    <p className="text-gray-600 text-base sm:text-lg">
                        Sorry, you don't have permission to access this page.
                    </p>
                </div>

                {/* Additional Info */}
                <div className="bg-white rounded-lg shadow-md p-6 border border-red-100">
                    <div className="flex items-center justify-center mb-4">
                        <svg
                            className="h-8 w-8 text-red-400 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 15v2m-6 6h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-800">
                            No Permission
                        </h3>
                    </div>
                    <p className="text-gray-600 text-sm">
                        You need proper authorization to view this content. Please contact your administrator if you believe this is an error.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={handleGoHome}
                        className="inline-flex items-center justify-center px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 font-medium"
                    >
                        <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                            />
                        </svg>
                        Go Home
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Error403Page