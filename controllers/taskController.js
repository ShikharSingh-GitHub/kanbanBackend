const admin = require('../config/firebaseAdmin');

const getTasks = async (req, res) => {
  try {
    const db = admin.firestore();
    let query = db.collection('tasks');
    
    // Filter tasks by user if authenticated
    if (req.user && req.user.uid) {
      query = query.where('userId', '==', req.user.uid);
    }
    
    const snapshot = await query.get();
    const tasks = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        _id: doc.id,
        ...data,
        createdAt: data.createdAt && data.createdAt.toDate ? data.createdAt.toDate().toISOString() : null,
        updatedAt: data.updatedAt && data.updatedAt.toDate ? data.updatedAt.toDate().toISOString() : null,
      };
    });
    res.json(tasks);
  } catch (error) {
    console.error('getTasks error:', error);
    res.status(500).json({ message: error.message });
  }
};

const createTask = async (req, res) => {
  const { title, description, status } = req.body;
  
  // Validate required fields
  if (!title || title.trim().length === 0) {
    return res.status(400).json({ message: 'Task title is required' });
  }
  
  try {
    const db = admin.firestore();
    const payload = { 
      title: title.trim(), 
      description: description ? description.trim() : '', 
      status: status || 'To Do', 
      createdAt: admin.firestore.FieldValue.serverTimestamp() 
    };
    if (req.user && req.user.uid) payload.userId = req.user.uid;
    const docRef = await db.collection('tasks').add(payload);
    const doc = await docRef.get();
    const data = doc.data();
    res.status(201).json({
      _id: doc.id,
      ...data,
      createdAt: data.createdAt && data.createdAt.toDate ? data.createdAt.toDate().toISOString() : null,
    });
  } catch (error) {
    console.error('createTask error:', error);
    res.status(400).json({ message: error.message });
  }
};

const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;
  try {
    const db = admin.firestore();
    const docRef = db.collection('tasks').doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Verify ownership
    const taskData = doc.data();
    if (req.user && req.user.uid && taskData.userId && taskData.userId !== req.user.uid) {
      return res.status(403).json({ message: 'Forbidden: you can only update your own tasks' });
    }
    
    const updates = {};
    if (title !== undefined) updates.title = title.trim();
    if (description !== undefined) updates.description = description.trim();
    if (status !== undefined) updates.status = status;
    updates.updatedAt = admin.firestore.FieldValue.serverTimestamp();
    await docRef.update(updates);
    const updated = await docRef.get();
    const updatedData = updated.data();
    res.json({
      _id: updated.id,
      ...updatedData,
      createdAt: updatedData.createdAt && updatedData.createdAt.toDate ? updatedData.createdAt.toDate().toISOString() : null,
      updatedAt: updatedData.updatedAt && updatedData.updatedAt.toDate ? updatedData.updatedAt.toDate().toISOString() : null,
    });
  } catch (error) {
    console.error('updateTask error:', error);
    res.status(400).json({ message: error.message });
  }
};

const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    const db = admin.firestore();
    const docRef = db.collection('tasks').doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Verify ownership
    const taskData = doc.data();
    if (req.user && req.user.uid && taskData.userId && taskData.userId !== req.user.uid) {
      return res.status(403).json({ message: 'Forbidden: you can only delete your own tasks' });
    }
    
    await docRef.delete();
    res.json({ message: 'Task removed' });
  } catch (error) {
    console.error('deleteTask error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
