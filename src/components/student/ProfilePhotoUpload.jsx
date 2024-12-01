import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import Button from '../common/Button';

export default function ProfilePhotoUpload({ onUpload }) {
  const [preview, setPreview] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        setPreview(result);
        onUpload(result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center">
        {preview ? (
          <img
            src={preview}
            alt="Profile preview"
            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center">
            <Upload className="w-8 h-8 text-gray-400" />
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            type="button"
            variant="secondary"
            className="cursor-pointer"
            icon={<Upload size={20} />}
          >
            Upload Photo
          </Button>
        </label>
      </div>
    </div>
  );
}