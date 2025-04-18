type CustomNodeType = 'start' | 'process' | 'end';

const nodeTypes: { type: CustomNodeType; label: string }[] = [
  { type: 'start', label: 'Start Node' },
  { type: 'process', label: 'Process Node' },
  { type: 'end', label: 'End Node' },
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
        height: 'auto',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        {nodeTypes.map((node) => (
          <div
            key={node.type}
            onClick={() => addNode(node.type)}
            style={{
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
              background: '#f8f8f8',
              transition: 'all 0.2s',
              textAlign: 'center',
            }}
          >
            <strong>{node.label}</strong>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectNodeArea;
