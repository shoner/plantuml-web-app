import React from 'react';
import { Loader2, AlertCircle } from 'lucide-react';

const Preview = ({ svgUrl, loading, error }) => {
    return (
        <div className="flex-1 flex items-center justify-center bg-[#161b22] overflow-auto p-4 relative">
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#161b22] bg-opacity-50 z-10">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                </div>
            )}

            {error ? (
                <div className="flex flex-col items-center text-red-400 gap-2">
                    <AlertCircle className="w-12 h-12" />
                    <p className="text-sm">렌더링 중 오류가 발생했습니다.</p>
                </div>
            ) : (
                <div id="diagram-container" className="max-w-full max-h-full">
                    {svgUrl && (
                        <img
                            src={svgUrl}
                            alt="PlantUML Diagram"
                            className="max-w-full h-auto shadow-xl bg-white p-2"
                            onLoad={(e) => {
                                // We could potentially do something when SVG is loaded
                            }}
                            onError={(e) => {
                                // Handling error if URL fails
                            }}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default Preview;
