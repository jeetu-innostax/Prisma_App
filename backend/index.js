import { PrismaClient } from '@prisma/client';
import express from 'express';
import cors from 'cors';

const prisma = new PrismaClient();
const app = express();
app.use(express.json());
const port = process.env.PORT || 6000;
const corsOrigin =  'http://localhost:5175';

app.use(cors({ origin: corsOrigin }));

// POST: Create a new user
app.post('/api/user', async (req, res) => {
  try {
    const { name, designation } = req.body;

    if (!name || !designation) {
      return res.status(400).json({
        success: false,
        message: 'Name and designation are required',
      });
    }

    const newUser = await prisma.personDetails.create({
      data: { name, designation },
    });

    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: newUser,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create user',
    });
  }
});

// GET: Fetch all users
app.get('/api/user', async (req, res) => {
  try {
    const users = await prisma.personDetails.findMany();
    return res.status(200).json({
      success: true,
      message: 'Users fetched successfully',
      data: { users },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
    });
  }
});

// PUT: Update a user by ID
app.put('/api/user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, designation } = req.body;
    if (!name || !designation) {
      return res.status(400).json({
        success: false,
        message: 'Name and designation are required',
      });
    }

    const updatedUser = await prisma.personDetails.update({
      where: { id: parseInt(id) },
      data: { name, designation },
    });

    return res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({
      success: false,
      message:  'Failed to update user',
    });
  }
});

// DELETE: Delete a user by ID
app.delete('/api/user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.personDetails.delete({
      where: { id: parseInt(id) },
    });

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete user',
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});