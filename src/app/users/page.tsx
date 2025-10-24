"use client";
import { trpc } from "../_trpc/client";
import { useState } from "react";

export default function User() {
  const id = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
  const { data, isPending } = trpc.getuser.useQuery({ id: id ? Number(id) : 23 });
  const { data: userBlogs, isPending: blogsLoading } = trpc.getBlogs.useQuery();
  const { data: categories, isPending: categoriesLoading } = trpc.getCategories.useQuery();

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategorySlug, setNewCategorySlug] = useState("");
  const [showAddCategory, setShowAddCategory] = useState(false);

  const addCategoryMutation = trpc.addCategory.useMutation({
    onSuccess() {
      setNewCategoryName("");
      setNewCategorySlug("");
      setShowAddCategory(false);
    },
  });

  const { data: categoryBlogs, isPending: categoryBlogsLoading } = trpc.getBlogsByCategory.useQuery(
    { categoryId: selectedCategoryId ?? 0 },
    { enabled: selectedCategoryId != null }
  );

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-600">No user found</h2>
          <p className="text-gray-500 mt-2">The requested user could not be found.</p>
        </div>
      </div>
    );
  }

  const user = data[0];
  const currentUserId = user.id;
  const userBlogsList = Array.isArray(userBlogs) ? userBlogs.filter((blog: any) => blog.authorId === currentUserId) : [];

  // show filtered blogs if category is selected, otherwise show all user blogs
  const displayedBlogs = selectedCategoryId ? (categoryBlogs ?? []) : userBlogsList;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">User Dashboard</h1>
          <p className="text-lg text-gray-600">Manage your profile and content</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{user.name?.charAt(0) || "U"}</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Profile</h2>
                    <p className="text-blue-100 text-sm">Personal Information</p>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <div className="space-y-6">
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">User ID</label>
                    <p className="text-2xl font-bold text-gray-900">#{user.id}</p>
                  </div>
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Full Name</label>
                    <p className="text-xl font-semibold text-gray-900">{user.name || "Not provided"}</p>
                  </div>
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Email Address</label>
                    <p className="text-lg text-gray-700 break-all">{user.email || "Not provided"}</p>
                  </div>

                  {/* Category Dropdown */}
                  <div className="group border-t pt-6 mt-6">
                    <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Filter by Category</label>
                    <div className="space-y-2">
                      <select
                        value={selectedCategoryId ?? ""}
                        onChange={(e) => setSelectedCategoryId(e.target.value ? Number(e.target.value) : null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">All Blogs</option>
                        {categoriesLoading ? (
                          <option disabled>Loading categories...</option>
                        ) : categories && categories.length > 0 ? (
                          categories.map((cat: any) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))
                        ) : (
                          <option disabled>No categories</option>
                        )}
                      </select>

                      <button
                        onClick={() => setShowAddCategory(!showAddCategory)}
                        className="w-full px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
                      >
                        + Add Category
                      </button>
                    </div>

                    {/* Add Category Form */}
                    {showAddCategory && (
                      <div className="mt-4 p-4 border border-blue-200 rounded-lg bg-blue-50 space-y-3">
                        <input
                          type="text"
                          placeholder="Category name"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Slug"
                          value={newCategorySlug}
                          onChange={(e) => setNewCategorySlug(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                        <button
                          onClick={() => {
                            if (newCategoryName && newCategorySlug) {
                              addCategoryMutation.mutate({
                                name: newCategoryName,
                                slug: newCategorySlug,
                              });
                            }
                          }}
                          disabled={addCategoryMutation.isPending}
                          className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                        >
                          {addCategoryMutation.isPending ? "Adding..." : "Add"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* User's Blogs Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-8 py-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {selectedCategoryId ? "Category Blogs" : "My Blogs"}
                    </h2>
                    <p className="text-emerald-100 text-sm mt-1">
                      {displayedBlogs.length} {displayedBlogs.length === 1 ? "post" : "posts"}
                    </p>
                  </div>
                  <div className="bg-white/20 rounded-full px-4 py-2">
                    <span className="text-white font-bold text-lg">{displayedBlogs.length}</span>
                  </div>
                </div>
              </div>
              <div className="p-8">
                {categoryBlogsLoading || blogsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="flex items-center space-x-3">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-emerald-600 border-t-transparent"></div>
                      <span className="text-gray-600 font-medium">Loading blogs...</span>
                    </div>
                  </div>
                ) : displayedBlogs.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No blogs {selectedCategoryId ? "in this category" : "yet"}</h3>
                    <p className="text-gray-500">
                      {selectedCategoryId ? "Select another category or create a blog post." : "Start writing your first blog post to see it here."}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {displayedBlogs.map((blog: any) => (
                      <div
                        key={blog.id}
                        className="group border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-emerald-200 transition-all duration-200 bg-gradient-to-r from-white to-gray-50"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                            {blog.title || `Blog Post #${blog.id}`}
                          </h3>
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                              blog.isPublished
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                : "bg-amber-100 text-amber-800 border border-amber-200"
                            }`}
                          >
                            {blog.isPublished ? "Published" : "Draft"}
                          </span>
                        </div>
                        {blog.content && (
                          <p className="text-gray-600 mb-4 leading-relaxed">
                            {blog.content.length > 150
                              ? `${blog.content.slice(0, 150)}...`
                              : blog.content}
                          </p>
                        )}
                        <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center space-x-1">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                                />
                              </svg>
                              <span>{blog.slug || "No slug"}</span>
                            </span>
                          </div>
                          <span className="font-medium">ID: {blog.id}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}