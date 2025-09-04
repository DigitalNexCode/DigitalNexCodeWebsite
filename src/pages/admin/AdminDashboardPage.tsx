import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabaseClient';
import { Link } from 'react-router-dom';
import { Edit, Trash2, PlusCircle, ExternalLink, Users, FileText, DollarSign } from 'lucide-react';
import { BlogPost } from '../Blog'; // Re-using the interface
import Spinner from '../../components/Spinner';

interface Stats {
    postCount: number;
    userCount: number;
    totalRevenue: number;
}

const AdminDashboardPage: React.FC = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [stats, setStats] = useState<Stats>({ postCount: 0, userCount: 0, totalRevenue: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [postsData, postCountData, userCountData, paymentsData] = await Promise.all([
                supabase
                    .from('posts')
                    .select(`id, title, created_at, category, author:profiles ( full_name )`)
                    .order('created_at', { ascending: false }),
                supabase
                    .from('posts')
                    .select('*', { count: 'exact', head: true }),
                supabase
                    .from('profiles')
                    .select('*', { count: 'exact', head: true }),
                supabase
                    .from('payments')
                    .select('amount_in_cents')
            ]);

            if (postsData.error) throw postsData.error;
            if (postCountData.error) throw postCountData.error;
            if (userCountData.error) throw userCountData.error;
            if (paymentsData.error) throw paymentsData.error;
            
            const formattedPosts = postsData.data.map((post: any) => ({
                ...post,
                author: { full_name: post.author?.full_name || 'Anonymous' }
            }));
            setPosts(formattedPosts);

            const totalRevenue = (paymentsData.data || []).reduce((sum, payment) => sum + payment.amount_in_cents, 0);

            setStats({
                postCount: postCountData.count || 0,
                userCount: userCountData.count || 0,
                totalRevenue: totalRevenue / 100,
            });

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
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
                fetchData(); // Refresh all data
            }
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-ZA');
    };

    const StatCard: React.FC<{ icon: React.ElementType, title: string, value: string, color: string }> = ({ icon: Icon, title, value, color }) => (
        <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4"
        >
            <div className={`p-3 rounded-full ${color}`}>
                <Icon className="h-6 w-6 text-white" />
            </div>
            <div>
                <p className="text-sm text-gray-500">{title}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
        </motion.div>
    );

    if (loading) return <Spinner />;
    if (error) return <div className="text-center py-20 text-red-500">Error: {error}</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto"
            >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <Link to="/admin/create-post" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center self-start sm:self-center">
                        <PlusCircle className="h-5 w-5 mr-2" />
                        Create New Post
                    </Link>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatCard icon={FileText} title="Total Posts" value={stats.postCount.toString()} color="bg-blue-500" />
                    <StatCard icon={Users} title="Total Users" value={stats.userCount.toString()} color="bg-green-500" />
                    <StatCard icon={DollarSign} title="Total Revenue" value={`R ${stats.totalRevenue.toFixed(2)}`} color="bg-yellow-500" />
                </div>

                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Category</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Author</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Date</th>
                                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {posts.map((post) => (
                                    <tr key={post.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{post.title}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                {post.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">{post.author.full_name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">{formatDate(post.created_at)}</td>
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
