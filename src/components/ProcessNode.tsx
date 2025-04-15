import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { CustomNodeProps } from './ReactFlow';

const ProcessNode = ({ data, selected }: CustomNodeProps) => {
  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div style={{ padding: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 style={{ borderBottom: 'solid 1px #000' }}>{data.label}</h1>
        <span>{data.content}</span>
        {selected && (
          <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
            <button value={'confirm'}>완료</button>
            <button value={'stop'}>정지</button>
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
};
export default memo(ProcessNode);
