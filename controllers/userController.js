const admin = require('../config/firebaseAdmin');

const getCurrentUser = async (req, res) => {
  try {
    const uid = req.user && req.user.uid;
    if (!uid) return res.status(401).json({ message: 'Unauthorized' });
    const db = admin.firestore();
    const doc = await db.collection('users').doc(uid).get();
    if (!doc.exists) return res.status(404).json({ message: 'Profile not found' });
    return res.json({ uid: doc.id, ...doc.data() });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

const createOrUpdateProfile = async (req, res) => {
  try {
    const uid = req.user && req.user.uid;
    if (!uid) return res.status(401).json({ message: 'Unauthorized' });
    const { displayName, fullName, username } = req.body;
    const db = admin.firestore();
    const data = {
      displayName: displayName || null,
      fullName: fullName || null,
      username: username || null,
      email: req.user.email || null,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    const docRef = db.collection('users').doc(uid);
    await docRef.set(data, { merge: true });
    const doc = await docRef.get();
    res.status(200).json({ uid: doc.id, ...doc.data() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getCurrentUser, createOrUpdateProfile };
