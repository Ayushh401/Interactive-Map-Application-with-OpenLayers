"use client";

import { Button } from "@/components/ui/button";
import { 
  MousePointer,
  Pencil,
  Square,
  Circle,
  Ruler
} from "lucide-react";
import { 
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";

interface MapToolsProps {
  activeTool: string;
  onToolChange: (value: string) => void;
}

export function MapTools({ activeTool, onToolChange }: MapToolsProps) {
  return (
    <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-lg p-2">
      <ToggleGroup type="single" value={activeTool} onValueChange={onToolChange}>
        <ToggleGroupItem value="select" aria-label="Select">
          <MousePointer className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="point" aria-label="Add Point">
          <Pencil className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="line" aria-label="Draw Line">
          <Ruler className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="polygon" aria-label="Draw Polygon">
          <Square className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="circle" aria-label="Draw Circle">
          <Circle className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}