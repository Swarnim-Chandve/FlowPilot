import React, { useState, useCallback, useEffect } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import { ArrowLeft, PlusCircle, Code } from "lucide-react";

import { TriggerNode, ActionNode } from "./components/nodes/CustomNodes";
import { Sidebar } from "./components/Sidebar";
import { DashboardView } from "./components/DashboardView";
import { TemplatesView } from "./components/TemplatesView";
import { RunsView } from "./components/RunsView";
import { WebhookModal } from "./components/WebhookModal";
import { NodeConfigDrawer } from "./components/NodeConfigDrawer";
import { LiveResultDrawer } from "./components/LiveResultDrawer";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
const HOOKS_URL = import.meta.env.VITE_HOOKS_URL || BACKEND_URL;

const nodeTypes = {
  triggerNode: TriggerNode,
  actionNode: ActionNode,
};

const initialNodes = [
  {
    id: "trigger",
    type: "triggerNode",
    position: { x: 350, y: 60 },
    data: { triggerType: "webhook" },
  },
  {
    id: "action-1",
    type: "actionNode",
    position: { x: 350, y: 220 },
    data: { index: 1, actionType: "playwright", status: "READY" },
  },
  {
    id: "action-2",
    type: "actionNode",
    position: { x: 350, y: 380 },
    data: { index: 2, actionType: "gemini", status: "READY" },
  },
];

const initialEdges = [
  {
    id: "e-trigger-action1",
    source: "trigger",
    target: "action-1",
    style: { stroke: "#10b981", strokeDasharray: "4 4", strokeWidth: 2 },
    animated: false,
  },
  {
    id: "e-action1-action2",
    source: "action-1",
    target: "action-2",
    style: { stroke: "#10b981", strokeDasharray: "4 4", strokeWidth: 2 },
    animated: false,
  },
];

export default function App() {
  const [currentTab, setCurrentTab] = useState("dashboard");
  const [workflows, setWorkflows] = useState([]);
  const [activeWorkflowId, setActiveWorkflowId] = useState("wf_market_intel");
  const [workflowTitle, setWorkflowTitle] = useState("Autonomous Web & AI Digest");
  
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [isRunning, setIsRunning] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);

  const [runs, setRuns] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [showWebhookModal, setShowWebhookModal] = useState(false);
  const [targetUrl, setTargetUrl] = useState("https://news.ycombinator.com");
  const [promptText, setPromptText] = useState("Summarize top 2 trending stories and key sentiment.");
  const [recipientEmail, setRecipientEmail] = useState("recoverybro23@gmail.com");
  const [emailSubject, setEmailSubject] = useState("[FlowPilot AI Alert] Autonomous Execution Report");
  const [slackUrl, setSlackUrlState] = useState(() => localStorage.getItem("fp_slack_url") || "");
  const [discordUrl, setDiscordUrlState] = useState(() => localStorage.getItem("fp_discord_url") || "");
  const [destinationUrl, setDestinationUrlState] = useState(() => localStorage.getItem("fp_dest_url") || "");
  const [sheetWebhookUrl, setSheetWebhookUrlState] = useState(() => localStorage.getItem("fp_sheet_url") || "https://script.google.com/macros/s/AKfycby0NfQXMUknHZjped2NHsZubOVta6Dbdj8mXE4rcivI_ai8ZgCyc6qnWrtT6JcAmq0I/exec");

  const setSlackUrl = (val) => {
    setSlackUrlState(val);
    localStorage.setItem("fp_slack_url", val);
  };
  const setDiscordUrl = (val) => {
    setDiscordUrlState(val);
    localStorage.setItem("fp_discord_url", val);
  };
  const setDestinationUrl = (val) => {
    setDestinationUrlState(val);
    localStorage.setItem("fp_dest_url", val);
  };
  const setSheetWebhookUrl = (val) => {
    setSheetWebhookUrlState(val);
    localStorage.setItem("fp_sheet_url", val);
  };

  const fetchDbWorkflows = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/workflows`);
      if (res.ok) {
        const data = await res.json();
        setWorkflows(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDbRuns = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/runs`);
      if (res.ok) {
        const data = await res.json();
        setRuns(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDbWorkflows();
    fetchDbRuns();
  }, [currentTab]);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: "#10b981", strokeWidth: 2 } }, eds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const handleEditWorkflow = (wf) => {
    setActiveWorkflowId(wf.id);
    setWorkflowTitle(wf.title);
    setTargetUrl(wf.targetUrl || "https://news.ycombinator.com");
    setPromptText(wf.promptText || "Summarize key findings.");
    setCurrentTab("canvas");
  };

    const handleSelectTemplate = (tpl) => {
    setActiveWorkflowId(tpl.id);
    setWorkflowTitle(tpl.title);
    setTargetUrl(tpl.targetUrl);
    setPromptText(tpl.promptText);

    const destType = tpl.destination || "slack";
    const templateNodes = [
      {
        id: "trigger",
        type: "triggerNode",
        position: { x: 350, y: 60 },
        data: { triggerType: "webhook" },
      },
      {
        id: "action-1",
        type: "actionNode",
        position: { x: 350, y: 220 },
        data: { index: 1, actionType: "playwright", status: "READY" },
      },
      {
        id: "action-2",
        type: "actionNode",
        position: { x: 350, y: 380 },
        data: { index: 2, actionType: "gemini", status: "READY" },
      },
      {
        id: "action-3",
        type: "actionNode",
        position: { x: 350, y: 540 },
        data: { index: 3, actionType: destType, status: "READY" },
      },
    ];

    const templateEdges = [
      {
        id: "e-trigger-action1",
        source: "trigger",
        target: "action-1",
        style: { stroke: "#10b981", strokeDasharray: "4 4", strokeWidth: 2 },
      },
      {
        id: "e-action1-action2",
        source: "action-1",
        target: "action-2",
        style: { stroke: "#10b981", strokeDasharray: "4 4", strokeWidth: 2 },
      },
      {
        id: "e-action2-action3",
        source: "action-2",
        target: "action-3",
        style: { stroke: "#10b981", strokeDasharray: "4 4", strokeWidth: 2 },
      },
    ];

    setNodes(templateNodes);
    setEdges(templateEdges);
    setCurrentTab("canvas");

    fetch(`${BACKEND_URL}/api/v1/workflows`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: tpl.id,
        title: tpl.title,
        target_url: tpl.targetUrl,
        prompt: tpl.promptText,
      }),
    }).then(() => fetchDbWorkflows()).catch(console.error);
  };


  
  const handleUpdateNode = (nodeId, dataUpdate) => {
    setNodes((nds) =>
      nds.map((n) => (n.id === nodeId ? { ...n, data: { ...n.data, ...dataUpdate } } : n))
    );
    setSelectedNode((prev) =>
      prev && prev.id === nodeId ? { ...prev, data: { ...prev.data, ...dataUpdate } } : prev
    );
  };

  const handleDeleteNode = (nodeId) => {
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
  };

  const addAction = (type = "gemini") => {
    const newId = "action-" + nodes.length;
    const newY = 60 + nodes.length * 160;
    const newNode = {
      id: newId,
      type: "actionNode",
      position: { x: 350, y: newY },
      data: { index: nodes.length, actionType: type, status: "READY" },
    };
    const newEdge = {
      id: "e-" + nodes[nodes.length - 1].id + "-" + newId,
      source: nodes[nodes.length - 1].id,
      target: newId,
      style: { stroke: "#10b981", strokeDasharray: "4 4", strokeWidth: 2 },
      animated: isRunning,
    };
    setNodes((nds) => [...nds, newNode]);
    setEdges((eds) => [...eds, newEdge]);
  };

  const runWorkflow = async () => {
    setIsRunning(true);
    setExecutionResult(null);

    setEdges((eds) => eds.map((e) => ({ ...e, animated: true })));
    setNodes((nds) =>
      nds.map((n) => (n.type === "actionNode" ? { ...n, data: { ...n.data, status: "RUNNING" } } : n))
    );

    try {
      const res = await fetch(`${HOOKS_URL}/api/v1/webhook/${activeWorkflowId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "ui_canvas_trigger",
          target_url: targetUrl,
          prompt: promptText,
          destination_type: nodes.find(n => ["email", "slack", "sheets", "discord", "webhook_out"].includes(n.data?.actionType))?.data?.actionType || "email",
          recipient_email: recipientEmail,
          email_subject: emailSubject,
          slack_url: slackUrl,
          discord_url: discordUrl,
          destination_url: destinationUrl,
          sheet_webhook_url: sheetWebhookUrl,
        }),
      });
      const data = await res.json();
      const taskId = data.task_id;

      const eventSource = new EventSource(`${BACKEND_URL}/api/v1/tasks/${taskId}/stream`);
      eventSource.onmessage = (event) => {
        const payload = JSON.parse(event.data);
        if (payload.status === "COMPLETED") {
          setExecutionResult(payload.result || payload);
          setNodes((nds) =>
            nds.map((n) => (n.type === "actionNode" ? { ...n, data: { ...n.data, status: "COMPLETED" } } : n))
          );
          setEdges((eds) => eds.map((e) => ({ ...e, animated: false })));
          setIsRunning(false);
          eventSource.close();
          fetchDbRuns();
        } else if (payload.status === "FAILED") {
          setIsRunning(false);
          setEdges((eds) => eds.map((e) => ({ ...e, animated: false })));
          eventSource.close();
        }
      };
      eventSource.onerror = () => {
        setIsRunning(false);
        setEdges((eds) => eds.map((e) => ({ ...e, animated: false })));
        eventSource.close();
      };
    } catch (err) {
      console.error(err);
      setIsRunning(false);
      setEdges((eds) => eds.map((e) => ({ ...e, animated: false })));
    }
  };

  if (currentTab === "canvas") {
    return (
      <div className="w-screen h-screen flex flex-col bg-white font-sans">
        <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentTab("dashboard")}
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <input
              type="text"
              value={workflowTitle}
              onChange={(e) => setWorkflowTitle(e.target.value)}
              className="font-normal text-xs text-slate-800 border border-slate-200 rounded-lg px-3 py-2 w-64 outline-none focus:border-slate-400 bg-white"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowWebhookModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-medium text-slate-700 transition cursor-pointer"
            >
              <Code className="w-3.5 h-3.5 text-slate-500" />
              Webhook Credentials
            </button>

            <button
              onClick={() => addAction("webhook_out")}
              className="flex items-center gap-2 px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-medium text-slate-700 transition cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-slate-600" />
              Add Action
            </button>

            <button
              onClick={runWorkflow}
              disabled={isRunning}
              className="px-5 py-2 bg-[#f97316] hover:bg-[#ea580c] disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer"
            >
              {isRunning ? "Executing Pipeline..." : "Publish & Run"}
            </button>
          </div>
        </header>

        <div className="flex-1 relative bg-[#fafafa] flex">
          <div className="flex-1 relative">
            <ReactFlow
              deleteKeyCode={["Backspace", "Delete"]}
              nodes={nodes.map((n) => ({
                ...n,
                data: {
                  ...n.data,
                  isSelected: selectedNode?.id === n.id,
                  onSelect: () => {
                    if (n.id === "trigger") {
                      setShowWebhookModal(true);
                    } else {
                      setSelectedNode(n);
                    }
                  },
                },
              }))}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              fitView
            >
              <Background color="#cbd5e1" gap={24} size={1.2} />
              <Controls />
            </ReactFlow>

            <LiveResultDrawer
              executionResult={executionResult}
              onClose={() => setExecutionResult(null)}
            />
          </div>

          <NodeConfigDrawer
            selectedNode={selectedNode}
            onClose={() => setSelectedNode(null)}
            targetUrl={targetUrl}
            setTargetUrl={setTargetUrl}
            promptText={promptText}
            setPromptText={setPromptText}
            onDeleteNode={handleDeleteNode}
            onUpdateNode={handleUpdateNode}
            recipientEmail={recipientEmail}
            setRecipientEmail={setRecipientEmail}
            emailSubject={emailSubject}
            setEmailSubject={setEmailSubject}
            sheetWebhookUrl={sheetWebhookUrl}
            setSheetWebhookUrl={setSheetWebhookUrl}
            slackUrl={slackUrl}
            setSlackUrl={setSlackUrl}
            discordUrl={discordUrl}
            setDiscordUrl={setDiscordUrl}
            destinationUrl={destinationUrl}
            setDestinationUrl={setDestinationUrl}
            backendUrl={BACKEND_URL}
          />

          <WebhookModal
            isOpen={showWebhookModal}
            hooksUrl={HOOKS_URL}
            activeWorkflowId={activeWorkflowId}
            onClose={() => setShowWebhookModal(false)}
            targetUrl={targetUrl}
            promptText={promptText}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <SignedOut>
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-10 shadow-sm text-center">
            <div className="w-14 h-14 rounded-2xl bg-orange-500 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-5 shadow-md shadow-orange-500/20">
              ⚡
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">FlowPilot AI</h1>
            <p className="text-xs text-slate-500 mt-2 mb-8 leading-relaxed">
              Automate your workflows with distributed autonomous web agents and event-driven pipelines.
            </p>
            <SignInButton mode="modal">
              <button className="w-full py-3 bg-[#f97316] hover:bg-[#ea580c] text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer flex items-center justify-center gap-2">
                Sign In to Dashboard
              </button>
            </SignInButton>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="min-h-screen bg-white flex font-sans text-slate-800">
          <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />

          <main className="flex-1 p-10 overflow-y-auto">
            {currentTab === "dashboard" && (
              <DashboardView
                workflows={workflows}
                runsCount={runs.length}
                onStartWithTemplate={() => setCurrentTab("templates")}
                onCreateWorkflow={() => {
                  setWorkflowTitle("New Autonomous Workflow");
                  setCurrentTab("canvas");
                }}
                onEditWorkflow={handleEditWorkflow}
              />
            )}

            {currentTab === "templates" && (
              <TemplatesView onSelectTemplate={handleSelectTemplate} />
            )}

            {currentTab === "runs" && (
              <RunsView runs={runs} onRefresh={fetchDbRuns} />
            )}
          </main>
        </div>
      </SignedIn>
    </>
  );
}
