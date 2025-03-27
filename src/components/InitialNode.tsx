import { memo } from 'react';
import { Handle, Position, NodeToolbar } from '@xyflow/react';
import { CustomNodeProps } from './ReactFlow';

export type Mode = 'initial' | 'resize' | 'update';

const InitialNode = ({ data, selected }: CustomNodeProps) => {
  return (
    <>
      <NodeToolbar position={Position.Top} isVisible={selected}>
        <button value={'update'}>update</button>
        <button value={'resize'}>resize</button>
      </NodeToolbar>
      {!data.isFirst && <Handle type="target" position={Position.Top} />}
      <div style={{ padding: 10 }}>{data.label}</div>
      <div style={{ padding: 10 }}>{data.content}</div>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
};

export default memo(InitialNode);
