import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { UploadCloud, Type, FileText, Tag, Image as ImageIcon } from 'lucide-react';

const EditPostPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [category, setCategory] = useState('');
    const [tags, setTags] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPost = async () => {
            if (!id) return;
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                setError('Failed to fetch post data.');
                setLoading(false);
            } else if (data) {
                setTitle(data.title);
                setContent(data.content);
                setExcerpt(data.excerpt || '');
                setCategory(data.category || '');
                setTags((data.tags || []).join(', '));
                setImageUrl(data.image_url || '');
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !id) {
            setError('You must be logged in to edit a post.');
            return;
        }
        setLoading(true);
        setError(null);

        const tagsArray = tags.split(',').map(tag => tag.trim());

        const { error: updateError } = await supabase
            .from('posts')
            .update({
                title,
                content,
                excerpt,
                category,
                tags: tagsArray,
                image_url: imageUrl,
            })
            .eq('id', id);

        if (updateError) {
            setError(updateError.message);
        } else {
            navigate('/admin');
        }
        setLoading(false);
    };

    if (loading) return <div className="text-center py-20">Loading post for editing...</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto"
            >
                <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Edit Blog Post</h1>
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
                            {loading ? 'Saving Changes...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default EditPostPage;
