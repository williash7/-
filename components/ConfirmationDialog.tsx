
import React from 'react';

interface ConfirmationDialogProps {
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ title, message, onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-sm text-center p-6">
                <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                <p className="text-gray-300 mb-6">{message}</p>
                <div className="flex justify-center space-x-4 space-x-reverse">
                    <button
                        onClick={onCancel}
                        className="px-6 py-2 rounded bg-gray-600 hover:bg-gray-500 text-white font-semibold transition-colors"
                    >
                        ביטול
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-6 py-2 rounded bg-red-600 hover:bg-red-500 text-white font-semibold transition-colors"
                    >
                        אישור
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationDialog;
