import React, { useState, useEffect, useCallback } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  useNodesState, 
  useEdgesState, 
  addEdge,
  Connection,
  Handle,
  Position
} from 'reactflow';
import 'reactflow/dist/style.css';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Wand2, Brain, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { GoogleGenerativeAI } from "@google/generative-ai";

const ai = import.meta.env.VITE_GEMINI_API_KEY ? new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY) : null;

const TriggerNode = ({ data }: any) => (
  <div className="px-6 py-4 rounded-2xl bg-curamind-red/10 border-2 border-curamind-red text-curamind-red shadow-2xl backdrop-blur-md min-w-[150px]">
    <Handle type="target" position={Position.Top} className="!bg-curamind-red" />
    <div className="text-[10px] uppercase font-black tracking-widest opacity-50 mb-1">Trigger</div>
    <div className="font-black text-sm">{data.label}</div>
    <Handle type="source" position={Position.Bottom} className="!bg-curamind-red" />
  </div>
);

const InterventionNode = ({ data }: any) => (
  <div className="px-6 py-4 rounded-2xl bg-curamind-green/10 border-2 border-curamind-green text-curamind-green shadow-2xl backdrop-blur-md min-w-[150px]">
    <Handle type="target" position={Position.Top} className="!bg-curamind-green" />
    <div className="text-[10px] uppercase font-black tracking-widest opacity-50 mb-1">Solution</div>
    <div className="font-black text-sm">{data.label}</div>
    <Handle type="source" position={Position.Bottom} className="!bg-curamind-green" />
  </div>
);

const PersonNode = ({ data }: any) => (
  <div className="px-6 py-4 rounded-2xl bg-curamind-yellow/10 border-2 border-curamind-yellow text-curamind-yellow shadow-2xl backdrop-blur-md min-w-[150px]">
    <Handle type="target" position={Position.Top} className="!bg-curamind-yellow" />
    <div className="text-[10px] uppercase font-black tracking-widest opacity-50 mb-1">Support</div>
    <div className="font-black text-sm">{data.label}</div>
    <Handle type="source" position={Position.Bottom} className="!bg-curamind-yellow" />
  </div>
);

export const BrainMapBoard = ({ childId }: { childId: string }) => {
  const nodeTypes = React.useMemo(() => ({
    trigger: TriggerNode,
    intervention: InterventionNode,
    person: PersonNode,
  }), []);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [newNodeLabel, setNewNodeLabel] = useState('');
  const [newNodeType, setNewNodeType] = useState<'trigger' | 'intervention' | 'person'>('trigger');
  
  const [scenario, setScenario] = useState('');
  const [isGeneratingMap, setIsGeneratingMap] = useState(false);

  useEffect(() => {
    if (!childId || childId === 'demo-child') return;

    const fetchNodes = async () => {
      const { data } = await supabase.from('brain_map').select('*').eq('child_id', childId);
      if (data) {
        setNodes(data.map(item => ({
          id: item.id,
          type: item.type,
          data: { label: item.label },
          position: item.position || { x: 100, y: 100 },
        })));
      }
    };

    fetchNodes();
    const channel = supabase.channel(`brain_map_${childId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'brain_map', filter: `child_id=eq.${childId}` }, fetchNodes)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [childId]);

  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const addNode = async () => {
    if (!newNodeLabel.trim()) return;
    const id = Math.random().toString(36).substr(2, 9);
    const newNode = {
      id,
      type: newNodeType,
      data: { label: newNodeLabel },
      position: { x: Math.random() * 400 + 300, y: Math.random() * 400 + 100 },
    };
    
    setNodes((nds) => nds.concat(newNode));
    setNewNodeLabel('');

    if (childId !== 'demo-child') {
      try {
        await supabase.from('brain_map').insert({
          child_id: childId,
          type: newNodeType,
          label: newNodeLabel,
          position: newNode.position
        });
      } catch (e) {}
    }
  };

  const getAnalysis = async () => {
    setIsAnalysing(true);
    if (!ai) {
      setAnalysis("CuraMind AI engine requires a valid key.");
      setIsAnalysing(false);
      return;
    }
    try {
      const mapData = nodes.map(n => `${n.type}: ${n.data.label}`).join(', ');
      const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });
      const response = await model.generateContent(`Based on these sensory map connections: [${mapData}], provide 3 brief clinical insights for parents.`);
      setAnalysis(response.response.text());
    } finally {
      setIsAnalysing(false);
    }
  };

  const generateMapFromScenario = async () => {
    if (!scenario.trim() || !ai) return;
    setIsGeneratingMap(true);
    try {
      const prompt = `Based on: "${scenario}", identify sensory triggers, solutions, and people. Return JSON: [{"type": "trigger"|"intervention"|"person", "label": "name"}]`;
      const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });
      const response = await model.generateContent(prompt);
      const text = response.response.text();
      const elements = JSON.parse(text.replace(/```json|```/g, '').trim());

      for (const el of elements) {
        const id = Math.random().toString(36).substr(2, 9);
        const position = { x: Math.random() * 500 + 300, y: Math.random() * 400 + 100 };
        setNodes(nds => nds.concat({ id, type: el.type, data: { label: el.label }, position }));
        
        if (childId !== 'demo-child') {
          await supabase.from('brain_map').insert({ child_id: childId, type: el.type, label: el.label, position });
        }
      }
      setScenario('');
    } catch (e) {} finally {
      setIsGeneratingMap(false);
    }
  };

  return (
    <div className="w-full h-[700px] bg-curamind-void rounded-[48px] overflow-hidden relative border border-white/5 shadow-2xl">
      {/* Horizontal Dashboard Controls */}
      <div className="absolute top-6 left-6 right-6 z-10 flex gap-6 pointer-events-none">
        <div className="bg-curamind-surface/80 backdrop-blur-3xl p-6 rounded-[32px] border border-white/10 shadow-2xl w-80 pointer-events-auto">
          <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white/40 mb-6">Create Connection</h3>
          <div className="space-y-4">
            <input 
              value={newNodeLabel}
              onChange={(e) => setNewNodeLabel(e.target.value)}
              placeholder="E.g., High Pitched Sounds"
              className="w-full p-4 bg-black/40 border border-white/5 rounded-2xl text-xs font-black text-white focus:outline-none focus:border-curamind-green transition-all"
            />
            <div className="flex gap-2">
              {(['trigger', 'intervention', 'person'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setNewNodeType(type)}
                  className={`flex-1 p-3 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all border ${
                    newNodeType === type 
                      ? type === 'trigger' ? 'bg-curamind-red text-white border-curamind-red' : type === 'intervention' ? 'bg-curamind-green text-white border-curamind-green' : 'bg-curamind-yellow text-white border-curamind-yellow'
                      : 'bg-white/5 text-white/20 border-white/5'
                  }`}
                >
                  {type === 'intervention' ? 'Solution' : type}
                </button>
              ))}
            </div>
            <button onClick={addNode} className="w-full py-4 bg-white text-[#050505] rounded-2xl font-black text-xs uppercase tracking-widest">Connect</button>
          </div>
        </div>

        <div className="bg-curamind-surface/80 backdrop-blur-3xl p-6 rounded-[32px] border border-white/10 shadow-2xl w-80 pointer-events-auto">
          <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white/40 mb-6">Scenario Engine</h3>
          <textarea 
            value={scenario}
            onChange={(e) => setScenario(e.target.value)}
            placeholder="Arjun had a meltdown at the store..."
            className="w-full h-20 p-4 bg-black/40 border border-white/5 rounded-2xl text-xs font-black text-white focus:outline-none focus:border-curamind-green transition-all resize-none mb-4"
          />
          <button 
            onClick={generateMapFromScenario}
            disabled={isGeneratingMap || !scenario.trim()}
            className="w-full py-4 bg-curamind-green text-white rounded-2xl font-black text-xs uppercase tracking-widest disabled:opacity-50"
          >
            {isGeneratingMap ? 'Extracting...' : 'Map Scenario'}
          </button>
        </div>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background color="#222" gap={30} size={1} />
      </ReactFlow>

      {/* Legend */}
      <div className="absolute bottom-8 left-8 flex gap-4">
        <div className="bg-curamind-surface/80 backdrop-blur-xl p-4 rounded-2xl border border-white/10 flex gap-6">
           {[{c: 'curamind-red', l: 'Trigger'}, {c: 'curamind-green', l: 'Solution'}, {c: 'curamind-yellow', l: 'Support'}].map(i => (
             <div key={i.l} className="flex items-center gap-2">
               <div className={`w-2 h-2 rounded-full bg-${i.c}`} />
               <span className="text-[8px] font-black uppercase tracking-widest text-white/40">{i.l}</span>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};
