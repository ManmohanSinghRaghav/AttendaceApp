import { useState } from 'react';
import { Video, Copy } from 'lucide-react';
import Button from '../common/Button';
import { addNotification } from '../common/Notification';

export default function ClassMeetLink({ classId, className }) {
  const [meetLink] = useState(() => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/meet/${classId}-${crypto.randomUUID().slice(0, 8)}`;
  });

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(meetLink);
      addNotification('Meet link copied to clipboard!');
    } catch (err) {
      addNotification('Failed to copy link', 'error');
    }
  };

  return (
    <div className="p-4 bg-blue-50 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <Video className="text-blue-600" size={20} />
        <h3 className="font-medium text-blue-900">Virtual Class Link</h3>
      </div>
      
      <p className="text-sm text-blue-700 mb-3">
        Share this link with your students to start a virtual class session for {className}
      </p>

      <div className="flex gap-2">
        <input
          type="text"
          value={meetLink}
          readOnly
          className="flex-1 px-3 py-2 bg-white border border-blue-200 rounded-md text-sm"
        />
        <Button
          onClick={copyLink}
          variant="secondary"
          icon={<Copy size={16} />}
        >
          Copy
        </Button>
      </div>
    </div>
  );
}