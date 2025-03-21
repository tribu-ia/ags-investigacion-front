import { cn, truncateUrl } from "@/lib/utils";
import { CheckIcon, LoaderCircle } from "lucide-react";

export function Progress({
  logs,
}: {
  logs: {
    message: string;
    done: boolean;
  }[];
}) {
  if (logs.length === 0) {
    return null;
  }

  return (
    <div data-test-id="progress-steps">
      <div className="bg-[#0a192f] rounded-lg overflow-hidden text-sm py-2 border border-[#1e2d3d] shadow-[0_0_10px_rgba(79,195,247,0.15)] bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500  animate-gradient-xy">
        {logs.map((log, index) => (
          <div
            key={index}
            data-test-id="progress-step-item"
            className={`flex ${
              log.done || index === logs.findIndex((log) => !log.done)
                ? ""
                : "opacity-50"
            }`}
          >
            <div className="w-8">
              <div
                  className="w-4 h-4 border border-[#1e2d3d] bg-[#152238] flex items-center justify-center rounded-full mt-[10px] ml-[12px]"
                  data-test-id={log.done ? 'progress-step-item_done' : 'progress-step-item_loading'}
              >
                {log.done ? (
                  <CheckIcon className="w-3 h-3 text-[#4fc3f7]" />
                ) : (
                  <LoaderCircle className="w-3 h-3 text-[#4fc3f7] animate-spin" />
                )}
              </div>
              {index < logs.length - 1 && (
                <div
                  className={cn("h-full w-[1px] bg-[#1e2d3d] ml-[20px]")}
                ></div>
              )}
            </div>
            <div className="flex-1 flex justify-center py-2 pl-2 pr-4">
              <div className="flex-1 flex items-center text-xs font-mono text-[#e6f1ff]">
                {log.message.replace(
                  /https?:\/\/[^\s]+/g, // Regex to match URLs
                  (url) => truncateUrl(url) // Replace with truncated URL
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}