'use client'

import React, { useEffect, useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { trpc } from '../_trpc/client'

export default function Page() {
    const router = useRouter()
    const [userId, setUserId] = useState<string | null>(null)

    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    useEffect(() => {
        // read userId from localStorage on client
        try {
            const id = localStorage.getItem('userId')
            setUserId(id)
        } catch (e) {
            setUserId(null)
        }
    }, [])

    const mutate = trpc.createBlogs.useMutation();

    async function handleSubmit(e: FormEvent) {
        e.preventDefault()
        setError(null)
        setSuccess(null)

        if (!userId) {
            setError('User not found. Please login first.')
            return
        }
        if (!title.trim()) {
            setError('Title is required.')
            return
        }
        if (!content.trim()) {
            setError('Content is required.')
            return
        }

        try {
            setLoading(true)
            const res = await mutate.mutateAsync({
                title: title.trim(),
                content: content.trim(),
                authorId: Number(userId),
            })

            if (!res) {
                throw new Error(`Failed to create blog`)
            }

            setSuccess('Blog created successfully!')
            // Reset form
            setTitle('')
            setContent('')
            
            // Redirect after a short delay
            setTimeout(() => {
                router.push('/blogs')
            }, 2000)
            
        } catch (err: any) {
            setError(err?.message ?? 'An unexpected error occurred.')
        } finally {
            setLoading(false)
        }
    }

    if (!userId) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 text-black">
                <div className="max-w-2xl w-full text-center">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-12">
                        <div className="w-20 h-20 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Authentication Required</h2>
                        <p className="text-lg text-gray-600 mb-8">
                            You need to be logged in to create and publish blog posts. 
                            <br />
                            <span className="text-gray-500">You can still browse and read blogs without an account.</span>
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link 
                                href="/login" 
                                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all hover:scale-105"
                            >
                                Sign In
                            </Link>
                            <Link 
                                href="/signup" 
                                className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-all"
                            >
                                Create Account
                            </Link>
                        </div>
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <p className="text-sm text-gray-500 mb-4">Or continue browsing as a guest:</p>
                            <Link 
                                href="/blogs" 
                                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                            >
                                ← Back to Blogs
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Create Your Blog Post</h1>
                    <p className="text-xl text-gray-600">Share your thoughts and ideas with the world</p>
                    <div className="mt-4 text-sm text-gray-500">
                        Posting as user: <span className="font-semibold text-blue-600">#{userId}</span>
                    </div>
                </div>

                {/* Blog Form */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Title */}
                        <div>
                            <label htmlFor="title" className="block text-lg font-semibold text-gray-700 mb-3">
                                Blog Title
                            </label>
                            <input
                                id="title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter an engaging title for your blog post"
                                className="w-full px-6 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400"
                                required
                            />
                        </div>

                        {/* Content */}
                        <div>
                            <label htmlFor="content" className="block text-lg font-semibold text-gray-700 mb-3">
                                Content
                            </label>
                            <textarea
                                id="content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Write your blog content here... Share your thoughts, experiences, and insights."
                                rows={12}
                                className="w-full px-6 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400 resize-none"
                                required
                            />
                            <div className="mt-2 text-sm text-gray-500">
                                {content.length} characters
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end space-x-4">
                            <Link 
                                href="/blogs" 
                                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg"
                            >
                                {loading ? (
                                    <div className="flex items-center space-x-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                        <span>Publishing...</span>
                                    </div>
                                ) : (
                                    "Publish Blog"
                                )}
                            </button>
                        </div>

                        {/* Status Messages */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                <div className="flex">
                                    <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-red-800">Error</h3>
                                        <p className="text-sm text-red-700 mt-1">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {success && (
                            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                                <div className="flex">
                                    <svg className="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-green-800">Success!</h3>
                                        <p className="text-sm text-green-700 mt-1">{success}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    )
}