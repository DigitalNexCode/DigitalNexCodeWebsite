import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabaseClient';
import { Link } from 'react-router-dom';
import { Edit, Trash2, PlusCircle, ExternalLink } from 'lucide-react';
import { BlogPost } from '../Blog'; // Re-using the interface

const AdminDashboardPage: React.FC = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPosts = async () => {
        const { data, error } = await supabase
            .from('posts')
            .select(`
                id,
                title,
                created_at,
                category,
                author:profiles ( full_name )
            `)
            .order('created_at', { ascending: false });

        if (error) {
            setError(error.message);
        } else if (data) {
            const formattedData = data.map((post: any) => ({
                ...post,
                author: post.author || { full_name: 'Anonymous' }
            }));
            setPosts(formattedData);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleDelete = async (postId: number) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            const { error } = await supabase
                .from('posts')
                .delete()
                .eq('id', postId);

            if (error) {
                alert('Failed to delete post: ' + error.message);
            } else {
                alert('Post deleted successfully.');
                fetchPosts(); // Refresh the list
            }
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-ZA');
    };

    if (loading) return <div className="text-center py-20">Loading dashboard...</div>;
    if (error) return <div className="text-center py-20 text-red-500">Error: {error}</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto"
            >
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <Link to="/admin/create-post" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center">
                        <PlusCircle className="h-5 w-5 mr-2" />
                        Create New Post
                    </Link>
                </div>

                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {posts.map((post) => (
                                    <tr key={post.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{post.title}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                {post.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.author.full_name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(post.created_at)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                                            <Link to={`/blog/${post.id}`} target="_blank" className="text-indigo-600 hover:text-indigo-900 inline-flex items-center">
                                                <ExternalLink size={16} className="mr-1" /> View
                                            </Link>
                                            <Link to={`/admin/edit-post/${post.id}`} className="text-blue-600 hover:text-blue-900 inline-flex items-center">
                                                <Edit size={16} className="mr-1" /> Edit
                                            </Link>
                                            <button onClick={() => handleDelete(post.id)} className="text-red-600 hover:text-red-900 inline-flex items-center">
                                                <Trash2 size={16} className="mr-1" /> Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                 {posts.length === 0 && (
                    <div className="text-center py-12 bg-white mt-4 rounded-lg">
                        <p className="text-gray-600">No posts found. Create your first one!</p>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default AdminDashboardPage;
