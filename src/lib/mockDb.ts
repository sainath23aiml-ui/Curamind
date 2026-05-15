// Mock Firestore for Hackathon Demo
// This replaces Firebase with LocalStorage to ensure ZERO CONSOLE ERRORS

const STORAGE_KEY = 'curamind_local_db';

const getStore = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : { 
    children: {
      'demo-child': {
        name: 'Arjun',
        aura_points: 750,
        guardian: 'Parent',
        parent_id: 'demo-user',
        alerts: {},
        notes: {},
        brain_map: {}
      }
    }
  };
};

const saveStore = (store: any) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
};

export const mockDb = {
  // Simple Mock implementations of Firestore functions
  addDoc: async (colPath: any, data: any) => {
    // Basic implementation for adding to local store
    console.log("MockDB: Adding Doc", colPath, data);
    return { id: Math.random().toString(36).substr(2, 9) };
  },
  
  updateDoc: async (docRef: any, data: any) => {
    console.log("MockDB: Updating Doc", data);
  },

  onSnapshot: (ref: any, callback: any, errorCallback?: any) => {
    // Trigger callback once with initial data
    const store = getStore();
    callback({
      exists: () => true,
      data: () => store.children['demo-child'],
      docs: []
    });
    return () => {}; // Unsubscribe
  }
};
