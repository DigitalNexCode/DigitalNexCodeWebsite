import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, Type, FileText, Tag, Image as ImageIcon } from 'lucide-react';

const CreatePostPage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [category, setCategory] = useState('');
    const [tags, setTags] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            setError('You must be logged in to create a post.');
            return;
        }
        setLoading(true);
        setError(null);

        const tagsArray = tags.split(',').map(tag => tag.trim());

        const { error: insertError } = await supabase
            .from('posts')
            .insert({
                title,
                content,
                excerpt,
                category,
                tags: tagsArray,
                image_url: imageUrl,
                author_id: user.id,
            });

        if (insertError) {
            setError(insertError.message);
        } else {
            navigate('/blog');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-3xl mx-auto"
            >
                <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Create a New Blog Post</h1>
                <form onSubmit={handleSubmit} className="bg-white p-8 shadow-lg rounded-lg space-y-6">
                    {error && <div className="bg-red-100 text-red-700 p-3 rounded-md">{error}</div>}
                    
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <div className="relative">
                            <Type className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} required className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
                         <div className="relative">
                            <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <textarea id="excerpt" value={excerpt} onChange={e => setExcerpt(e.target.value)} rows={3} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">Content (HTML allowed)</label>
                        <textarea id="content" value={content} onChange={e => setContent(e.target.value)} required rows={10} className="w-full p-4 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <input type="text" id="category" value={category} onChange={e => setCategory(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div>
                            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
                             <div className="relative">
                                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input type="text" id="tags" value={tags} onChange={e => setTags(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                         <div className="relative">
                            <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input type="url" id="imageUrl" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                    </div>

                    <div>
                        <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
                            <UploadCloud className="h-5 w-5 mr-2" />
                            {loading ? 'Publishing...' : 'Publish Post'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default CreatePostPage;
