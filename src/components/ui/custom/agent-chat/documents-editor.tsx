import type { Section as TSection } from "@/lib/types";
import Footer from "./document-footer";

export interface DocumentEditorProps {
    section: TSection;
    zoomLevel: number;
    onSectionEdit: (section: TSection) => void;
}

export function DocumentEditor({
    section,
    zoomLevel,
    onSectionEdit,
}: DocumentEditorProps) {
    const { id } = section ?? {};

    const scalingStyle = {
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: 'top left'
        }

    return (
        <div
            key={id}
             className="bg-[#0a192f] p-6 overflow-auto border h-full border-[#1e2d3d] transition-all duration-200 shadow-[0_4px_20px_rgba(79,195,247,0.25)] z-10 flex-1"
            style={scalingStyle}
        >
            <div className="flex flex-col h-full">
                <input
                    type="text"
                    value={section.title}
                    onChange={(e) => onSectionEdit({ ...section, title: e.target.value })}
                   className="text-2xl font-mono font-semibold text-center mb-4 px-4 py-2 border border-[#1e2d3d] rounded bg-[#152238] text-[#e6f1ff] focus:outline-none focus:ring-1 focus:ring-[#4fc3f7] placeholder-[#8892b0]"
                />
                <textarea
                    value={section.content}
                    onChange={(e) => onSectionEdit({ ...section, content: e.target.value })}
                   className="flex-1 w-full font-mono p-4 border border-[#1e2d3d] rounded bg-[#152238] text-[#e6f1ff] focus:outline-none focus:ring-1 focus:ring-[#4fc3f7] resize-none placeholder-[#8892b0]"
                />
                {section.footer?.length ? <Footer footer={section.footer} /> : null}
            </div>
        </div>
    );
}