import React from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript'; // Using JS highlighting as a base for custom styles

// Basic PlantUML syntax highlighting extension (simple)
languages.puml = {
    'comment': /'.*/,
    'keyword': /\b(participant|actor|boundary|control|entity|database|collections|queue|box|end box|autonumber|as|title|header|footer|legend|end legend|newpage|alt|else|opt|loop|par|break|critical|group|end|note|left|right|of|over|hnote|rnote|ref|activate|deactivate|destroy|return|create|footbox|hide|show|skinparam)\b/i,
    'operator': /(-->|->|->>|<-|<<-|<-|\\|--|==|--\)|--\>|\|\-\>|\-\>\>|\.\-\>|\[\#|\\n)/,
    'string': /".*"/,
};

const PumlEditor = ({ value, onChange }) => {
    return (
        <div className="flex-1 overflow-auto bg-[#0d1117] border-r border-[#30363d]">
            <Editor
                value={value}
                onValueChange={onChange}
                highlight={(code) => highlight(code, languages.puml, 'puml')}
                padding={20}
                style={{
                    fontFamily: '"Fira Code", "Fira Mono", monospace',
                    fontSize: 14,
                    minHeight: '100%',
                    outline: 'none',
                }}
                className="prism-editor"
            />
        </div>
    );
};

export default PumlEditor;
