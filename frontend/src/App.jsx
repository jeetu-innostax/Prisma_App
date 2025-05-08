import './App.css'
import { useState, useEffect } from 'react';
import useTodoStore from './store/personaDetails.js';

function App() {
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modalDesignation, setModalDesignation] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    todos,
    fetchTodos,
    addTodo,
    updateTodo,
    deleteTodo,
    loading,
    actionLoading,
    error,
  } = useTodoStore();

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !designation.trim()) {
      setErrorMessage('Name and designation are required.');
      return;
    }
    
    setErrorMessage('');
    if (editingId !== null) {
      await updateTodo(editingId, { name, designation });
      setEditingId(null);
    }
    
    setName('');
    setDesignation('');
  };

  const handleEdit = (todo) => {
    setName(todo.name || '');
    setDesignation(todo.designation || '');
    setEditingId(todo.id);
    setErrorMessage('');
  };

  const openModal = () => {
    setModalName('');
    setModalDesignation('');
    setIsModalOpen(true);
    setErrorMessage('');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setErrorMessage('');
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    if (!modalName.trim() || !modalDesignation.trim()) {
      setErrorMessage('Name and designation are required.');
      return;
    }
    
    await addTodo({ name: modalName, designation: modalDesignation });
    closeModal();
  };

  return (
    <>
      <div className="p-4 max-w-xl mx-auto">
        <h1 className="text-xl font-semibold mb-4">Employee List</h1>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded flex justify-between items-center">
            <span>{errorMessage}</span>
            <button onClick={() => setErrorMessage('')} className="text-red-700 font-bold">×</button>
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => useTodoStore.getState().clearError()} className="text-red-700 font-bold">×</button>
          </div>
        )}

        {/* Edit Form (only visible when editing) */}
        {editingId !== null && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-4 p-4 border rounded">
            <h2 className="text-lg font-medium mb-2">Edit Employee</h2>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Name"
              className="border px-3 py-2 w-full mb-2"
              disabled={actionLoading}
            />
            <input
              type="text"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              placeholder="Enter Designation"
              className="border px-3 py-2 w-full mb-2"
              disabled={actionLoading}
            />
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setEditingId(null)}
                className="bg-gray-300 text-black px-4 py-2 rounded"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
                disabled={actionLoading}
              >
                {actionLoading ? 'Updating...' : 'Update'}
              </button>
            </div>
          </form>
        )}

        {/* Add Button */}
        <div className="mb-4">
          <button
            type="button"
            onClick={openModal}
            className="bg-green-500 text-white px-4 py-2 rounded"
            disabled={actionLoading}
          >
            Add New Employee
          </button>
        </div>

        {/* Feedback */}
        {loading && <p>Loading employees...</p>}

        {/* Employee List */}
        <ul className="space-y-2">
          {Array.isArray(todos) && todos.map((todo, index) => (
            <li key={todo.id || `todo-${index}`} className="flex justify-between items-center bg-gray-100 p-2 rounded shadow">
              <div>
                <span className="font-medium">{todo.name}</span>
                <span className="ml-2 text-gray-600">({todo.designation})</span>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(todo)}
                  className="text-blue-500 bg-blue-100 px-2 py-1 rounded"
                  disabled={actionLoading}
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="text-red-500 bg-red-100 px-2 py-1 rounded"
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* Modal for Adding Employee */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-transparent bg-opacity-75 backdrop-blur-sm  flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h2 className="text-lg font-semibold mb-4">Add New Employee</h2>
              <form onSubmit={handleModalSubmit}>
                <input
                  type="text"
                  value={modalName}
                  onChange={(e) => setModalName(e.target.value)}
                  placeholder="Enter name"
                  className="border px-3 py-2 w-full mb-4"
                  autoFocus
                  disabled={actionLoading}
                />
                <input
                  type="text"
                  value={modalDesignation}
                  onChange={(e) => setModalDesignation(e.target.value)}
                  placeholder="Enter designation"
                  className="border px-3 py-2 w-full mb-4"
                  disabled={actionLoading}
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="bg-gray-300 text-black px-4 py-2 rounded"
                    disabled={actionLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    disabled={actionLoading}
                  >
                    {actionLoading ? 'Adding...' : 'Add'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default App