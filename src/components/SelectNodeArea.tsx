import { ReactElement } from 'react';
import InitialNode from './InitialNode';
import ProcessNode from './ProcessNode';

type CustomNodeType = 'default' | 'process';

const nodeTypes: { type: CustomNodeType; label: string; node: ReactElement }[] = [
  { type: 'default', label: '기본 노드', node: <InitialNode data={{ label: 'default' }} /> },
  { type: 'process', label: '중간 노드', node: <ProcessNode data={{ label: 'Process' }} /> },
];

const SelectNodeArea = ({ addNode }: { addNode: (type: string) => void }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 10,
        background: 'white',
        padding: '10px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        width: '200px',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '10px',
        }}
      >
        {nodeTypes.map((node) => (
          <div
            onClick={() => addNode(node.type)}
            style={{
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
              background: '#f8f8f8',
              transition: 'all 0.2s',
            }}
          >
            {node.node}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectNodeArea;
