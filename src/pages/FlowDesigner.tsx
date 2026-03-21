import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Play,
  Plus,
  Trash2,
  GripVertical,
  GitBranch,
  Repeat,
  Filter,
  Zap,
  Database,
  Mail,
  FileOutput,
  UserPlus,
  ArrowDown,
  ChevronDown,
  ChevronRight,
  Settings2,
  Copy,
  X,
  Workflow,
  Circle,
  Square,
  FileText,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────
type BlockCategory = "trigger" | "logic" | "action";

interface BlockTemplate {
  type: string;
  label: string;
  category: BlockCategory;
  icon: React.ElementType;
  color: string;
  description: string;
  fields?: FieldDef[];
}

interface FieldDef {
  key: string;
  label: string;
  type: "text" | "select" | "field-picker";
  options?: string[];
  placeholder?: string;
}

interface FlowBlock {
  id: string;
  templateType: string;
  config: Record<string, string>;
  trueBranch?: FlowBlock[];
  falseBranch?: FlowBlock[];
}

interface FlowTemplate {
  name: string;
  description: string;
  icon: React.ElementType;
  blocks: FlowBlock[];
}

// ─── Palette Definitions ──────────────────────────────────────
const palette: BlockTemplate[] = [
  {
    type: "trigger-manual",
    label: "Manual",
    category: "trigger",
    icon: Play,
    color: "text-emerald-400",
    description: "Manually triggered by a user",
    fields: [
      { key: "label", label: "Button Label", type: "text", placeholder: "Run Now" },
    ],
  },
  {
    type: "trigger-schedule",
    label: "Scheduled",
    category: "trigger",
    icon: Repeat,
    color: "text-emerald-400",
    description: "Run on a schedule",
    fields: [
      { key: "frequency", label: "Frequency", type: "select", options: ["Daily", "Weekly", "Monthly", "Hourly"] },
      { key: "time", label: "Time", type: "text", placeholder: "09:00" },
    ],
  },
  {
    type: "if",
    label: "If",
    category: "logic",
    icon: GitBranch,
    color: "text-amber-400",
    description: "Conditional branch — runs steps only if condition is true",
    fields: [
      { key: "field", label: "Field", type: "field-picker", placeholder: "Select field" },
      { key: "operator", label: "Operator", type: "select", options: ["equals", "not equals", "contains", "greater than", "less than", "is empty", "is not empty"] },
      { key: "value", label: "Value", type: "text", placeholder: "Comparison value" },
    ],
  },
  {
    type: "if-else",
    label: "If / Else",
    category: "logic",
    icon: GitBranch,
    color: "text-amber-400",
    description: "Two branches — one for true, one for false",
    fields: [
      { key: "field", label: "Field", type: "field-picker", placeholder: "Select field" },
      { key: "operator", label: "Operator", type: "select", options: ["equals", "not equals", "contains", "greater than", "less than", "is empty", "is not empty"] },
      { key: "value", label: "Value", type: "text", placeholder: "Comparison value" },
    ],
  },
  {
    type: "for-each",
    label: "For Each",
    category: "logic",
    icon: Repeat,
    color: "text-amber-400",
    description: "Loop over a list of records",
    fields: [
      { key: "source", label: "Source List", type: "field-picker", placeholder: "Select list" },
      { key: "limit", label: "Limit", type: "text", placeholder: "Max iterations" },
    ],
  },
  {
    type: "where",
    label: "Where",
    category: "logic",
    icon: Filter,
    color: "text-amber-400",
    description: "Filter records by condition",
    fields: [
      { key: "field", label: "Field", type: "field-picker", placeholder: "Select field" },
      { key: "operator", label: "Operator", type: "select", options: ["equals", "not equals", "contains", "greater than", "less than", "in list"] },
      { key: "value", label: "Value", type: "text", placeholder: "Filter value" },
    ],
  },
  {
    type: "lookup",
    label: "Lookup Record",
    category: "action",
    icon: Database,
    color: "text-primary",
    description: "Fetch a record from a table",
    fields: [
      { key: "table", label: "Table", type: "select", options: ["Users", "Incidents", "Tasks", "Projects", "Portfolios"] },
      { key: "matchField", label: "Match Field", type: "field-picker", placeholder: "ID or name" },
      { key: "matchValue", label: "Match Value", type: "text", placeholder: "Value to match" },
    ],
  },
  {
    type: "create-record",
    label: "Create Record",
    category: "action",
    icon: UserPlus,
    color: "text-primary",
    description: "Create a new record",
    fields: [
      { key: "table", label: "Table", type: "select", options: ["Users", "Incidents", "Tasks", "Projects"] },
      { key: "fields", label: "Field Mapping", type: "text", placeholder: "field=value, field=value" },
    ],
  },
  {
    type: "update-record",
    label: "Update Record",
    category: "action",
    icon: Settings2,
    color: "text-primary",
    description: "Update an existing record",
    fields: [
      { key: "table", label: "Table", type: "select", options: ["Users", "Incidents", "Tasks", "Projects"] },
      { key: "recordId", label: "Record ID", type: "field-picker", placeholder: "Select record" },
      { key: "fields", label: "Field Mapping", type: "text", placeholder: "field=value, field=value" },
    ],
  },
  {
    type: "send-email",
    label: "Send Email",
    category: "action",
    icon: Mail,
    color: "text-primary",
    description: "Send an email notification",
    fields: [
      { key: "to", label: "To", type: "text", placeholder: "recipient@company.com" },
      { key: "subject", label: "Subject", type: "text", placeholder: "Email subject" },
      { key: "body", label: "Body", type: "text", placeholder: "Email body template" },
    ],
  },
  {
    type: "run-script",
    label: "Run Script",
    category: "action",
    icon: Zap,
    color: "text-primary",
    description: "Execute a custom script or API call",
    fields: [
      { key: "endpoint", label: "Endpoint / Script", type: "text", placeholder: "/api/custom-action" },
      { key: "method", label: "Method", type: "select", options: ["GET", "POST", "PUT", "DELETE"] },
    ],
  },
  {
    type: "output",
    label: "Set Output",
    category: "action",
    icon: FileOutput,
    color: "text-primary",
    description: "Set flow output variables",
    fields: [
      { key: "variable", label: "Variable Name", type: "text", placeholder: "result" },
      { key: "value", label: "Value", type: "field-picker", placeholder: "Select value" },
    ],
  },
];

const categoryLabels: Record<BlockCategory, string> = {
  trigger: "Triggers",
  logic: "Logic",
  action: "Actions",
};

const categoryColors: Record<BlockCategory, string> = {
  trigger: "border-emerald-500/30 bg-emerald-500/5",
  logic: "border-amber-500/30 bg-amber-500/5",
  action: "border-primary/30 bg-primary/5",
};

const categoryAccents: Record<BlockCategory, string> = {
  trigger: "border-l-emerald-500",
  logic: "border-l-amber-500",
  action: "border-l-primary",
};

// ─── Helpers ──────────────────────────────────────────────────
let _id = 0;
const uid = () => `block-${++_id}-${Date.now()}`;

const getTemplate = (type: string) => palette.find((p) => p.type === type)!;

// ─── Premade Templates ────────────────────────────────────────
const premadeTemplates: FlowTemplate[] = [
  {
    name: "Employee Offboarding",
    description: "Disable accounts, revoke access, notify manager, archive data",
    icon: UserPlus,
    blocks: [
      { id: uid(), templateType: "trigger-manual", config: { label: "Start Offboarding" } },
      { id: uid(), templateType: "lookup", config: { table: "Users", matchField: "Employee ID", matchValue: "" } },
      {
        id: uid(),
        templateType: "if-else",
        config: { field: "User.status", operator: "equals", value: "Active" },
        trueBranch: [
          { id: uid(), templateType: "update-record", config: { table: "Users", recordId: "User.id", fields: "status=Inactive, access=Revoked" } },
          { id: uid(), templateType: "run-script", config: { endpoint: "/api/revoke-sso", method: "POST" } },
          { id: uid(), templateType: "send-email", config: { to: "User.manager_email", subject: "Offboarding Complete: {{User.name}}", body: "All access has been revoked for {{User.name}}." } },
        ],
        falseBranch: [
          { id: uid(), templateType: "send-email", config: { to: "hr@company.com", subject: "Offboarding Skipped", body: "User is already inactive." } },
        ],
      },
      { id: uid(), templateType: "output", config: { variable: "offboard_status", value: "complete" } },
    ],
  },
  {
    name: "Scheduled Report Export",
    description: "Generate and email a Planview portfolio report daily",
    icon: FileText,
    blocks: [
      { id: uid(), templateType: "trigger-schedule", config: { frequency: "Daily", time: "07:00" } },
      { id: uid(), templateType: "run-script", config: { endpoint: "/api/planview/portfolio-report", method: "GET" } },
      { id: uid(), templateType: "send-email", config: { to: "stakeholders@company.com", subject: "Daily Portfolio Report", body: "Please find attached the daily report." } },
      { id: uid(), templateType: "output", config: { variable: "report_status", value: "sent" } },
    ],
  },
];

// ─── Sub-components ───────────────────────────────────────────

function PaletteBlock({ tpl, onAdd }: { tpl: BlockTemplate; onAdd: (type: string) => void }) {
  return (
    <button
      onClick={() => onAdd(tpl.type)}
      className="w-full text-left group flex items-center gap-2.5 px-3 py-2 rounded-md border border-transparent hover:border-border hover:bg-accent/50 transition-all"
    >
      <tpl.icon className={`h-4 w-4 shrink-0 ${tpl.color}`} />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-foreground truncate">{tpl.label}</p>
        <p className="text-[10px] text-muted-foreground truncate">{tpl.description}</p>
      </div>
      <Plus className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}

function FieldEditor({ field, value, onChange }: { field: FieldDef; value: string; onChange: (v: string) => void }) {
  if (field.type === "select" && field.options) {
    return (
      <div className="space-y-1">
        <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">{field.label}</Label>
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="h-8 text-xs bg-secondary border-border">
            <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent>
            {field.options.map((opt) => (
              <SelectItem key={opt} value={opt} className="text-xs">{opt}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">{field.label}</Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        className="h-8 text-xs bg-secondary border-border"
      />
    </div>
  );
}

// ─── Branch Block Renderer ────────────────────────────────────
function BranchColumn({
  label,
  color,
  blocks,
  onAddBlock,
  onRemoveBranchBlock,
  onSelectBlock,
  selectedId,
  onUpdateBlock,
}: {
  label: string;
  color: string;
  blocks: FlowBlock[];
  onAddBlock: () => void;
  onRemoveBranchBlock: (id: string) => void;
  onSelectBlock: (id: string) => void;
  selectedId: string | null;
  onUpdateBlock: (id: string, config: Record<string, string>) => void;
}) {
  return (
    <div className="flex-1 min-w-0">
      <div className={`text-center mb-2`}>
        <Badge variant="outline" className={`text-[9px] px-2 py-0.5 ${color}`}>{label}</Badge>
      </div>
      <div className={`border border-dashed rounded-lg p-2 min-h-[80px] space-y-2 ${color.includes("emerald") ? "border-emerald-500/30 bg-emerald-500/5" : "border-red-500/30 bg-red-500/5"}`}>
        {blocks.map((block, i) => {
          const tpl = getTemplate(block.templateType);
          return (
            <motion.div
              key={block.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative group"
            >
              {i > 0 && (
                <div className="flex justify-center mb-1">
                  <ArrowDown className="h-3 w-3 text-muted-foreground" />
                </div>
              )}
              <div
                onClick={() => onSelectBlock(block.id)}
                className={`rounded-md border-l-2 border p-2 cursor-pointer transition-all ${categoryAccents[tpl.category]} ${selectedId === block.id ? "border-primary/50 bg-accent/60 ring-1 ring-primary/20" : "border-border bg-card hover:bg-accent/30"}`}
              >
                <div className="flex items-center gap-1.5">
                  <tpl.icon className={`h-3 w-3 shrink-0 ${tpl.color}`} />
                  <span className="text-[10px] font-medium text-foreground flex-1 truncate">{tpl.label}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 opacity-0 group-hover:opacity-100 text-destructive"
                    onClick={(e) => { e.stopPropagation(); onRemoveBranchBlock(block.id); }}
                  >
                    <Trash2 className="h-2.5 w-2.5" />
                  </Button>
                </div>
                {tpl.fields && tpl.fields.length > 0 && (
                  <div className="mt-1.5 space-y-1">
                    {tpl.fields.map((field) => (
                      <div key={field.key} className="text-[9px] text-muted-foreground truncate">
                        {field.label}: {block.config[field.key] || <span className="italic">not set</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
        <Button
          variant="ghost"
          size="sm"
          className="w-full h-7 text-[10px] border border-dashed border-border text-muted-foreground hover:text-foreground"
          onClick={onAddBlock}
        >
          <Plus className="h-3 w-3 mr-1" /> Add Step
        </Button>
      </div>
    </div>
  );
}

function FlowBlockCard({
  block,
  index,
  selected,
  onSelect,
  onRemove,
  onDuplicate,
  onUpdate,
  onUpdateBranch,
  onAddToBranch,
  onRemoveFromBranch,
  selectedId,
}: {
  block: FlowBlock;
  index: number;
  selected: boolean;
  onSelect: () => void;
  onRemove: () => void;
  onDuplicate: () => void;
  onUpdate: (config: Record<string, string>) => void;
  onUpdateBranch: (blockId: string, branch: "true" | "false", branchBlocks: FlowBlock[]) => void;
  onAddToBranch: (blockId: string, branch: "true" | "false", type: string) => void;
  onRemoveFromBranch: (blockId: string, branch: "true" | "false", childId: string) => void;
  selectedId: string | null;
}) {
  const tpl = getTemplate(block.templateType);
  const [expanded, setExpanded] = useState(true);
  const isIfElse = block.templateType === "if-else";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10, transition: { duration: 0.15 } }}
      className="relative group"
    >
      {index > 0 && (
        <div className="flex justify-center -mt-1 mb-1">
          <div className="flex flex-col items-center">
            <div className="w-px h-4 bg-border" />
            <ArrowDown className="h-3 w-3 text-muted-foreground -mt-0.5" />
          </div>
        </div>
      )}

      <div
        onClick={onSelect}
        className={`rounded-lg border-l-[3px] border transition-all cursor-pointer ${categoryAccents[tpl.category]} ${selected ? "border-primary/50 bg-accent/60 ring-1 ring-primary/20" : "border-border bg-card hover:bg-accent/30"}`}
      >
        <div className="flex items-center gap-2 px-3 py-2.5">
          <GripVertical className="h-3.5 w-3.5 text-muted-foreground/50 cursor-grab shrink-0" />
          <tpl.icon className={`h-4 w-4 shrink-0 ${tpl.color}`} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-foreground">{tpl.label}</span>
              <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 border-border">{tpl.category}</Badge>
            </div>
          </div>
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); onDuplicate(); }}>
              <Copy className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={(e) => { e.stopPropagation(); onRemove(); }}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
          <button onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }} className="p-0.5 text-muted-foreground hover:text-foreground">
            {expanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
          </button>
        </div>

        <AnimatePresence>
          {expanded && tpl.fields && tpl.fields.length > 0 && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="px-3 pb-3 pt-0 border-t border-border/50 mt-0">
                <div className="grid gap-2.5 pt-2.5">
                  {tpl.fields.map((field) => (
                    <FieldEditor
                      key={field.key}
                      field={field}
                      value={block.config[field.key] || ""}
                      onChange={(v) => onUpdate({ ...block.config, [field.key]: v })}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* If/Else visual branching */}
      {isIfElse && expanded && (
        <div className="mt-2 ml-4">
          {/* Fork lines */}
          <div className="flex justify-center mb-1">
            <div className="flex flex-col items-center">
              <div className="w-px h-3 bg-amber-500/50" />
              <GitBranch className="h-3.5 w-3.5 text-amber-400" />
            </div>
          </div>
          <div className="flex gap-3" onClick={(e) => e.stopPropagation()}>
            <BranchColumn
              label="✓ TRUE"
              color="text-emerald-400 border-emerald-500/30"
              blocks={block.trueBranch || []}
              onAddBlock={() => onAddToBranch(block.id, "true", "lookup")}
              onRemoveBranchBlock={(childId) => onRemoveFromBranch(block.id, "true", childId)}
              onSelectBlock={(id) => onSelect()}
              selectedId={selectedId}
              onUpdateBlock={() => {}}
            />
            <BranchColumn
              label="✗ FALSE"
              color="text-red-400 border-red-500/30"
              blocks={block.falseBranch || []}
              onAddBlock={() => onAddToBranch(block.id, "false", "send-email")}
              onRemoveBranchBlock={(childId) => onRemoveFromBranch(block.id, "false", childId)}
              onSelectBlock={(id) => onSelect()}
              selectedId={selectedId}
              onUpdateBlock={() => {}}
            />
          </div>
          {/* Merge line */}
          <div className="flex justify-center mt-2">
            <div className="flex flex-col items-center">
              <div className="w-32 h-px bg-border" />
              <div className="w-px h-3 bg-border" />
              <Badge variant="outline" className="text-[8px] px-1.5 py-0 border-border text-muted-foreground">merge</Badge>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────
const FlowDesigner = () => {
  const [blocks, setBlocks] = useState<FlowBlock[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [flowName, setFlowName] = useState("New Flow");
  const [paletteFilter, setPaletteFilter] = useState<BlockCategory | "all">("all");
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  const addBlock = useCallback((type: string) => {
    const newBlock: FlowBlock = { id: uid(), templateType: type, config: {}, ...(type === "if-else" ? { trueBranch: [], falseBranch: [] } : {}) };
    setBlocks((prev) => [...prev, newBlock]);
    setSelectedId(newBlock.id);
  }, []);

  const removeBlock = useCallback((id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
    if (selectedId === id) setSelectedId(null);
  }, [selectedId]);

  const duplicateBlock = useCallback((id: string) => {
    setBlocks((prev) => {
      const idx = prev.findIndex((b) => b.id === id);
      if (idx < 0) return prev;
      const clone: FlowBlock = { ...prev[idx], id: uid(), config: { ...prev[idx].config }, trueBranch: prev[idx].trueBranch?.map(b => ({ ...b, id: uid() })), falseBranch: prev[idx].falseBranch?.map(b => ({ ...b, id: uid() })) };
      const next = [...prev];
      next.splice(idx + 1, 0, clone);
      return next;
    });
  }, []);

  const updateBlock = useCallback((id: string, config: Record<string, string>) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, config } : b)));
  }, []);

  const addToBranch = useCallback((blockId: string, branch: "true" | "false", type: string) => {
    setBlocks((prev) => prev.map((b) => {
      if (b.id !== blockId) return b;
      const newChild: FlowBlock = { id: uid(), templateType: type, config: {} };
      if (branch === "true") return { ...b, trueBranch: [...(b.trueBranch || []), newChild] };
      return { ...b, falseBranch: [...(b.falseBranch || []), newChild] };
    }));
  }, []);

  const removeFromBranch = useCallback((blockId: string, branch: "true" | "false", childId: string) => {
    setBlocks((prev) => prev.map((b) => {
      if (b.id !== blockId) return b;
      if (branch === "true") return { ...b, trueBranch: (b.trueBranch || []).filter(c => c.id !== childId) };
      return { ...b, falseBranch: (b.falseBranch || []).filter(c => c.id !== childId) };
    }));
  }, []);

  const updateBranch = useCallback((blockId: string, branch: "true" | "false", branchBlocks: FlowBlock[]) => {
    setBlocks((prev) => prev.map((b) => {
      if (b.id !== blockId) return b;
      if (branch === "true") return { ...b, trueBranch: branchBlocks };
      return { ...b, falseBranch: branchBlocks };
    }));
  }, []);

  const loadTemplate = useCallback((template: FlowTemplate) => {
    const reIdBlock = (b: FlowBlock): FlowBlock => ({
      ...b,
      id: uid(),
      config: { ...b.config },
      trueBranch: b.trueBranch?.map(reIdBlock),
      falseBranch: b.falseBranch?.map(reIdBlock),
    });
    setBlocks(template.blocks.map(reIdBlock));
    setFlowName(template.name);
    setSelectedId(null);
  }, []);

  // Drag and drop handlers
  const handleDragStart = (idx: number) => setDragIdx(idx);
  const handleDragOver = (e: React.DragEvent, idx: number) => { e.preventDefault(); setDragOverIdx(idx); };
  const handleDrop = (idx: number) => {
    if (dragIdx === null || dragIdx === idx) { setDragIdx(null); setDragOverIdx(null); return; }
    setBlocks(prev => {
      const next = [...prev];
      const [moved] = next.splice(dragIdx, 1);
      next.splice(idx > dragIdx ? idx - 1 : idx, 0, moved);
      return next;
    });
    setDragIdx(null);
    setDragOverIdx(null);
  };
  const handleDragEnd = () => { setDragIdx(null); setDragOverIdx(null); };

  const filteredPalette = paletteFilter === "all" ? palette : palette.filter((p) => p.category === paletteFilter);
  const grouped = filteredPalette.reduce<Record<string, BlockTemplate[]>>((acc, tpl) => {
    (acc[tpl.category] ??= []).push(tpl);
    return acc;
  }, {});

  const selectedBlock = blocks.find((b) => b.id === selectedId);
  const selectedTpl = selectedBlock ? getTemplate(selectedBlock.templateType) : null;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5 shrink-0 bg-card/50">
        <div className="flex items-center gap-3">
          <Workflow className="h-5 w-5 text-primary" />
          <Input
            value={flowName}
            onChange={(e) => setFlowName(e.target.value)}
            className="h-8 w-56 text-sm font-medium bg-transparent border-transparent hover:border-border focus:border-border transition-colors"
          />
          <Badge variant="outline" className="text-[10px] border-border">
            {blocks.length} step{blocks.length !== 1 ? "s" : ""}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 text-xs">
            <Settings2 className="h-3.5 w-3.5 mr-1.5" /> Settings
          </Button>
          <Button size="sm" className="h-8 text-xs" disabled={blocks.length === 0}>
            <Play className="h-3.5 w-3.5 mr-1.5" /> Test Run
          </Button>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* ─── Left Palette ─── */}
        <div className="w-64 border-r border-border bg-card/30 flex flex-col shrink-0">
          <div className="p-3 border-b border-border space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Components</p>
            <div className="flex gap-1">
              {(["all", "trigger", "logic", "action"] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setPaletteFilter(cat)}
                  className={`px-2 py-1 rounded text-[10px] font-medium transition-colors ${paletteFilter === cat ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
                >
                  {cat === "all" ? "All" : categoryLabels[cat]}
                </button>
              ))}
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-4">
              {Object.entries(grouped).map(([cat, items]) => (
                <div key={cat}>
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider px-3 mb-1.5">
                    {categoryLabels[cat as BlockCategory]}
                  </p>
                  <div className="space-y-0.5">
                    {items.map((tpl) => (
                      <PaletteBlock key={tpl.type} tpl={tpl} onAdd={addBlock} />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Templates section */}
            <div className="p-2 border-t border-border mt-2">
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider px-3 mb-2">Templates</p>
              <div className="space-y-1">
                {premadeTemplates.map((tpl) => (
                  <button
                    key={tpl.name}
                    onClick={() => loadTemplate(tpl)}
                    className="w-full text-left group flex items-center gap-2.5 px-3 py-2 rounded-md border border-transparent hover:border-border hover:bg-accent/50 transition-all"
                  >
                    <FileText className="h-4 w-4 shrink-0 text-primary" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">{tpl.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{tpl.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* ─── Canvas ─── */}
        <div className="flex-1 overflow-auto">
          <div className="min-h-full p-8 flex justify-center">
            <div className="w-full max-w-2xl">
              {blocks.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-96 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    <Workflow className="h-8 w-8 text-primary/60" />
                  </div>
                  <h3 className="text-sm font-medium text-foreground mb-1">Start building your flow</h3>
                  <p className="text-xs text-muted-foreground max-w-xs mb-6">
                    Add components from the palette or load a template to get started.
                  </p>
                  <div className="flex gap-2 flex-wrap justify-center">
                    <Button variant="outline" size="sm" className="text-xs h-8" onClick={() => addBlock("trigger-manual")}>
                      <Play className="h-3.5 w-3.5 mr-1.5 text-emerald-400" /> Start with Trigger
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs h-8" onClick={() => addBlock("if-else")}>
                      <GitBranch className="h-3.5 w-3.5 mr-1.5 text-amber-400" /> Add Logic
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs h-8" onClick={() => loadTemplate(premadeTemplates[0])}>
                      <FileText className="h-3.5 w-3.5 mr-1.5 text-primary" /> Offboarding Template
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-0">
                  {/* Start node */}
                  <div className="flex justify-center mb-2">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                      <Circle className="h-2.5 w-2.5 fill-emerald-400 text-emerald-400" />
                      <span className="text-[10px] font-medium text-emerald-400">START</span>
                    </div>
                  </div>

                  <AnimatePresence mode="popLayout">
                    {blocks.map((block, i) => (
                      <div
                        key={block.id}
                        draggable
                        onDragStart={() => handleDragStart(i)}
                        onDragOver={(e) => handleDragOver(e, i)}
                        onDrop={() => handleDrop(i)}
                        onDragEnd={handleDragEnd}
                        className={`transition-all ${dragOverIdx === i && dragIdx !== i ? "border-t-2 border-primary" : ""} ${dragIdx === i ? "opacity-40" : ""}`}
                      >
                        <FlowBlockCard
                          block={block}
                          index={i}
                          selected={selectedId === block.id}
                          onSelect={() => setSelectedId(block.id === selectedId ? null : block.id)}
                          onRemove={() => removeBlock(block.id)}
                          onDuplicate={() => duplicateBlock(block.id)}
                          onUpdate={(config) => updateBlock(block.id, config)}
                          onUpdateBranch={updateBranch}
                          onAddToBranch={addToBranch}
                          onRemoveFromBranch={removeFromBranch}
                          selectedId={selectedId}
                        />
                      </div>
                    ))}
                  </AnimatePresence>

                  {/* End node */}
                  <div className="flex justify-center mt-2">
                    <div className="flex flex-col items-center">
                      <div className="w-px h-4 bg-border" />
                      <ArrowDown className="h-3 w-3 text-muted-foreground -mt-0.5 mb-1" />
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted border border-border">
                        <Square className="h-2.5 w-2.5 text-muted-foreground" />
                        <span className="text-[10px] font-medium text-muted-foreground">END</span>
                      </div>
                    </div>
                  </div>

                  {/* Add step button */}
                  <div className="flex justify-center pt-4">
                    <Button variant="outline" size="sm" className="text-xs h-8 border-dashed" onClick={() => addBlock("lookup")}>
                      <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Step
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ─── Right: Properties Panel ─── */}
        {selectedBlock && selectedTpl && (
          <div className="w-72 border-l border-border bg-card/30 flex flex-col shrink-0">
            <div className="p-3 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <selectedTpl.icon className={`h-4 w-4 ${selectedTpl.color}`} />
                <span className="text-xs font-medium">{selectedTpl.label}</span>
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setSelectedId(null)}>
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-3 space-y-4">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Description</p>
                  <p className="text-xs text-muted-foreground">{selectedTpl.description}</p>
                </div>

                <div className={`rounded-md p-2.5 ${categoryColors[selectedTpl.category]}`}>
                  <p className="text-[10px] font-medium uppercase tracking-wider mb-0.5">
                    {selectedTpl.category === "trigger" ? "Trigger" : selectedTpl.category === "logic" ? "Logic Block" : "Action"}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {selectedTpl.category === "trigger"
                      ? "This block starts the flow when conditions are met."
                      : selectedTpl.category === "logic"
                        ? "Controls the execution path based on conditions or loops."
                        : "Performs an operation on your connected systems."}
                  </p>
                </div>

                {selectedTpl.fields && selectedTpl.fields.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Configuration</p>
                    {selectedTpl.fields.map((field) => (
                      <FieldEditor
                        key={field.key}
                        field={field}
                        value={selectedBlock.config[field.key] || ""}
                        onChange={(v) => updateBlock(selectedBlock.id, { ...selectedBlock.config, [field.key]: v })}
                      />
                    ))}
                  </div>
                )}

                {selectedBlock.templateType === "if-else" && (
                  <div className="space-y-2">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Branches</p>
                    <div className="text-[10px] text-muted-foreground">
                      <span className="text-emerald-400 font-medium">TRUE:</span> {(selectedBlock.trueBranch || []).length} step(s)
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      <span className="text-red-400 font-medium">FALSE:</span> {(selectedBlock.falseBranch || []).length} step(s)
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlowDesigner;
