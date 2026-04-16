'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';

export default function MedicalRecordsPage() {
  const [records, setRecords] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data, error } = await supabase
      .from('medical_records')
      .select('*')
      .eq('user_id', session.user.id)
      .order('uploaded_at', { ascending: false });

    if (!error && data) setRecords(data);
    setLoading(false);
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const userId = session.user.id;
    const fileName = `${Date.now()}_${file.name}`;
    const filePath = `${userId}/${fileName}`;

    // Upload to Storage
    const { error: uploadError } = await supabase.storage
      .from('medical-files')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      setUploading(false);
      return;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('medical-files')
      .getPublicUrl(filePath);

    // Save record to database
    const { error: dbError } = await supabase.from('medical_records').insert({
      user_id: userId,
      file_name: file.name,
      file_url: urlData.publicUrl,
      file_type: file.type,
      file_size: file.size,
    });

    if (!dbError) {
      fetchRecords();
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = async (record) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const filePath = `${session.user.id}/${record.file_url.split('/').pop()}`;

    await supabase.storage.from('medical-files').remove([filePath]);
    await supabase.from('medical_records').delete().eq('id', record.id);

    setRecords((prev) => prev.filter((r) => r.id !== record.id));
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="records-page">
      <h1>Medical Records</h1>
      <p className="page-subtitle">Upload and manage your medical documents securely.</p>

      <div
        className="upload-area"
        onClick={() => fileInputRef.current?.click()}
        id="upload-area"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleUpload}
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          id="file-upload-input"
        />
        <div className="upload-icon">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path d="M20 8v18M12 16l8-8 8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6 28v4a2 2 0 002 2h24a2 2 0 002-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <p>
          {uploading ? 'Uploading...' : (
            <>Click to upload or drag and drop<br /><span>PDF, JPG, PNG, DOC up to 10MB</span></>
          )}
        </p>
      </div>

      {loading ? (
        <div className="empty-state">
          <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
          <p>Loading records...</p>
        </div>
      ) : records.length === 0 ? (
        <div className="empty-state">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ margin: '0 auto', display: 'block' }}>
            <path d="M8 6h20l8 8v28a4 4 0 01-4 4H8a4 4 0 01-4-4V10a4 4 0 014-4z" stroke="currentColor" strokeWidth="2" />
            <path d="M28 6v8h8" stroke="currentColor" strokeWidth="2" />
          </svg>
          <p>No medical records yet. Upload your first document above.</p>
        </div>
      ) : (
        <div className="records-list">
          {records.map((record) => (
            <div key={record.id} className="record-card glass-card">
              <div className="record-info">
                <div className="record-file-icon">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4 2h8l4 4v12a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M12 2v4h4" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </div>
                <div>
                  <div className="record-name">{record.file_name}</div>
                  <div className="record-meta">
                    {formatFileSize(record.file_size)} · {new Date(record.uploaded_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="record-actions">
                <button onClick={() => window.open(record.file_url, '_blank')}>View</button>
                <button className="delete" onClick={() => handleDelete(record)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
