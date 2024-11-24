import express, { Router, Response } from 'express';
import { db } from '../config/firebase';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router: Router = express.Router();

// Get all checklist items for a user
router.get('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const items = await db.collection('checklist')
      .where('userId', '==', req.user?.uid)
      .get();

    const itemsList = items.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({ items: itemsList });
  } catch (error) {
    console.error('Error fetching checklist items:', error);
    res.status(500).json({ message: 'Error fetching checklist items' });
  }
});

// Create a new checklist item
router.post('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, category, dueDate, notes } = req.body;
    
    const newItem = {
      title,
      description,
      category,
      completed: false,
      dueDate: dueDate || null,
      notes: notes || '',
      userId: req.user?.uid,
      createdAt: new Date().toISOString()
    };

    const docRef = await db.collection('checklist').add(newItem);
    const item = {
      id: docRef.id,
      ...newItem
    };

    res.status(201).json({ item });
  } catch (error) {
    console.error('Error creating checklist item:', error);
    res.status(500).json({ message: 'Error creating checklist item' });
  }
});

// Update a checklist item
router.patch('/:id', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Verify ownership
    const doc = await db.collection('checklist').doc(id).get();
    if (!doc.exists) {
      res.status(404).json({ message: 'Item not found' });
      return;
    }

    const item = doc.data();
    if (item?.userId !== req.user?.uid) {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }

    await db.collection('checklist').doc(id).update(updates);
    
    const updatedDoc = await db.collection('checklist').doc(id).get();
    const updatedItem = {
      id: updatedDoc.id,
      ...updatedDoc.data()
    };

    res.json({ item: updatedItem });
  } catch (error) {
    console.error('Error updating checklist item:', error);
    res.status(500).json({ message: 'Error updating checklist item' });
  }
});

// Delete a checklist item
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Verify ownership
    const doc = await db.collection('checklist').doc(id).get();
    if (!doc.exists) {
      res.status(404).json({ message: 'Item not found' });
      return;
    }

    const item = doc.data();
    if (item?.userId !== req.user?.uid) {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }

    await db.collection('checklist').doc(id).delete();
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting checklist item:', error);
    res.status(500).json({ message: 'Error deleting checklist item' });
  }
});

export default router;
