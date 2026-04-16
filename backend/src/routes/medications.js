const express = require('express');
const { supabase } = require('../lib/supabase');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// GET — List user's medications
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('medications')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ medications: data });
  } catch (err) {
    console.error('Fetch medications error:', err);
    res.status(500).json({ error: 'Failed to fetch medications' });
  }
});

// POST — Add a medication
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, dosage, frequency, time_of_day, notes } = req.body;

    const { data, error } = await supabase.from('medications').insert({
      user_id: req.user.id,
      name,
      dosage,
      frequency,
      time_of_day,
      notes,
    }).select().single();

    if (error) throw error;
    res.status(201).json({ medication: data });
  } catch (err) {
    console.error('Create medication error:', err);
    res.status(500).json({ error: 'Failed to add medication' });
  }
});

// PUT — Update a medication
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, dosage, frequency, time_of_day, notes, is_active } = req.body;

    const { data, error } = await supabase
      .from('medications')
      .update({ name, dosage, frequency, time_of_day, notes, is_active, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error) throw error;
    res.json({ medication: data });
  } catch (err) {
    console.error('Update medication error:', err);
    res.status(500).json({ error: 'Failed to update medication' });
  }
});

// DELETE — Delete a medication
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('medications')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.id);

    if (error) throw error;
    res.json({ message: 'Medication deleted successfully' });
  } catch (err) {
    console.error('Delete medication error:', err);
    res.status(500).json({ error: 'Failed to delete medication' });
  }
});

module.exports = router;
