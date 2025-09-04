import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { Calendar, User, Clock, Tag, ArrowLeft } from 'lucide-react';
import { calculateReadTime } from '../utils/readTime';

interface Post {
    id: number;
    title: string;
    content: string | null;
    created_at: string;
    category: string | null;
    image_url: string | null;
    tags: string[] | null;
    author: { full_name: string } | null;
}

const BlogPostPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPost = async () => {
            if (!id) return;
            const { data, error } = await supabase
                .from('posts')
                .select(`
                    id,
                    title,
                    content,
                    created_at,
                    category,
                    image_url,
                    tags,
                    author:profiles ( full_name )
                `)
                .eq('id', id)
                .single();

            if (error) {
                setError(error.message);
            } else {
                setPost(data as any);
            }
            setLoading(false);
        };

        fetchPost();
    }, [id]);

    if (loading) return <div className="text-center py-20">Loading post...</div>;
    if (error || !post) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Post not found</h1>
                <p className="text-lg text-gray-600 mb-8">Sorry, we couldn't find the blog post you're looking for. {error}</p>
                <Link
                    to="/blog"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center"
                >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Back to Blog
                </Link>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const readTime = calculateReadTime(post.content);

    return (
        <div className="min-h-screen bg-gray-50">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                <header className="relative py-24 md:py-32 bg-gradient-to-br from-gray-900 to-blue-900 text-white">
                    <div className="absolute inset-0 bg-black opacity-40"></div>
                    <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <p className="text-sm font-semibold uppercase tracking-wider text-blue-300 mb-4">{post.category}</p>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>
                        <div className="flex flex-wrap justify-center items-center space-x-4 text-blue-100">
                            <div className="flex items-center">
                                <User className="h-4 w-4 mr-2" />
                                <span>{post.author?.full_name || 'Anonymous'}</span>
                            </div>
                            <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2" />
                                <span>{formatDate(post.created_at)}</span>
                            </div>
                            <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-2" />
                                <span>{readTime}</span>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="py-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <img src={post.image_url || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop'} alt={post.title} className="w-full h-64 md:h-96 object-cover" />
                            <article className="prose lg:prose-xl max-w-none p-8" dangerouslySetInnerHTML={{ __html: post.content || '' }} />
                            
                            {post.tags && post.tags.length > 0 && (
                                <div className="p-8 border-t border-gray-200">
                                    <div className="flex flex-wrap gap-3">
                                        {post.tags.map(tag => (
                                            <span key={tag} className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full flex items-center">
                                                <Tag className="h-4 w-4 mr-2" />
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-12 text-center">
                            <Link
                                to="/blog"
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center"
                            >
                                <ArrowLeft className="h-5 w-5 mr-2" />
                                Back to All Posts
                            </Link>
                        </div>
                    </div>
                </main>
            </motion.div>
        </div>
    );
};

export default BlogPostPage;
