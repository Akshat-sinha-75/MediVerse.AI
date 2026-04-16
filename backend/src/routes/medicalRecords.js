const express = require('express');
const { supabase } = require('../lib/supabase');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// GET — List user's medical records
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('medical_records')
      .select('*')
      .eq('user_id', req.user.id)
      .order('uploaded_at', { ascending: false });

    if (error) throw error;
    res.json({ records: data });
  } catch (err) {
    console.error('Fetch records error:', err);
    res.status(500).json({ error: 'Failed to fetch records' });
  }
});

// POST — Create a medical record entry
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { file_name, file_url, file_type, file_size, description } = req.body;

    const { data, error } = await supabase.from('medical_records').insert({
      user_id: req.user.id,
      file_name,
      file_url,
      file_type,
      file_size,
      description,
    }).select().single();

    if (error) throw error;
    res.status(201).json({ record: data });
  } catch (err) {
    console.error('Create record error:', err);
    res.status(500).json({ error: 'Failed to create record' });
  }
});

// DELETE — Delete a medical record
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('medical_records')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.id);

    if (error) throw error;
    res.json({ message: 'Record deleted successfully' });
  } catch (err) {
    console.error('Delete record error:', err);
    res.status(500).json({ error: 'Failed to delete record' });
  }
});

module.exports = router;
