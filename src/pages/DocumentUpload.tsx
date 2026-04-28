import React from 'react';
import { useState } from 'react';
import { UploadCloud, FileText, CheckCircle, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const DocumentUpload = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = () => {
    if (files.length === 0) return;
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setUploaded(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 text-gray-900">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl p-8 border relative">
        <button 
          onClick={() => navigate('/seeker/profile')} 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
        
        {uploaded ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} />
            </div>
            <h2 className="text-2xl font-bold mb-4">Documents Uploaded Successfully!</h2>
            <p className="text-gray-600 mb-8 max-w-sm mx-auto">
              We've added your certificates to your profile. The employer will review them shortly.
            </p>
            <p className="font-semibold mb-2">You can safely close this window.</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-blue-900 mb-2">Upload Certificates</h1>
              <p className="text-gray-500">Stand out by uploading your educational or skill certificates (Optional).</p>
            </div>

            <div className="border-2 border-dashed border-blue-200 bg-blue-50/50 rounded-xl p-10 text-center relative hover:bg-blue-50 transition-colors cursor-pointer group">
              <input 
                type="file" 
                multiple 
                onChange={handleFileChange} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept=".jpg,.jpeg,.png,.pdf"
              />
              <UploadCloud className="w-12 h-12 text-blue-400 mx-auto mb-4 group-hover:text-blue-500 transition-colors" />
              <p className="font-medium text-blue-900 mb-1">Click to browse or drag and drop</p>
              <p className="text-sm text-gray-500">JPG, PNG, PDF up to 5MB</p>
            </div>

            {files.length > 0 && (
              <div className="mt-6 space-y-3">
                <h3 className="font-semibold text-sm text-gray-700">Selected Files ({files.length}):</h3>
                {files.map((file, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 border rounded-lg text-sm">
                    <FileText className="text-blue-500 w-5 h-5" />
                    <span className="truncate flex-1 font-medium">{file.name}</span>
                    <span className="text-gray-400 text-xs">{(file.size / 1024 / 1024).toFixed(1)} MB</span>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8 flex gap-4">
              <button 
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                onClick={() => setUploaded(true)}
              >
                Skip for now
              </button>
              <button 
                className={`flex-1 px-4 py-3 rounded-xl font-bold text-white transition-colors flex justify-center items-center ${
                  files.length === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-900 hover:bg-blue-800'
                }`}
                onClick={handleUpload}
                disabled={files.length === 0 || isUploading}
              >
                {isUploading ? 'Uploading...' : 'Upload Files'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DocumentUpload;
