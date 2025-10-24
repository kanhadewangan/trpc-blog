"use client";
import React, { useState } from "react";
import Link from "next/link";
import { trpc } from "../_trpc/client";

const PER_PAGE = 6;

export default function PostsPage() {
  const [page, setPage] = useState(1);

  // fetch paginated blogs; expect an array (or undefined)
  const { data, isLoading, isError, error } = trpc.getBlogs.useQuery();

  // ensure blogs is always an array to avoid `map` on undefined
  const blogs = data ?? [];
  const total = blogs.length;
  const lastPage = Math.max(1, Math.ceil(total / PER_PAGE));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-20">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
              <span className="text-gray-600 font-medium">Loading blogs...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 text-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
            <p className="text-red-600 mb-4">Error: {String(error?.message)}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">No blogs found</h2>
            <p className="text-gray-600 mb-8">Be the first to share your story with the community!</p>
            <Link 
              href="/addblog" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all hover:scale-105 inline-block"
            >
              Write Your First Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Discover Amazing Stories</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore a world of creativity, knowledge, and inspiration from our talented community of writers.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
            <div className="text-3xl font-bold text-blue-600 mb-2">{blogs.length}</div>
            <div className="text-gray-600">Total Blogs</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {Array.isArray(blogs) ? blogs.filter((b: any) => b.isPublished).length : 0}
            </div>
            <div className="text-gray-600">Published</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {Array.isArray(blogs) ? blogs.filter((b: any) => !b.isPublished).length : 0}
            </div>
            <div className="text-gray-600">Drafts</div>
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {blogs.map((b: any) => {
            const excerpt =
              (b.content && typeof b.content === "string" && b.content.slice(0, 150)) ??
              b.excerpt ??
              "";
            const href = b.slug ? `/post/${b.slug}` : `/post/${b.id}`;
            return (
              <article key={b.id} className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-white/20 hover:scale-105">
                <div className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <Link href={href} className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {b.title ?? `Blog #${b.id}`}
                    </Link>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        b.isPublished 
                          ? "bg-green-100 text-green-800 border border-green-200" 
                          : "bg-amber-100 text-amber-800 border border-amber-200"
                      }`}
                    >
                      {b.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>

                  {excerpt && (
                    <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3">
                      {excerpt}
                      {b.content && b.content.length > 150 ? "…" : ""}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">U{b.authorId}</span>
                      </div>
                      <span>Author {b.authorId}</span>
                    </div>
                    <span className="text-xs">#{b.id}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Pagination */}
        {lastPage > 1 && (
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-6 py-3 bg-white/80 backdrop-blur-sm text-gray-700 rounded-xl border border-white/20 hover:bg-white hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <div className="flex items-center space-x-2">
              <span className="text-gray-600">Page</span>
              <span className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold">{page}</span>
              <span className="text-gray-600">of {lastPage}</span>
            </div>

            <button
              onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
              disabled={page === lastPage}
              className="px-6 py-3 bg-white/80 backdrop-blur-sm text-gray-700 rounded-xl border border-white/20 hover:bg-white hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Share Your Story?</h2>
            <p className="text-blue-100 mb-6">Join our community of writers and start creating amazing content today.</p>
            <Link 
              href="/addblog" 
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all hover:scale-105 inline-block"
            >
              Start Writing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}