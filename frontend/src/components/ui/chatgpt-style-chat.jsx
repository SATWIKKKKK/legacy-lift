"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { cn } from "../../lib/utils.js";
import {
    Code2,
    FileCode,
    Sparkles,
    ArrowUp,
    Paperclip,
    XIcon,
    LoaderIcon,
    Bug,
    Wand2,
    GitBranch,
    Plus,
    Copy,
    Check,
    ChevronDown,
    ChevronUp,
    Zap,
    Menu,
    Settings,
    User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ChatGPTStyleChat() {
    const [value, setValue] = useState("");
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [showUploadForm, setShowUploadForm] = useState(false);
    const [projectName, setProjectName] = useState("");
    const [description, setDescription] = useState("");
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [uploadMessage, setUploadMessage] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [copiedIndex, setCopiedIndex] = useState(null);
    
    const textareaRef = useRef(null);
    const fileInputRef = useRef(null);
    const messagesEndRef = useRef(null);

    // Auto-resize textarea
    const adjustHeight = useCallback(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        textarea.style.height = '24px';
        textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
    }, []);

    // Fetch projects
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                
                const res = await fetch('/api/projects', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (res.ok) {
                    const data = await res.json();
                    setProjects(data.projects || []);
                    if (data.projects?.length > 0) {
                        setSelectedProject(data.projects[0]);
                    }
                }
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };
        fetchProjects();
    }, []);

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async () => {
        if (!value.trim() || isTyping) return;
        
        const projectId = selectedProject?._id || selectedProject?.id;
        
        if (!projectId) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Please upload a project first to get started.'
            }]);
            return;
        }

        const userMessage = { role: 'user', content: value };
        setMessages(prev => [...prev, userMessage]);
        
        const currentValue = value;
        setValue("");
        if (textareaRef.current) {
            textareaRef.current.style.height = '24px';
        }
        setIsTyping(true);

        try {
            const token = localStorage.getItem('token');
            
            // Fetch project files
            const projectRes = await fetch(`/api/projects/${projectId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (!projectRes.ok) throw new Error('Failed to fetch project');
            
            const projectData = await projectRes.json();
            const projectFiles = projectData.project?.files || [];
            
            if (projectFiles.length === 0) {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: 'No files found in this project. Please upload files first.'
                }]);
                setIsTyping(false);
                return;
            }

            // Determine action
            let actionLabel = 'Refactoring';
            if (currentValue.includes('/bugs')) actionLabel = 'Bug Analysis';
            else if (currentValue.includes('/optimize')) actionLabel = 'Optimization';
            else if (currentValue.includes('/modernize')) actionLabel = 'Modernization';
            else if (currentValue.includes('/docs')) actionLabel = 'Documentation';

            // Call refactor API
            const res = await fetch(`/api/refactor/${projectId}/refactor`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    files: projectFiles.map(f => ({
                        filename: f.filename,
                        content: f.content,
                        language: f.language || 'javascript'
                    }))
                })
            });

            const data = await res.json();

            if (res.ok) {
                const aiMessage = {
                    role: 'assistant',
                    content: `## ${actionLabel} Complete ✓\n\nI've analyzed and refactored **${data.files?.length || 0} file(s)** in your project.\n\n### Summary\n- Version: ${data.version?.versionNumber || 1}\n- Files processed: ${data.files?.length || 0}`,
                    files: data.files || [],
                    hasFiles: true
                };
                setMessages(prev => [...prev, aiMessage]);
            } else {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: `I encountered an error: ${data.error || 'Something went wrong'}. Please try again.`
                }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: `Connection error: ${error.message}. Make sure the backend server is running.`
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            setUploadedFiles(prev => [...prev, ...files]);
            if (!showUploadForm) setShowUploadForm(true);
        }
    };

    const handleUploadProject = async () => {
        if (!projectName || uploadedFiles.length === 0) {
            setUploadMessage("Please provide project name and files");
            return;
        }

        setUploadLoading(true);
        setUploadMessage("");

        try {
            const formData = new FormData();
            formData.append("projectName", projectName);
            formData.append("description", description);
            uploadedFiles.forEach(file => formData.append("files", file));

            const token = localStorage.getItem('token');
            const res = await fetch("/api/upload", {
                method: "POST",
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData,
            });

            const data = await res.json();

            if (res.ok) {
                const newProject = data.project;
                setProjects(prev => [newProject, ...prev]);
                setSelectedProject(newProject);
                setProjectName("");
                setDescription("");
                setUploadedFiles([]);
                setShowUploadForm(false);
                
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: `Project **"${newProject.name}"** uploaded successfully! 🎉\n\nI'm ready to help you refactor, optimize, or analyze your code. Try one of these commands:\n\n- \`/refactor\` - Improve code quality\n- \`/bugs\` - Find potential bugs\n- \`/optimize\` - Improve performance\n- \`/modernize\` - Update legacy patterns`
                }]);
            } else {
                setUploadMessage(data.error || 'Upload failed');
            }
        } catch (error) {
            setUploadMessage("Network error: " + error.message);
        }

        setUploadLoading(false);
    };

    const copyToClipboard = (text, index) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const quickActions = [
        { icon: <Code2 className="w-4 h-4" />, label: "Refactor", command: "/refactor" },
        { icon: <Bug className="w-4 h-4" />, label: "Find Bugs", command: "/bugs" },
        { icon: <Sparkles className="w-4 h-4" />, label: "Optimize", command: "/optimize" },
        { icon: <Wand2 className="w-4 h-4" />, label: "Modernize", command: "/modernize" },
    ];

    return (
        <div className="flex h-screen bg-[#212121] text-white">
            {/* Sidebar */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 260, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        className="bg-[#171717] flex flex-col border-r border-white/10"
                    >
                        {/* New Chat Button */}
                        <div className="p-3">
                            <button
                                onClick={() => {
                                    setMessages([]);
                                    setShowUploadForm(true);
                                }}
                                className="w-full flex items-center gap-3 px-3 py-3 rounded-lg border border-white/20 hover:bg-white/5 transition-colors text-sm"
                            >
                                <Plus className="w-4 h-4" />
                                New Project
                            </button>
                        </div>

                        {/* Projects List */}
                        <div className="flex-1 overflow-y-auto px-3">
                            <div className="text-xs text-white/40 px-2 py-2">Your Projects</div>
                            {projects.map(project => {
                                const id = project._id || project.id;
                                const isSelected = (selectedProject?._id || selectedProject?.id) === id;
                                return (
                                    <button
                                        key={id}
                                        onClick={() => setSelectedProject(project)}
                                        className={cn(
                                            "w-full text-left px-3 py-2.5 rounded-lg text-sm mb-1 transition-colors truncate",
                                            isSelected 
                                                ? "bg-white/10 text-white" 
                                                : "text-white/70 hover:bg-white/5"
                                        )}
                                    >
                                        <div className="flex items-center gap-2">
                                            <FileCode className="w-4 h-4 shrink-0" />
                                            <span className="truncate">{project.name}</span>
                                        </div>
                                        <div className="text-xs text-white/40 ml-6">
                                            {project.files?.length || 0} files
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* User Section */}
                        <div className="p-3 border-t border-white/10">
                            <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 cursor-pointer">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
                                    <User className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-sm">User</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center">
                {/* Header */}
                <div className="h-14 flex items-center px-4 border-b border-white/5">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                    <div className="ml-4 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-green-400" />
                        <span className="font-medium">LegacyLift</span>
                        {selectedProject && (
                            <span className="text-white/40 text-sm">
                                / {selectedProject.name}
                            </span>
                        )}
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto">
                    {messages.length === 0 ? (
                        /* Welcome Screen */
                        <div className="h-full flex flex-col items-center justify-center px-4">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center max-w-2xl"
                            >
                                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
                                    <Zap className="w-8 h-8 text-white" />
                                </div>
                                <h1 className="text-2xl font-semibold mb-2">
                                    How can I help you today?
                                </h1>
                                <p className="text-white/50 mb-8">
                                    Upload your legacy code and I'll help you refactor, optimize, and modernize it.
                                </p>

                                {/* Quick Actions */}
                                <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                                    {quickActions.map((action, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setValue(action.command + " ")}
                                            className="flex items-center gap-3 p-4 rounded-xl border border-white/10 hover:bg-white/5 transition-colors text-left"
                                        >
                                            <div className="text-white/60">{action.icon}</div>
                                            <span className="text-sm">{action.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    ) : (
                        /* Messages */
                        <div className="w-full max-w-2xl py-8 px-6 md:px-12 lg:px-20 mx-auto bg-[#2f2f2f] rounded-2xl shadow-lg">
                            {messages.map((msg, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={cn(
                                        "mb-6",
                                        msg.role === 'user' ? "flex justify-end" : ""
                                    )}
                                >
                                    {msg.role === 'user' ? (
                                        <div className="bg-[#2f2f2f] rounded-2xl px-4 py-3 w-full">
                                            <p className="text-sm whitespace-pre-wrap w-full">{msg.content}</p>
                                        </div>
                                    ) : (
                                        <div className="flex gap-4 w-full">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shrink-0">
                                                <Zap className="w-4 h-4 text-white" />
                                            </div>
                                            <div className="flex-1 min-w-0 w-full">
                                                <div className="prose prose-invert prose-sm max-w-none w-full">
                                                    <div className="text-sm whitespace-pre-wrap leading-relaxed w-full">
                                                        {msg.content}
                                                    </div>
                                                </div>
                                                {/* File Viewers */}
                                                {msg.hasFiles && msg.files?.length > 0 && (
                                                    <div className="mt-4 space-y-3">
                                                        {msg.files.map((file, fileIndex) => (
                                                            <FileCard 
                                                                key={fileIndex} 
                                                                file={file}
                                                                onCopy={() => copyToClipboard(file.refactoredCode || file.content, `${index}-${fileIndex}`)}
                                                                copied={copiedIndex === `${index}-${fileIndex}`}
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                            
                            {/* Typing Indicator */}
                            {isTyping && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex gap-4"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
                                        <Zap className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="flex items-center gap-1 py-3">
                                        <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </motion.div>
                            )}
                            
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                {/* Upload Form Modal */}
                <AnimatePresence>
                    {showUploadForm && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/50 flex items-center justify-center z-50"
                            onClick={() => setShowUploadForm(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                onClick={e => e.stopPropagation()}
                                className="bg-[#2f2f2f] rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl"
                            >
                                <h3 className="text-lg font-semibold mb-4">Upload Project</h3>
                                
                                <input
                                    type="text"
                                    placeholder="Project Name"
                                    value={projectName}
                                    onChange={e => setProjectName(e.target.value)}
                                    className="w-full px-4 py-3 bg-[#212121] rounded-xl mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50"
                                />
                                
                                <textarea
                                    placeholder="Description (optional)"
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    rows={2}
                                    className="w-full px-4 py-3 bg-[#212121] rounded-xl mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 resize-none"
                                />
                                
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center cursor-pointer hover:border-white/40 transition-colors mb-3"
                                >
                                    <Paperclip className="w-6 h-6 mx-auto mb-2 text-white/40" />
                                    <p className="text-sm text-white/60">Click to upload files</p>
                                </div>
                                
                                {uploadedFiles.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {uploadedFiles.map((file, i) => (
                                            <div key={i} className="flex items-center gap-2 bg-[#212121] px-3 py-1.5 rounded-lg text-xs">
                                                <FileCode className="w-3 h-3" />
                                                <span className="truncate max-w-[100px]">{file.name}</span>
                                                <button onClick={() => setUploadedFiles(prev => prev.filter((_, idx) => idx !== i))}>
                                                    <XIcon className="w-3 h-3 text-white/40 hover:text-white" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                
                                {uploadMessage && (
                                    <p className="text-sm text-red-400 mb-3">{uploadMessage}</p>
                                )}
                                
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowUploadForm(false)}
                                        className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-sm"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleUploadProject}
                                        disabled={uploadLoading || !projectName || uploadedFiles.length === 0}
                                        className={cn(
                                            "flex-1 py-3 rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2",
                                            uploadLoading || !projectName || uploadedFiles.length === 0
                                                ? "bg-white/10 text-white/40 cursor-not-allowed"
                                                : "bg-green-600 hover:bg-green-500 text-white"
                                        )}
                                    >
                                        {uploadLoading ? (
                                            <LoaderIcon className="w-4 h-4 animate-spin" />
                                        ) : (
                                            "Upload"
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Hidden File Input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                    accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.cs,.php,.rb,.go,.rs,.html,.css,.json,.md"
                />

                {/* Input Area */}
                <div className="p-4 border-t border-white/5 flex justify-center">
                    <div className="w-full max-w-2xl px-2 md:px-8 lg:px-16">
                        <div className="relative bg-[#2f2f2f] rounded-2xl">
                            <textarea
                                ref={textareaRef}
                                value={value}
                                onChange={e => {
                                    setValue(e.target.value);
                                    adjustHeight();
                                }}
                                onKeyDown={handleKeyDown}
                                placeholder="Message LegacyLift..."
                                rows={1}
                                className="w-full px-4 py-3.5 pr-12 bg-transparent resize-none text-sm focus:outline-none placeholder:text-white/30"
                                style={{ minHeight: '24px', maxHeight: '200px' }}
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!value.trim() || isTyping}
                                className={cn(
                                    "absolute right-2 bottom-2 p-2 rounded-lg transition-colors",
                                    value.trim() && !isTyping
                                        ? "bg-white text-black hover:bg-gray-200"
                                        : "bg-white/10 text-white/30 cursor-not-allowed"
                                )}
                            >
                                <ArrowUp className="w-4 h-4" />
                            </button>
                        </div>
                        <p className="text-xs text-white/30 text-center mt-2">
                            LegacyLift uses AI to help refactor and modernize your code
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// File Card Component
function FileCard({ file, onCopy, copied }) {
    const [expanded, setExpanded] = useState(false);
    
    return (
        <div className="bg-[#1e1e1e] rounded-xl overflow-hidden border border-white/5">
            <div 
                className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-white/5"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex items-center gap-3">
                    <FileCode className="w-4 h-4 text-green-400" />
                    <span className="text-sm font-medium">{file.filename}</span>
                    <span className="text-xs text-white/40 px-2 py-0.5 bg-white/5 rounded">
                        {file.language || 'text'}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onCopy();
                        }}
                        className="p-1.5 hover:bg-white/10 rounded transition-colors"
                    >
                        {copied ? (
                            <Check className="w-4 h-4 text-green-400" />
                        ) : (
                            <Copy className="w-4 h-4 text-white/40" />
                        )}
                    </button>
                    {expanded ? (
                        <ChevronUp className="w-4 h-4 text-white/40" />
                    ) : (
                        <ChevronDown className="w-4 h-4 text-white/40" />
                    )}
                </div>
            </div>
            
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="border-t border-white/5">
                            <pre className="p-4 text-xs text-white/80 overflow-x-auto max-h-96 overflow-y-auto">
                                <code>{file.refactoredCode || file.content}</code>
                            </pre>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default ChatGPTStyleChat;
