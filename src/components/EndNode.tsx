import { Handle, Position } from '@xyflow/react';
import { memo } from 'react';
import { CustomNodeProps } from './ReactFlow';

const EndNode = ({ data }: CustomNodeProps) => {
  return (
    <>
      <Handle type="target" position={Position.Left} />
      <div style={{ padding: 5 }}>{data.label}</div>
      <div style={{ padding: 5 }}>{data.content}</div>
      <div>
        <button className="button-stop" value={'finish'}>
          end
        </button>
      </div>
    </>
  );
};
export default memo(EndNode);
