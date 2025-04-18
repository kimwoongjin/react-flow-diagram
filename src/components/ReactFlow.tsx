/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useRef } from 'react';
import {
  Background,
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  // type OnConnectEnd as OnConnectEndType,
  type OnConnect,
  type Node,
  Controls,
  MiniMap,
  MarkerType,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import ResizableNode from './ResizableNode';
// import UpdateForm from './UpdateForm';
// import InitialNode from './InitialNode';
import SelectNodeArea from './SelectNodeArea';
import ProcessNode from './ProcessNode';
import StartNode from './StartNode';
import EndNode from './EndNode';

export interface CustomNodeProps {
  data: { label: string; content?: string; isFirst?: boolean };
  selected?: boolean;
}

const initialNodes: Node[] = [
  {
    id: '0',
    type: 'StartNode',
    data: { label: 'Start', content: '', isFirst: true },
    position: { x: 0, y: 100 },
  },
];

const getId = () => `${Math.random().toString(36).substring(2, 9)}`;
const nodeOrigin: [number, number] = [0.5, 0];

const ReactFlowComponent = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition } = useReactFlow();
  const onConnect: OnConnect = useCallback(
    (connection) => {
      setEdges((oldEdges) => addEdge(connection, oldEdges));
    },
    [setEdges]
  );

  const handleNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      const target = (event.target as HTMLInputElement).value;

      if (!target) return;

      if (target === 'start') {
        const connectedEdge: any = edges.find((e: any) => e.source === node.id);
        const nextNodeId = connectedEdge?.target;

        setEdges((eds: any) => eds.map((e: any) => (e.source === node.id ? { ...e, animated: true } : { ...e })));

        setNodes((nds) =>
          nds.map((n) => (n.id === nextNodeId ? { ...n, className: 'animated-border' } : { ...n, className: '' }))
        );
      }

      if (target === 'stop') {
        const connectedEdge: any = edges.find((e: any) => e.target === node.id);
        const prevNodeId = connectedEdge?.source;

        setEdges((eds: any) => eds.map((e: any) => (e.target === node.id ? { ...e, animated: false } : { ...e })));

        setNodes((nds) =>
          nds.map((n) => (n.id === prevNodeId ? { ...n, className: 'animated-border' } : { ...n, className: '' }))
        );
      }

      if (target === 'finish') {
        setNodes((nds) => nds.map((n) => ({ ...n, className: '' })));

        setEdges((eds: any) => eds.map((e: any) => ({ ...e, animated: false })));
      }
    },
    [edges, setEdges, setNodes]
  );

  const selectNode: { [key: string]: string } = {
    start: 'StartNode',
    process: 'ProcessNode',
    end: 'EndNode',
  };

  const addNode = useCallback((type: string) => {
    const id = getId();
    const newNode = {
      id,
      type: selectNode[type],
      position: screenToFlowPosition({
        x: 600,
        y: 400,
      }),
      data: { label: `Node ${id}` },
      origin: [0.5, 0.0],
    } as Node;

    setNodes((nds) => nds.concat(newNode));
  }, []);

  const connectionLineStyle = { stroke: '#fcfc' };
  const snapGrid: [number, number] = [20, 20];

  const defaultEdgeOptions = {
    // animated: true,
    type: 'smoothstep',
    style: { stroke: '#fcfc', strokeWidth: 1 },
    markerEnd: {
      type: MarkerType.Arrow,
    },
  };

  return (
    <div className="wrapper" ref={reactFlowWrapper} style={{ height: '100vh', width: '100vw' }}>
      <ReactFlow
        style={{ backgroundColor: '#F7F9FB' }}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        // onConnectEnd={onConnectEnd}
        onNodeClick={handleNodeClick}
        fitView
        fitViewOptions={{ padding: 2 }}
        nodeOrigin={nodeOrigin}
        nodeTypes={{ StartNode, ResizableNode, ProcessNode, EndNode }}
        colorMode="light"
        connectionLineStyle={connectionLineStyle}
        snapToGrid={true}
        snapGrid={snapGrid}
        attributionPosition="bottom-left"
        defaultEdgeOptions={defaultEdgeOptions}
      >
        <SelectNodeArea addNode={addNode} />
        <Background />
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default ReactFlowComponent;
