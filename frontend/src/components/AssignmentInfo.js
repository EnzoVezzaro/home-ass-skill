import { useData } from '../state/DataContext';

function AssignmentInfo() {
  

  return (
    <div className="mt-16 bg-white rounded-xl p-8 border border-gray-200">
  <h3 className="text-xl font-bold text-gray-800 mb-6">Technical Specifications</h3>
  
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="space-y-3">
      <div className="flex items-center space-x-3">
        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
        <span className="text-gray-700">Node.js Backend</span>
      </div>
      <div className="flex items-center space-x-3">
        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
        <span className="text-gray-700">React Frontend</span>
      </div>
      <div className="flex items-center space-x-3">
        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
        <span className="text-gray-700">REST API Integration</span>
      </div>
      <div className="flex items-center space-x-3">
        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
        <span className="text-gray-700">Memory Leak Fixed</span>
      </div>
    </div>
    
    <div className="space-y-3">
      <div className="flex items-center space-x-3">
        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
        <span className="text-gray-700">Pagination Support</span>
      </div>
      <div className="flex items-center space-x-3">
        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
        <span className="text-gray-700">Virtualization Ready</span>
      </div>
      <div className="flex items-center space-x-3">
        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
        <span className="text-gray-700">Jest Testing Suite</span>
      </div>
      <div className="flex items-center space-x-3">
        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
        <span className="text-gray-700">Async I/O Operations</span>
      </div>
    </div>
  </div>

</div>
  );
}

export default AssignmentInfo;