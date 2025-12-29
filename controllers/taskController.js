const admin = require('../config/firebaseAdmin');

const getTasks = async (req, res) => {
  try {
    const db = admin.firestore();
    const snapshot = await db.collection('tasks').get();
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
    res.status(500).json({ message: error.message });
  }
};

const createTask = async (req, res) => {
  const { title, description, status } = req.body;
  try {
    const db = admin.firestore();
    const payload = { title, description, status: status || 'To Do', createdAt: admin.firestore.FieldValue.serverTimestamp() };
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
    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
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
    await docRef.delete();
    res.json({ message: 'Task removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
