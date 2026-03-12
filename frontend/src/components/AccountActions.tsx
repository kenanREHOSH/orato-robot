import React, { useState } from 'react';
import { LogOut, Trash2 } from 'lucide-react';
import type { AccountActionsProps } from '../types/settings.types';
import axios from 'axios';

// For handles the logout and account delete
const AccountActions: React.FC<AccountActionsProps> = ({ userId }) => {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState<boolean>(false);

    const handleLogout = (): void => {
        setShowLogoutConfirm(true);
    };

    const confirmLogout = (): void => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setShowLogoutConfirm(false);
        window.location.href = '/signin';
    };

    const cancelLogout = (): void => {
        setShowLogoutConfirm(false);
    };

    const handleDeleteAccount = (): void => {
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async (): Promise<void> => {
        if (!userId) {
            alert('Unable to identify user session. Please try logging in again.');
            setShowDeleteConfirm(false);
            return;
        }

        try {
            await axios.delete(`http://localhost:5002/api/settings/${userId}`);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setShowDeleteConfirm(false);
            window.location.href = '/signin';
        } catch (err) {
            alert('Failed to delete account. Please try again.');
            setShowDeleteConfirm(false);
        }
    };

    const cancelDelete = (): void => {
        setShowDeleteConfirm(false);
    };

    return (
        <>
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="space-y-3">
                    {/* Log Out Button */}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center p-4 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                        <LogOut className="w-5 h-5 text-gray-600 mr-3 group-hover:text-gray-900 transition-colors" />
                        <span className="text-base font-medium text-gray-900">Log Out</span>
                    </button>

                    {/* Delete Account Button */}
                    <button
                        onClick={handleDeleteAccount}
                        className="w-full flex items-center justify-center p-4 rounded-lg border-2 border-red-200 hover:bg-red-50 transition-colors group"
                    >
                        <Trash2 className="w-5 h-5 text-red-600 mr-2" />
                        <span className="text-base font-medium text-red-600">Delete Account</span>
                    </button>
                </div>
            </div>

            {/* Logout Confirmation Modal */}
            {showLogoutConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-blue-100 rounded-full mb-4">
                            <LogOut className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
                            Log Out?
                        </h3>
                        <p className="text-gray-600 text-center mb-6">
                            Are you sure you want to log out of your account?
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={cancelLogout}
                                className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmLogout}
                                className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                            >
                                Log Out
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                            <Trash2 className="w-6 h-6 text-red-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
                            Delete Account?
                        </h3>
                        <p className="text-gray-600 text-center mb-6">
                            This action cannot be undone. All your data, progress, and settings will be permanently deleted.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={cancelDelete}
                                className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                            >
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AccountActions;