import { Child, Intervention, MeltdownEvent, MemoryEdge, MemoryNode, Prediction, User } from './types';

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Meena Iyer',
  email: 'meena@example.com',
  phone: '+91 98765 43210',
  role: 'parent',
  created_at: new Date().toISOString(),
};

export const MOCK_CHILD: Child = {
  id: 'c1',
  parent_id: 'u1',
  name: 'Arjun',
  age: 7,
  photo_url: 'https://picsum.photos/seed/child/200/200',
  bio: 'Arjun loves dinosaurs and painting.',
  created_at: new Date().toISOString(),
};

export const MOCK_INTERVENTIONS: Intervention[] = [
  { id: 'i1', child_id: 'c1', name: 'Blue Fidget Toy', attempts: 10, successes: 8, icon: 'Gamepad2' },
  { id: 'i2', child_id: 'c1', name: 'Singing', attempts: 10, successes: 7, icon: 'Music' },
  { id: 'i3', child_id: 'c1', name: 'Weighted Blanket', attempts: 10, successes: 6, icon: 'Shield' },
  { id: 'i4', child_id: 'c1', name: 'Dark Room', attempts: 10, successes: 4, icon: 'Moon' },
];

export const MOCK_NODES: MemoryNode[] = [
  { id: 'n1', child_id: 'c1', type: 'trigger', label: 'Loud Sounds', metadata: {}, created_at: '', created_by: '' },
  { id: 'n2', child_id: 'c1', type: 'trigger', label: 'Routine Break', metadata: {}, created_at: '', created_by: '' },
  { id: 'n3', child_id: 'c1', type: 'meltdown', label: 'Severe Meltdown', metadata: {}, created_at: '', created_by: '' },
  { id: 'n4', child_id: 'c1', type: 'intervention', label: 'Blue Fidget', metadata: {}, created_at: '', created_by: '' },
  { id: 'n5', child_id: 'c1', type: 'person', label: 'Dr. Meera', metadata: {}, created_at: '', created_by: '' },
];

export const MOCK_EDGES: MemoryEdge[] = [
  { id: 'e1', child_id: 'c1', source_node_id: 'n1', target_node_id: 'n3', relationship: 'causes', strength: 0.8, created_at: '' },
  { id: 'e2', child_id: 'c1', source_node_id: 'n4', target_node_id: 'n3', relationship: 'calms', strength: 0.9, created_at: '' },
  { id: 'e3', child_id: 'c1', source_node_id: 'n5', target_node_id: 'n4', relationship: 'introduced', strength: 1.0, created_at: '' },
];
