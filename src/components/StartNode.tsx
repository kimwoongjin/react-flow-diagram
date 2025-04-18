import { Handle, Position } from '@xyflow/react';
import { memo } from 'react';
import { CustomNodeProps } from './ReactFlow';

const StartNode = ({ data, selected }: CustomNodeProps) => {
  return (
    <>
      <div style={{ padding: 5 }}>{data.label}</div>
      <div style={{ padding: 5 }}>{data.content}</div>
      <div>
        {selected && (
          <button className="button-start" value={'next'}>
            start
          </button>
        )}
      </div>
      <Handle type="source" position={Position.Right} />
    </>
  );
};
export default memo(StartNode);
