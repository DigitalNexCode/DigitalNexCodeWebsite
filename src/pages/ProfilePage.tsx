import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { User, Mail, Shield, Save, Edit, X } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user, profile, refreshProfile, loading: authLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
    }
  }, [profile]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    if (!user) {
      setError('You are not logged in.');
      setLoading(false);
      return;
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ full_name: fullName })
      .eq('id', user.id);

    if (updateError) {
      setError(`Failed to update profile: ${updateError.message}`);
    } else {
      setMessage('Profile updated successfully!');
      await refreshProfile();
      setIsEditing(false);
    }
    setLoading(false);
  };

  if (authLoading) {
    return <div className="text-center py-20">Loading profile...</div>;
  }

  if (!user || !profile) {
    return <div className="text-center py-20">Could not load user profile.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">My Profile</h1>
        <div className="bg-white p-8 shadow-lg rounded-lg">
          {message && <div className="bg-green-100 text-green-700 p-3 rounded-md mb-4">{message}</div>}
          {error && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</div>}

          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="flex items-center space-x-4">
              <User className="h-10 w-10 text-gray-400" />
              <div>
                <label className="block text-sm font-medium text-gray-500">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="text-xl font-semibold text-gray-900 border-b-2 border-blue-500 focus:outline-none"
                  />
                ) : (
                  <p className="text-xl font-semibold text-gray-900">{profile.full_name}</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Mail className="h-6 w-6 text-gray-400" />
              <div>
                <label className="block text-sm font-medium text-gray-500">Email</label>
                <p className="text-gray-700">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Shield className="h-6 w-6 text-gray-400" />
              <div>
                <label className="block text-sm font-medium text-gray-500">Role</label>
                <p className="text-gray-700 capitalize px-2 py-1 bg-blue-100 text-blue-800 rounded-full inline-block text-sm">
                  {profile.role}
                </p>
              </div>
            </div>

            <div className="pt-4 flex justify-end space-x-3">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold flex items-center"
                  >
                    <X className="h-5 w-5 mr-2" /> Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center disabled:opacity-50"
                  >
                    <Save className="h-5 w-5 mr-2" /> {loading ? 'Saving...' : 'Save'}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center"
                >
                  <Edit className="h-5 w-5 mr-2" /> Edit Profile
                </button>
              )}
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
