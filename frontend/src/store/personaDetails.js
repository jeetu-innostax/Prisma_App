import { create } from 'zustand';
import axios from 'axios';

const API = 'http://localhost:3000/api/user';

const useTodoStore = create((set) => ({
  todos: [],
  loading: false,
  actionLoading: false,
  error: null,

  fetchTodos: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(API);
      set({ todos: Array.isArray(res.data.data.users) ? res.data.data.users : [], loading: false });
    } catch (err) {
      set({ error: `Failed to fetch employees: ${err.response?.status || ''} ${err.message}`, loading: false });
    }
  },

  addTodo: async ({ name, designation }) => {
    set({ actionLoading: true, error: null });
    try {
      const res = await axios.post(API, { name, designation });
      set((state) => ({ todos: [...state.todos, res.data.data], actionLoading: false }));
    } catch (err) {
      set({ error: `Failed to add employee: ${err.response?.status || ''} ${err.message}`, actionLoading: false });
    }
  },

  updateTodo: async (id, updatedData) => {
    set({ actionLoading: true, error: null });
    try {
      const res = await axios.put(`${API}/${id}`, updatedData);
      set((state) => ({
        todos: state.todos.map((t) => (t.id === id ? res.data.data : t)),
        actionLoading: false,
      }));
    } catch (err) {
      set({ error: `Failed to update employee: ${err.response?.status || ''} ${err.message}`, actionLoading: false });
    }
  },

  deleteTodo: async (id) => {
    set({ actionLoading: true, error: null });
    try {
      await axios.delete(`${API}/${id}`);
      set((state) => ({
        todos: state.todos.filter((t) => t.id !== id),
        actionLoading: false,
      }));
    } catch (err) {
      set({ error: `Failed to delete employee: ${err.response?.status || ''} ${err.message}`, actionLoading: false });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));

export default useTodoStore;