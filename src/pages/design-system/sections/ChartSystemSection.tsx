import { useState, useEffect } from "react";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { oklchToRelativeLuminance, getContrastRatio, parseOklch } from "@/lib/color-utils";

function PairwiseContrastBadge({ c1, c2 }: { c1: string; c2: string }) {
  const [ratio, setRatio] = useState<number | null>(null);

  useEffect(() => {
    const rootStyle = getComputedStyle(document.documentElement);
    const val1 = rootStyle.getPropertyValue(c1).trim();
    const val2 = rootStyle.getPropertyValue(c2).trim();
    
    const parsed1 = parseOklch(`oklch(${val1})`);
    const parsed2 = parseOklch(`oklch(${val2})`);

    if (parsed1 && parsed2) {
      const lum1 = oklchToRelativeLuminance(parsed1.l, parsed1.c, parsed1.h);
      const lum2 = oklchToRelativeLuminance(parsed2.l, parsed2.c, parsed2.h);
      setRatio(getContrastRatio(lum1, lum2));
    }
  }, [c1, c2]);

  if (ratio === null) return null;

  // For adjacent chart elements (non-text), WCAG requires 3:1 for UI components
  // But for chart slices, 1.5:1 is a minimum warning threshold for distinguishable colors
  const isSafe = ratio >= 1.5; 

  return (
    <div className={`flex items-center justify-between text-xs p-2 rounded border ${isSafe ? 'bg-card' : 'bg-warning/10 border-warning/20'}`}>
      <span className="font-medium text-muted-foreground">
        <span className="inline-block w-3 h-3 rounded-sm mr-1.5 align-text-bottom" style={{ backgroundColor: `var(${c1})` }}></span>
        vs
        <span className="inline-block w-3 h-3 rounded-sm ml-1.5 align-text-bottom" style={{ backgroundColor: `var(${c2})` }}></span>
      </span>
      <div className={`flex items-center gap-1.5 font-medium px-2 py-0.5 rounded ${isSafe ? 'text-success bg-success/10' : 'text-warning bg-warning/20'}`}>
        {isSafe ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
        {ratio.toFixed(2)}:1
      </div>
    </div>
  );
}

export function ChartSystemSection() {
  const chartTokens = ["--chart-1", "--chart-2", "--chart-3", "--chart-4", "--chart-5"];
  
  // Generate all C(5,2) pairs
  const pairs = [];
  for (let i = 0; i < chartTokens.length; i++) {
    for (let j = i + 1; j < chartTokens.length; j++) {
      pairs.push([chartTokens[i], chartTokens[j]]);
    }
  }

  return (
    <section id="chart-system" className="space-y-8 pt-12 border-t mt-12">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight">Chart Token Family</h2>
        <p className="text-muted-foreground mt-2">
          Colors used for data visualization. These must maintain mutual distinguishability.
        </p>
      </div>

      {/* Visual Mockups */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Stacked Bar Visualization</h3>
          <div className="h-48 border rounded-lg bg-card p-6 flex items-end justify-center gap-6">
            {/* Bar 1 */}
            <div className="w-16 h-full flex flex-col justify-end gap-0.5 rounded overflow-hidden">
              <div className="bg-chart-1 w-full h-[30%]"></div>
              <div className="bg-chart-2 w-full h-[40%]"></div>
              <div className="bg-chart-3 w-full h-[30%]"></div>
            </div>
            {/* Bar 2 */}
            <div className="w-16 h-[80%] flex flex-col justify-end gap-0.5 rounded overflow-hidden">
              <div className="bg-chart-3 w-full h-[20%]"></div>
              <div className="bg-chart-4 w-full h-[50%]"></div>
              <div className="bg-chart-5 w-full h-[30%]"></div>
            </div>
             {/* Bar 3 */}
             <div className="w-16 h-[60%] flex flex-col justify-end gap-0.5 rounded overflow-hidden">
              <div className="bg-chart-5 w-full h-[40%]"></div>
              <div className="bg-chart-1 w-full h-[40%]"></div>
              <div className="bg-chart-4 w-full h-[20%]"></div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Donut Slice Visualization</h3>
          <div className="h-48 border rounded-lg bg-card p-6 flex items-center justify-center">
            <div 
              className="w-32 h-32 rounded-full"
              style={{
                background: `conic-gradient(
                  var(--chart-1) 0% 20%, 
                  var(--chart-2) 20% 45%, 
                  var(--chart-3) 45% 65%, 
                  var(--chart-4) 65% 85%, 
                  var(--chart-5) 85% 100%
                )`
              }}
            >
              {/* Inner cutout for donut */}
              <div className="w-full h-full rounded-full border-[12px] border-card"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Exhaustive Pairwise Contrast Check */}
      <div className="space-y-4 pt-4">
        <h3 className="font-semibold">Exhaustive Pairwise Contrast (C(5,2))</h3>
        <p className="text-sm text-muted-foreground">
          Checking all 10 combinations of chart colors to ensure they are visually distinguishable (≥ 1.5:1) regardless of sort order.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pairs.map((pair, idx) => (
            <PairwiseContrastBadge key={idx} c1={pair[0]} c2={pair[1]} />
          ))}
        </div>
      </div>

      {/* Semantic Conflict Check */}
      <div className="space-y-4 pt-4">
        <h3 className="font-semibold">Semantic Conflict Check</h3>
        <p className="text-sm text-muted-foreground">
          Ensuring chart colors don't accidentally read as "Warning" or "Destructive".
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {chartTokens.map((chartToken, idx) => (
             <div key={`semantic-${idx}`} className="space-y-2">
               <PairwiseContrastBadge c1={chartToken} c2="--warning" />
               <PairwiseContrastBadge c1={chartToken} c2="--destructive" />
             </div>
          ))}
        </div>
      </div>
    </section>
  );
}
