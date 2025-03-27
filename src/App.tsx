import { ReactFlowProvider } from '@xyflow/react';
import ReactFlowComponent from './components/ReactFlow';

const App = () => (
  <ReactFlowProvider>
    <ReactFlowComponent />
  </ReactFlowProvider>
);

export default App;
