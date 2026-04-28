const fs = require('fs');

let content = fs.readFileSync('src/pages/InterviewRoom.tsx', 'utf8');

// We will add a manual textual answer submission to the transcript section
if (content.includes('{isListening && <span className="inline-block w-2 h-4 ml-1 bg-amber-500 animate-pulse"></span>}')) {
    const textInputCode = `
                        {/* Live Transcript / Chat Mode Input */}
                        <div className="w-full bg-gray-900/50 border border-gray-800 rounded-2xl p-6 min-h-[160px] relative mt-4 shadow-inner">
                            <div className="absolute -top-3 left-6 bg-gray-800 text-xs font-bold px-3 py-1 rounded-full text-gray-400 uppercase tracking-widest border border-gray-700 shadow-md">
                                Your Answer
                            </div>
                            
                            {!isListening ? (
                                <p className="text-gray-500 italic mt-2 text-center">Wait for MAX to finish speaking...</p>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex border border-gray-700 bg-gray-800 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#4F46E5] transition-all shadow-sm">
                                        <div className="p-3 bg-gray-700/50 text-gray-400 border-r border-gray-700 flex items-center justify-center">
                                            <Mic size={20} className={isListening ? "text-blue-400 animate-pulse" : ""} />
                                        </div>
                                        <textarea 
                                           id="chat-input"
                                           className="w-full bg-transparent text-white p-4 outline-none resize-none min-h-[100px]"
                                           placeholder="Type your answer here or just speak naturally (Voice is active)..."
                                           defaultValue={transcript || ''}
                                           onKeyDown={(e) => {
                                               if (e.key === 'Enter' && !e.shiftKey) {
                                                   e.preventDefault();
                                                   if (stopListeningRef.current) {
                                                       const val = e.currentTarget.value;
                                                       stopListeningRef.current(true, val);
                                                   }
                                               }
                                           }}
                                        />
                                    </div>
                                    <div className="flex justify-between items-center px-1">
                                        <span className="text-xs text-gray-500 font-medium">Press Enter to submit or use voice</span>
                                        <button 
                                           onClick={() => {
                                               const el = document.getElementById('chat-input') as HTMLTextAreaElement;
                                               if(stopListeningRef.current) stopListeningRef.current(true, el?.value);
                                           }}
                                           className="px-4 py-1.5 bg-[#4F46E5] hover:bg-[#6366f1] text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
                                        >
                                           Submit Answer
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
`;
    // We will do a manual replace using string injection
    content = content.replace(/\{\/\* LIVE TRANSCRIPT \*\/\}.*?<\/p>[\s\S]*?<\/div>/s, textInputCode);
    
    // Fix stopListening reference to take parameter
    content = content.replace(/stopListeningRef\.current\(true\)/g, "stopListeningRef.current(true, document.getElementById('chat-input')?.value)");
    
    fs.writeFileSync('src/pages/InterviewRoom.tsx', content);
    console.log("Updated InterviewRoom.tsx");
} else {
    console.log("Could not find transcript section in InterviewRoom.tsx");
}
