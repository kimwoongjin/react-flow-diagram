/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useRef, useState } from 'react';
import {
  Background,
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  type OnConnect,
  type Node,
  Controls,
  MiniMap,
  MarkerType,
  applyEdgeChanges,
  applyNodeChanges,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import ResizableNode from './ResizableNode';
import SelectNodeArea from './SelectNodeArea';
import ProcessNode from './ProcessNode';
import StartNode from './StartNode';
import EndNode from './EndNode';
import Timer from './Timer';

type NodeDataType = {
  next: string[];
  prev: string[];
  status: 'complete' | 'incomplete';
};

export interface CustomNodeProps {
  data: { label: string; content?: string; isFirst?: boolean };
  selected?: boolean;
  myTurn?: boolean;
  isDone?: boolean;
}

const initialNodes: Node[] = [
  {
    id: '0',
    type: 'StartNode',
    data: { label: 'Start', content: '', isFirst: true },
    position: { x: 0, y: 100 },
  },
  {
    id: '1',
    type: 'EndNode',
    data: { label: 'End', content: '', isFirst: true },
    position: { x: 150, y: 100 },
  },
];

const initialNodeData = new Map<string, NodeDataType>([
  ['0', { next: [], prev: [], status: 'incomplete' }],
  ['1', { next: [], prev: [], status: 'incomplete' }],
]);

const getId = () => `${Math.random().toString(36).substring(2, 9)}`;
const nodeOrigin: [number, number] = [0.5, 0];

const ReactFlowComponent = () => {
  const reactFlowWrapper = useRef(null);
  const [timerStart, setTimerStart] = useState<boolean>(false);
  const [timerStop, setTimerStop] = useState<boolean>(false);
  const [nodeData, setNodeData] = useState<Map<string, NodeDataType>>(initialNodeData);
  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges, setEdges] = useEdgesState([]);
  const { screenToFlowPosition } = useReactFlow();

  const onConnect: OnConnect = useCallback(
    (connection) => {
      setEdges((oldEdges) => {
        setNodeData((prevNodeData) => {
          // setNodeData를 사용하여 상태 업데이트
          const newNodeData = new Map(prevNodeData); // 이전 상태 복사

          // source 노드의 next 배열 업데이트
          const sourceNode = newNodeData.get(connection.source);
          if (sourceNode) {
            sourceNode.next = [...new Set([...sourceNode.next, connection.target])]; // 중복 제거
            newNodeData.set(connection.source, sourceNode);
          }

          // target 노드의 prev 배열 업데이트
          const targetNode = newNodeData.get(connection.target);
          if (targetNode) {
            targetNode.prev = [...new Set([...targetNode.prev, connection.source])]; // 중복 제거
            newNodeData.set(connection.target, targetNode);
          }

          return newNodeData; // 새 Map 반환
        });

        return addEdge(connection, oldEdges);
      });
    },
    [setEdges]
  );

  const onEdgesChange = useCallback(
    (changes: any) => {
      changes.forEach((change: any) => {
        console.log(change);
        if (change.type === 'remove') {
          const findEdge: any = edges.find((edge: any) => edge.id === change.id);
          console.log('find edge', findEdge);
          if (!findEdge) return;

          const sourceNode = nodeData.get(findEdge.source);
          const targetNode = nodeData.get(findEdge.target);
          if (sourceNode) {
            sourceNode.next = sourceNode.next.filter((id) => id !== findEdge.target);
            setNodeData((prevNodeData) => {
              const newNodeData = new Map(prevNodeData);
              newNodeData.set(findEdge.source, sourceNode);
              return newNodeData;
            });
          }
          if (targetNode) {
            targetNode.prev = targetNode.prev.filter((id) => id !== findEdge.source);
            setNodeData((prevNodeData) => {
              const newNodeData = new Map(prevNodeData);
              newNodeData.set(findEdge.target, targetNode);
              return newNodeData;
            });
          }
        }
      });
      setEdges((eds) => applyEdgeChanges(changes, eds));
    },
    [setEdges, edges, nodeData, setNodeData]
  );

  const onNodesChange = useCallback(
    (changes: any) => {
      if (changes[0].type === 'remove') {
        const deleteNodeId = changes[0].id;
        const newNodeData = new Map(nodeData);
        newNodeData.delete(deleteNodeId);
        setNodeData(newNodeData);
      }
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    [setNodes]
  );

  const handleNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      const target = (event.target as HTMLInputElement).value;

      if (!target) return;

      if (target === 'next') {
        // 나 자신 상태 변경 -> 완료
        const newNodeData = new Map(nodeData);
        newNodeData.set(node.id, {
          ...nodeData.get(node.id),
          status: 'complete',
        } as NodeDataType);
        setNodeData(newNodeData);

        // 다음 노드 id 리스트
        const nextNodeIdList = nodeData.get(node.id)?.next || [];

        setEdges((eds: any) => eds.map((e: any) => (e.source === node.id ? { ...e, animated: true } : { ...e })));

        // 다음 노드들의 이전 노드들의 id 리스트
        const prevNodeIdList: string[] = nextNodeIdList
          .reduce((acc: string[], cur: string) => {
            const newPrevList = nodeData.get(cur)?.prev || [];
            console.log(newPrevList);
            if (!newPrevList.length) return acc;

            return [...acc, ...newPrevList];
          }, [])
          .filter((id: string) => id !== node.id);

        // 다음 노드들의 이전 노드들의 상태 확인
        const isAllComplete: boolean = prevNodeIdList.every((id: string) => {
          const status = nodeData.get(id)?.status;
          return status === 'complete';
        });

        setNodes((nds) =>
          nds.map((n: any) => {
            if (isAllComplete) {
              if (nextNodeIdList.includes(n.id)) {
                return { ...n, className: 'animated-border', selected: true, myTurn: isAllComplete };
              } else {
                return { ...n, className: '', selected: false };
              }
            } else {
              if (n.id === node.id) {
                return { ...n, className: 'animated-border', selected: true, myTurn: true, isDone: true };
              }

              return { ...n };
            }
          })
        );

        if (node.id === '0') {
          setTimerStart(true);
          setTimerStop(false);
        }
      }

      if (target === 'prev') {
        const prevNodeIdList = nodeData.get(node.id)?.prev || [];

        // 다음 노드들의 이전 노드들의 id 리스트
        const nextNodeIdList: string[] = prevNodeIdList.reduce((acc: string[], cur: string) => {
          const newNextList = nodeData.get(cur)?.next || [];
          if (!newNextList.length) return acc;

          return [...acc, ...newNextList];
        }, []);

        const newNodeData = new Map(nodeData);

        nextNodeIdList.forEach((id: string) => {
          const nodeToUpdate = newNodeData.get(id);
          if (nodeToUpdate) {
            newNodeData.set(id, {
              ...nodeToUpdate,
              status: 'incomplete',
            });
          }
        });
        setNodeData(newNodeData);

        prevNodeIdList.forEach((id: string) => {
          const nodeToUpdate = newNodeData.get(id);
          if (nodeToUpdate) {
            newNodeData.set(id, {
              ...nodeToUpdate,
              status: 'incomplete',
            });
          }
        });
        setNodeData(newNodeData);

        setEdges((eds: any) =>
          eds.map((e: any) => {
            return nextNodeIdList.includes(e.target) ? { ...e, animated: false } : { ...e };
          })
        );

        setNodes((nds) =>
          nds.map((n) => {
            return nextNodeIdList.includes(n.id)
              ? { ...n, className: '', selected: false }
              : prevNodeIdList.includes(n.id)
              ? { ...n, className: 'animated-border', selected: true, myTurn: true, isDone: false }
              : { ...n };
          })
        );
      }

      if (target === 'finish') {
        setNodes((nds) => nds.map((n) => ({ ...n, className: '', selected: false })));

        setEdges((eds: any) => eds.map((e: any) => ({ ...e, animated: false })));

        const newNodeData = new Map();

        nodeData.forEach((value, key) => {
          newNodeData.set(key, {
            ...value,
            status: 'incomplete',
          });
        });
        setNodeData(newNodeData);

        setTimerStart(false);
        setTimerStop(true);
      }
    },
    [edges, setEdges, setNodes]
  );

  const selectNode: { [key: string]: string } = {
    start: 'StartNode',
    process: 'ProcessNode',
    end: 'EndNode',
  };

  const addNode = useCallback(
    (type: string) => {
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
      setNodeData((prevNodeData) => {
        const newNodeData = new Map(prevNodeData); // 이전 상태 복사
        newNodeData.set(id, {
          next: [],
          prev: [],
          status: 'incomplete',
        });
        return newNodeData; // 새 Map 반환
      });
    },
    [screenToFlowPosition, setNodes, setNodeData]
  );

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
    <div className="wrapper" ref={reactFlowWrapper} style={{ height: '100vh', width: '100vw', display: 'flex' }}>
      <ReactFlow
        style={{ backgroundColor: '#F7F9FB' }}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
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
        <Background />
        <MiniMap />
        <Controls />
        <Timer start={timerStart} stop={timerStop} />
      </ReactFlow>
      <SelectNodeArea addNode={addNode} />
    </div>
  );
};

export default ReactFlowComponent;
