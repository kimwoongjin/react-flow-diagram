import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { CustomNodeProps } from './ReactFlow';

const ProcessNode = ({ data, selected, myTurn, isDone }: CustomNodeProps) => {
  return (
    <>
      <Handle type="target" position={Position.Left} />
      <div style={{ padding: 5 }}>{data.label}</div>
      <div style={{ padding: 5 }}>{data.content}</div>
      {(selected || myTurn) && (
        <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
          <button className="button-start" value={'next'} disabled={isDone}>
            완료
          </button>
          <button className="button-stop" value={'prev'}>
            이전
          </button>
        </div>
      )}
      <Handle type="source" position={Position.Right} />
    </>
  );
};
export default memo(ProcessNode);
