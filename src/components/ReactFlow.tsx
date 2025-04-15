import React, { useCallback, useRef, useState } from 'react';
import {
  Background,
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  type OnConnectEnd as OnConnectEndType,
  type OnConnect,
  type Node,
  Controls,
  MiniMap,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import ResizableNode from './ResizableNode';
import UpdateForm from './UpdateForm';
import InitialNode from './InitialNode';
import SelectNodeArea from './SelectNodeArea';
import ProcessNode from './ProcessNode';

export interface CustomNodeProps {
  data: { label: string; content?: string; isFirst?: boolean };
  selected?: boolean;
}

const initialNodes: Node[] = [
  {
    id: '0',
    type: 'InitialNode',
    data: { label: 'Start', content: 'input Content', isFirst: true },
    position: { x: 0, y: 100 },
  },
];

let id = 1;
const getId = () => `${id++}`;
const nodeOrigin: [number, number] = [0.5, 0];

const ReactFlowComponent = () => {
  const reactFlowWrapper = useRef(null);

  const [updateLabel, setUpdateLabel] = useState<string>('');
  const [updateContent, setUpdateContent] = useState<string>('');
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition } = useReactFlow();
  const onConnect: OnConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

  const onConnectEnd: OnConnectEndType = useCallback(
    (event, connectionState) => {
      // when a connection is dropped on the pane it's not valid
      if (!connectionState.isValid) {
        // we need to remove the wrapper bounds, in order to get the correct position
        const id = getId();
        const { clientX, clientY } = 'changedTouches' in event ? event.changedTouches[0] : event;
        const newNode = {
          id,
          type: 'InitialNode',
          position: screenToFlowPosition({
            x: clientX,
            y: clientY,
          }),
          data: { label: `Node ${id}` },
          origin: [0.5, 0.0],
        } as Node;

        setNodes((nds) => nds.concat(newNode));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setEdges((eds: any) =>
          eds.concat({ type: 'smoothstep', id, source: connectionState.fromNode?.id, target: id })
        );
      }
    },
    [screenToFlowPosition]
  );

  const handleNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      const curMode = (event.target as HTMLInputElement).value;

      if (curMode === 'update') {
        if (isVisible) {
          console.log('update : update');
          setNodes((nds) =>
            nds.map((n) => {
              if (node.id === n.id) {
                return {
                  ...n,
                  data: { label: updateLabel, content: updateContent },
                };
              }
              return n;
            })
          );

          setUpdateLabel('');
          setUpdateContent('');
          setIsVisible(false);
        } else {
          setUpdateLabel(node.data.label as string);
          setUpdateContent(node.data.content as string);
          setIsVisible(true);
        }
      } else {
        setNodes((nds) =>
          nds.map((n) => {
            if (node.id === n.id) {
              return {
                ...n,
                type: curMode === 'resize' ? 'ResizableNode' : 'InitialNode',
              };
            }
            return n;
          })
        );
      }
    },
    [isVisible, updateLabel, updateContent, setNodes, setUpdateLabel, setUpdateContent, setIsVisible]
  );

  const addNode = useCallback((type: string) => {
    const id = getId();
    const newNode = {
      id,
      type: type === 'default' ? 'InitialNode' : 'ProcessNode',
      position: screenToFlowPosition({
        x: 500,
        y: 500,
      }),
      data: { label: `Node ${id}` },
      origin: [0.5, 0.0],
    } as Node;

    setNodes((nds) => nds.concat(newNode));
  }, []);

  return (
    <div className="wrapper" ref={reactFlowWrapper} style={{ height: '100vh', width: '100vw' }}>
      <ReactFlow
        style={{ backgroundColor: '#F7F9FB' }}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectEnd={onConnectEnd}
        onNodeClick={handleNodeClick}
        fitView
        fitViewOptions={{ padding: 2 }}
        nodeOrigin={nodeOrigin}
        nodeTypes={{ InitialNode, ResizableNode, ProcessNode }}
        colorMode="light"
      >
        <UpdateForm
          label={updateLabel}
          content={updateContent}
          setLabel={setUpdateLabel}
          setContent={setUpdateContent}
          isVisible={isVisible}
        />

        <SelectNodeArea addNode={addNode} />
        <Background />
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default ReactFlowComponent;
