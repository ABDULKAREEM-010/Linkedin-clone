const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Connection = require('../models/Connection');
const User = require('../models/User');

// @route   POST /api/connections/request
// @desc    Send connection request
// @access  Private
router.post('/request', authMiddleware, async (req, res) => {
  try {
    const { recipientId } = req.body;

    if (!recipientId) {
      return res.status(400).json({ message: 'Recipient ID is required' });
    }

    if (recipientId === req.userId) {
      return res.status(400).json({ message: 'Cannot send request to yourself' });
    }

    // Check if connection already exists
    const existingConnection = await Connection.findOne({
      $or: [
        { requester: req.userId, recipient: recipientId },
        { requester: recipientId, recipient: req.userId }
      ]
    });

    if (existingConnection) {
      return res.status(400).json({ message: 'Connection request already exists' });
    }

    const connection = new Connection({
      requester: req.userId,
      recipient: recipientId
    });

    await connection.save();
    res.status(201).json(connection);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/connections/requests
// @desc    Get pending connection requests
// @access  Private
router.get('/requests', authMiddleware, async (req, res) => {
  try {
    const requests = await Connection.find({
      recipient: req.userId,
      status: 'pending'
    }).populate('requester', 'firstName lastName headline profilePicture');

    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/connections/:id/accept
// @desc    Accept connection request
// @access  Private
router.put('/:id/accept', authMiddleware, async (req, res) => {
  try {
    const connection = await Connection.findById(req.params.id);

    if (!connection) {
      return res.status(404).json({ message: 'Connection request not found' });
    }

    if (connection.recipient.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    connection.status = 'accepted';
    await connection.save();

    // Add to both users' connections
    await User.findByIdAndUpdate(connection.requester, {
      $addToSet: { connections: connection.recipient }
    });

    await User.findByIdAndUpdate(connection.recipient, {
      $addToSet: { connections: connection.requester }
    });

    res.json(connection);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/connections/:id/reject
// @desc    Reject connection request
// @access  Private
router.put('/:id/reject', authMiddleware, async (req, res) => {
  try {
    const connection = await Connection.findById(req.params.id);

    if (!connection) {
      return res.status(404).json({ message: 'Connection request not found' });
    }

    if (connection.recipient.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    connection.status = 'rejected';
    await connection.save();

    res.json(connection);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/connections
// @desc    Get user's connections
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate('connections', 'firstName lastName headline profilePicture location');

    res.json(user.connections);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/connections/:userId
// @desc    Remove connection
// @access  Private
router.delete('/:userId', authMiddleware, async (req, res) => {
  try {
    // Remove from both users' connections
    await User.findByIdAndUpdate(req.userId, {
      $pull: { connections: req.params.userId }
    });

    await User.findByIdAndUpdate(req.params.userId, {
      $pull: { connections: req.userId }
    });

    // Delete connection record
    await Connection.deleteOne({
      $or: [
        { requester: req.userId, recipient: req.params.userId },
        { requester: req.params.userId, recipient: req.userId }
      ]
    });

    res.json({ message: 'Connection removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
