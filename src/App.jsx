import React, { useState, useEffect, useCallback } from 'react';
import { Download, Share2, Play, Layout, Github } from 'lucide-react';
import debounce from 'lodash.debounce';
import Editor from './components/Editor';
import Preview from './components/Preview';
import { getSvgUrl } from './utils/plantumlHelper';

const INITIAL_PUML = `@startuml
title 시퀀스 다이어그램 예시

participant "사용자" as User
participant "웹 앱" as App
database "서버" as Server

User -> App: 스크립트 입력
App -> App: 인코딩 및 디바운스
App -> Server: SVG 요청
Server --> App: SVG 데이터 반환
App -> User: 다이어그램 표시

opt 다운로드 클릭
    User -> App: 다운로드 버튼 클릭
    App -> User: PNG 파일 저장
end
@enduml`;

function App() {
    const [puml, setPuml] = useState(INITIAL_PUML);
    const [svgUrl, setSvgUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    // Debounced update function
    const debouncedUpdate = useCallback(
        debounce((code) => {
            try {
                const url = getSvgUrl(code);
                setSvgUrl(url);
                setError(false);
            } catch (err) {
                console.error('Encoding error:', err);
                setError(true);
            } finally {
                setLoading(false);
            }
        }, 500),
        []
    );

    useEffect(() => {
        setLoading(true);
        debouncedUpdate(puml);
        return () => debouncedUpdate.cancel();
    }, [puml, debouncedUpdate]);

    const handleDownload = async () => {
        if (!svgUrl) return;

        try {
            const response = await fetch(svgUrl);
            const svgText = await response.text();

            const svgBlob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(svgBlob);

            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const scale = 2; // High DPI
                canvas.width = img.width * scale;
                canvas.height = img.height * scale;

                const ctx = canvas.getContext('2d');
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.scale(scale, scale);
                ctx.drawImage(img, 0, 0);

                const pngUrl = canvas.toDataURL('image/png');
                const downloadLink = document.createElement('a');
                downloadLink.href = pngUrl;
                downloadLink.download = 'plantuml-diagram.png';
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
                URL.revokeObjectURL(url);
            };
            img.src = url;
        } catch (err) {
            console.error('Download failed:', err);
            alert('이미지 다운로드 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="flex flex-col h-screen font-sans">
            {/* Navbar */}
            <nav className="h-16 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between px-6 shrink-0">
                <div className="flex items-center gap-2">
                    <div className="bg-blue-600 p-1.5 rounded-lg">
                        <Layout className="text-white w-6 h-6" />
                    </div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                        PlantUML Live Editor
                    </h1>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleDownload}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white px-4 py-2 rounded-md font-medium text-sm shadow-lg shadow-blue-500/20"
                    >
                        <Download className="w-4 h-4" />
                        다운로드 (PNG)
                    </button>
                    <a
                        href="https://github.com/plantuml/plantuml"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 hover:bg-[#30363d] rounded-full transition-colors"
                    >
                        <Github className="w-5 h-5 text-gray-400" />
                    </a>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 flex overflow-hidden">
                {/* Left: Editor */}
                <div className="w-1/2 flex flex-col">
                    <div className="bg-[#010409] px-4 py-2 border-b border-[#30363d] text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                        <Play className="w-3 h-3 text-green-500" />
                        Script Editor
                    </div>
                    <Editor value={puml} onChange={setPuml} />
                </div>

                {/* Right: Preview */}
                <div className="w-1/2 flex flex-col">
                    <div className="bg-[#010409] px-4 py-2 border-b border-[#30363d] text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Live Preview
                    </div>
                    <Preview svgUrl={svgUrl} loading={loading} error={error} />
                </div>
            </main>

            {/* Footer */}
            <footer className="h-8 bg-[#010409] border-t border-[#30363d] flex items-center px-4 text-[10px] text-gray-500 justify-between">
                <div>Powered by PlantUML Server</div>
                <div className="flex gap-4">
                    <span>Real-time Rendering Enabled</span>
                    <span>© 2026 PlantUML Web App</span>
                </div>
            </footer>
        </div>
    );
}

export default App;
