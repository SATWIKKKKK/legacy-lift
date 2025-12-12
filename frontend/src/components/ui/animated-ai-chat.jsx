"use client";

import { useEffect, useRef, useCallback, useTransition, useState } from "react";
import { cn } from "../../lib/utils.js";
import {
    Code2,
    FileCode,
    Sparkles,
    MonitorIcon,
    ArrowUpIcon,
    Paperclip,
    SendIcon,
    XIcon,
    LoaderIcon,
    Command,
    Zap,
    GitBranch,
    Bug,
    Wand2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function useAutoResizeTextarea({ minHeight, maxHeight }) {
    const textareaRef = useRef(null);

    const adjustHeight = useCallback(
        (reset) => {
            const textarea = textareaRef.current;
            if (!textarea) return;

            if (reset) {
                textarea.style.height = `${minHeight}px`;
                return;
            }

            textarea.style.height = `${minHeight}px`;
            const newHeight = Math.max(
                minHeight,
                Math.min(
                    textarea.scrollHeight,
                    maxHeight ?? Number.POSITIVE_INFINITY
                )
            );

            textarea.style.height = `${newHeight}px`;
        },
        [minHeight, maxHeight]
    );

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = `${minHeight}px`;
        }
    }, [minHeight]);

    useEffect(() => {
        const handleResize = () => adjustHeight();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [adjustHeight]);

    return { textareaRef, adjustHeight };
}

export function AnimatedAIChat() {
    const [value, setValue] = useState("");
    const [attachments, setAttachments] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [activeSuggestion, setActiveSuggestion] = useState(-1);
    const [showCommandPalette, setShowCommandPalette] = useState(false);
    const [recentCommand, setRecentCommand] = useState(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const { textareaRef, adjustHeight } = useAutoResizeTextarea({
        minHeight: 60,
        maxHeight: 200,
    });
    const [inputFocused, setInputFocused] = useState(false);
    const commandPaletteRef = useRef(null);
    
    // Upload states
    const [projectName, setProjectName] = useState("");
    const [description, setDescription] = useState("");
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [showUploadForm, setShowUploadForm] = useState(false);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [uploadMessage, setUploadMessage] = useState("");
    const fileInputRef = useRef(null);
    
    // AI Chat states
    const [messages, setMessages] = useState([]);
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const messagesEndRef = useRef(null);

    const commandSuggestions = [
        { 
            icon: <Code2 className="w-4 h-4 text-blue-400" />, 
            label: "Refactor Code", 
            description: "AI-powered code refactoring", 
            prefix: "/refactor" 
        },
        { 
            icon: <Bug className="w-4 h-4 text-red-400" />, 
            label: "Find Bugs", 
            description: "Detect code issues and bugs", 
            prefix: "/bugs" 
        },
        { 
            icon: <Sparkles className="w-4 h-4 text-yellow-400" />, 
            label: "Optimize", 
            description: "Performance optimization", 
            prefix: "/optimize" 
        },
        { 
            icon: <GitBranch className="w-4 h-4 text-green-400" />, 
            label: "Create PR", 
            description: "Generate pull request", 
            prefix: "/pr" 
        },
        { 
            icon: <Wand2 className="w-4 h-4 text-purple-400" />, 
            label: "Modernize", 
            description: "Update legacy patterns", 
            prefix: "/modernize" 
        },
        { 
            icon: <FileCode className="w-4 h-4 text-cyan-400" />, 
            label: "Document", 
            description: "Generate documentation", 
            prefix: "/docs" 
        },
    ];

    useEffect(() => {
        if (value.startsWith('/') && !value.includes(' ')) {
            setShowCommandPalette(true);
            
            const matchingSuggestionIndex = commandSuggestions.findIndex(
                (cmd) => cmd.prefix.startsWith(value)
            );
            
            if (matchingSuggestionIndex >= 0) {
                setActiveSuggestion(matchingSuggestionIndex);
            } else {
                setActiveSuggestion(-1);
            }
        } else {
            setShowCommandPalette(false);
        }
    }, [value]);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);
    
    // Fetch user projects
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('No auth token found. Please login first.');
                    return;
                }
                
                console.log('Fetching projects...');
                const res = await fetch('/api/projects', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (!res.ok) {
                    const errorData = await res.json().catch(() => ({}));
                    console.error('Project fetch failed:', res.status, errorData);
                    return;
                }
                
                const data = await res.json();
                console.log('Projects fetched:', data.projects?.length || 0);
                
                if (res.ok && data.projects) {
                    // Log project IDs to debug
                    console.log('Project IDs:', data.projects.map(p => ({ name: p.name, id: p._id })));
                    
                    setProjects(data.projects);
                    if (data.projects.length > 0) {
                        setSelectedProject(data.projects[0]);
                        console.log('Selected project:', data.projects[0].name, 'ID:', data.projects[0]._id);
                    } else {
                        console.log('No projects found. Upload a project first.');
                    }
                }
            } catch (error) {
                console.error('Network error fetching projects:', error.message);
                console.error('Make sure backend is running on http://localhost:5000');
            }
        };
        fetchProjects();
    }, []);
    
    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            const target = event.target;
            const commandButton = document.querySelector('[data-command-button]');
            
            if (commandPaletteRef.current && 
                !commandPaletteRef.current.contains(target) && 
                !commandButton?.contains(target)) {
                setShowCommandPalette(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleKeyDown = (e) => {
        if (showCommandPalette) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActiveSuggestion(prev => 
                    prev < commandSuggestions.length - 1 ? prev + 1 : 0
                );
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActiveSuggestion(prev => 
                    prev > 0 ? prev - 1 : commandSuggestions.length - 1
                );
            } else if (e.key === 'Tab' || e.key === 'Enter') {
                e.preventDefault();
                if (activeSuggestion >= 0) {
                    const selectedCommand = commandSuggestions[activeSuggestion];
                    setValue(selectedCommand.prefix + ' ');
                    setShowCommandPalette(false);
                    
                    setRecentCommand(selectedCommand.label);
                    setTimeout(() => setRecentCommand(null), 3500);
                }
            } else if (e.key === 'Escape') {
                e.preventDefault();
                setShowCommandPalette(false);
            }
        } else if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (value.trim()) {
                handleSendMessage();
            }
        }
    };

    const handleSendMessage = async () => {
        if (!value.trim()) return;
        
        console.log('handleSendMessage - selectedProject:', selectedProject);
        
        if (!selectedProject) {
            const errorMsg = { role: 'assistant', content: '⚠️ Please upload a project first or select one from your projects.' };
            setMessages(prev => [...prev, errorMsg]);
            return;
        }
        
        // Handle both 'id' and '_id' from backend
        const projectId = selectedProject._id || selectedProject.id;
        
        if (!projectId) {
            console.error('selectedProject exists but has no id:', selectedProject);
            const errorMsg = { role: 'assistant', content: '⚠️ Invalid project. Please try selecting a different project from the dropdown.' };
            setMessages(prev => [...prev, errorMsg]);
            return;
        }
        
        const userMessage = { role: 'user', content: value };
        setMessages(prev => [...prev, userMessage]);
        
        const currentValue = value;
        setValue("");
        adjustHeight(true);
        setIsTyping(true);
        
        try {
            const token = localStorage.getItem('token');
            
            console.log('Fetching project details for ID:', projectId);
            
            // Fetch project files from backend
            const projectRes = await fetch(`/api/projects/${projectId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (!projectRes.ok) {
                const errorText = await projectRes.text();
                console.error('Project fetch error:', projectRes.status, errorText);
                throw new Error(`Failed to fetch project details: ${projectRes.status} ${projectRes.statusText}`);
            }
            
            const projectData = await projectRes.json();
            const projectFiles = projectData.project?.files || [];
            
            console.log('Project files to refactor:', projectFiles.length);
            console.log('File names:', projectFiles.map(f => f.filename));
            
            if (projectFiles.length === 0) {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: '⚠️ No files found in this project. Please upload files first.'
                }]);
                setIsTyping(false);
                return;
            }
            
            // Determine action label based on command
            let actionLabel = 'Refactor';
            if (currentValue.includes('/bugs')) actionLabel = 'Bug Analysis';
            else if (currentValue.includes('/optimize')) actionLabel = 'Optimization';
            else if (currentValue.includes('/modernize')) actionLabel = 'Modernization';
            else if (currentValue.includes('/docs')) actionLabel = 'Documentation';
            
            // Send refactor request with files array
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
                    content: `✅ ${actionLabel} completed successfully!\n\n📊 Processed ${data.files?.length || 0} files\n🔄 Version: ${data.version?.versionNumber || 'N/A'}`,
                    files: data.files || [],
                    hasFiles: true
                };
                setMessages(prev => [...prev, aiMessage]);
            } else {
                const errorMsg = {
                    role: 'assistant',
                    content: `❌ Error: ${data.error || 'Refactoring failed'}`
                };
                setMessages(prev => [...prev, errorMsg]);
            }
        } catch (error) {
            console.error('Refactoring error:', error);
            let errorText = error.message;
            if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
                errorText = 'Cannot connect to backend. Make sure the backend server is running on http://localhost:5000';
            }
            const errorMsg = {
                role: 'assistant',
                content: `❌ Network error: ${errorText}\n\n💡 Check the console for details.`
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleAttachFile = () => {
        fileInputRef.current?.click();
    };
    
    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            setUploadedFiles(prev => [...prev, ...files]);
            setAttachments(prev => [...prev, ...files.map(f => f.name)]);
            
            // Auto-show upload form if files are added
            if (!showUploadForm) {
                setShowUploadForm(true);
            }
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
            
            uploadedFiles.forEach(file => {
                formData.append("files", file);
            });
            
            const token = localStorage.getItem('token');
            const res = await fetch("/api/upload", {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData,
            });
            
            const data = await res.json();
            
            if (res.ok) {
                setUploadMessage(" Project uploaded successfully!");
                const newProject = data.project;
                setProjects(prev => [newProject, ...prev]);
                setSelectedProject(newProject);
                setProjectName("");
                setDescription("");
                setUploadedFiles([]);
                setAttachments([]);
                setShowUploadForm(false);
                
                // Add success message to chat
                const successMsg = {
                    role: 'assistant',
                    content: ` Project "${newProject.name}" uploaded successfully! You can now ask me to refactor, optimize, or analyze your code.`
                };
                setMessages(prev => [...prev, successMsg]);
                
                // Show success for 2 seconds
                setTimeout(() => {
                    setUploadMessage("");
                }, 2000);
            } else {
                setUploadMessage("❌ " + (data.error || 'Upload failed'));
            }
        } catch (error) {
            setUploadMessage("❌ Network error: " + error.message);
        }
        
        setUploadLoading(false);
    };

    const removeAttachment = (index) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };
    
    const selectCommandSuggestion = (index) => {
        const selectedCommand = commandSuggestions[index];
        setValue(selectedCommand.prefix + ' ');
        setShowCommandPalette(false);
        
        setRecentCommand(selectedCommand.label);
        setTimeout(() => setRecentCommand(null), 2000);
    };

    return (
        <div className="min-h-screen flex flex-col w-full items-center justify-center bg-transparent text-white p-4 sm:p-6 md:p-8 relative overflow-hidden">
            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[500px] h-[400px] sm:h-[500px] bg-white/[0.03] rounded-full filter blur-[120px] animate-pulse" />
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-48 sm:w-64 h-48 sm:h-64 bg-white/[0.02] rounded-full filter blur-[100px] animate-pulse delay-500" />
                <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-40 sm:w-56 h-40 sm:h-56 bg-white/[0.02] rounded-full filter blur-[80px] animate-pulse delay-1000" />
            </div>
            
            <div className="w-full max-w-2xl mx-auto relative">
                <motion.div 
                    className="relative z-10 space-y-8 sm:space-y-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <div className="text-center space-y-3 px-4">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="inline-block"
                        >
                            <div className="flex items-center justify-center gap-3 mb-3">
                                <div className="p-2 sm:p-3 bg-white/10 border border-white/20 rounded-xl">
                                    <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                </div>
                            </div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-white pb-1">
                                Transform Your Legacy Code
                            </h1>
                            <motion.div 
                                className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                initial={{ width: 0, opacity: 0 }}
                                animate={{ width: "100%", opacity: 1 }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                            />
                        </motion.div>
                        <motion.p 
                            className="text-xs sm:text-sm text-white/50"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            Upload your code, ask AI to refactor, optimize, or modernize
                        </motion.p>
                        
                        {/* Quick Upload Button */}
                        {!showUploadForm && (
                            <motion.button
                                onClick={() => setShowUploadForm(true)}
                                className="mt-4 px-6 py-2.5 bg-white text-black hover:bg-gray-200 rounded-lg font-medium transition-all duration-300 hover:scale-105 inline-flex items-center gap-2 text-sm"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Sparkles className="w-4 h-4" />
                                Upload Project
                            </motion.button>
                        )}
                    </div>

                    {/* Upload Form */}
                    <AnimatePresence>
                        {showUploadForm && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="backdrop-blur-2xl bg-white/[0.02] rounded-xl sm:rounded-2xl border border-white/10 shadow-2xl mx-4 sm:mx-0 p-4 sm:p-6"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                        <Sparkles className="w-5 h-5 text-white/70" />
                                        Upload Project
                                    </h3>
                                    <button
                                        onClick={() => setShowUploadForm(false)}
                                        className="text-white/40 hover:text-white transition-colors"
                                    >
                                        <XIcon className="w-5 h-5" />
                                    </button>
                                </div>
                                
                                <div className="space-y-4">
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Project Name *"
                                            value={projectName}
                                            onChange={(e) => setProjectName(e.target.value)}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors"
                                        />
                                    </div>
                                    
                                    <div>
                                        <textarea
                                            placeholder="Description (optional)"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            rows={2}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors resize-none"
                                        />
                                    </div>
                                    
                                    {uploadedFiles.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {uploadedFiles.map((file, index) => (
                                                <div key={index} className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-xs text-white/70">
                                                    <FileCode className="w-3 h-3 text-white/60" />
                                                    <span className="truncate max-w-[150px]">{file.name}</span>
                                                    <button
                                                        onClick={() => {
                                                            setUploadedFiles(prev => prev.filter((_, i) => i !== index));
                                                            setAttachments(prev => prev.filter((_, i) => i !== index));
                                                        }}
                                                        className="text-white/40 hover:text-white transition-colors"
                                                    >
                                                        <XIcon className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    
                                    {uploadMessage && (
                                        <div className={cn(
                                            "px-4 py-2 rounded-lg text-sm",
                                            uploadMessage.includes('\u2705') ? "bg-green-500/10 border border-green-500/20 text-green-400" : "bg-red-500/10 border border-red-500/20 text-red-400"
                                        )}>
                                            {uploadMessage}
                                        </div>
                                    )}
                                    
                                    <button
                                        onClick={handleUploadProject}
                                        disabled={uploadLoading || !projectName || uploadedFiles.length === 0}
                                        className={cn(
                                            "w-full px-4 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2",
                                            uploadLoading || !projectName || uploadedFiles.length === 0
                                                ? "bg-white/5 text-white/40 cursor-not-allowed"
                                                : "bg-white text-black hover:bg-gray-200 shadow-lg"
                                        )}
                                    >
                                        {uploadLoading ? (
                                            <>
                                                <LoaderIcon className="w-5 h-5 animate-spin" />
                                                Uploading...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="w-5 h-5" />
                                                Upload & Start AI Analysis
                                            </>
                                        )}
                                    </button>
                                </div>
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
                    
                    {/* Project Selector */}
                    {projects.length > 0 && (
                        <motion.div
                            className="backdrop-blur-2xl bg-white/[0.02] rounded-xl border border-white/[0.05] shadow-lg mx-4 sm:mx-0 p-3 mb-4"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <label className="text-xs text-white/50 mb-2 block">Active Project</label>
                            <select
                                value={selectedProject?._id || selectedProject?.id || ''}
                                onChange={(e) => {
                                    const project = projects.find(p => (p._id || p.id) === e.target.value);
                                    setSelectedProject(project);
                                }}
                                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-white/30 transition-colors"
                            >
                                {projects.map(project => {
                                    const projectId = project._id || project.id;
                                    return (
                                        <option key={projectId} value={projectId} className="bg-gray-900">
                                            {project.name} ({project.files?.length || 0} files)
                                        </option>
                                    );
                                })}
                            </select>
                        </motion.div>
                    )}
                    
                    {/* Messages Display */}
                    {messages.length > 0 && (
                        <motion.div
                            className="backdrop-blur-2xl bg-white/[0.02] rounded-xl border border-white/[0.05] shadow-lg mx-4 sm:mx-0 mb-4 max-h-96 overflow-y-auto"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="p-4 space-y-3">
                                {messages.map((msg, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={cn(
                                            "flex flex-col",
                                            msg.role === 'user' ? "items-end" : "items-start"
                                        )}
                                    >
                                        <div className={cn(
                                            "max-w-[80%] px-4 py-2 rounded-lg text-sm whitespace-pre-wrap",
                                            msg.role === 'user'
                                                ? "bg-white/10 text-white border border-white/20"
                                                : "bg-white/5 text-white/90 border border-white/10"
                                        )}>
                                            {msg.content}
                                        </div>
                                        
                                        {/* Show refactored files if available */}
                                        {msg.hasFiles && msg.files && msg.files.length > 0 && (
                                            <motion.div 
                                                className="w-full mt-3 space-y-2"
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                            >
                                                {msg.files.map((file, fileIndex) => (
                                                    <FileViewer key={fileIndex} file={file} />
                                                ))}
                                            </motion.div>
                                        )}
                                    </motion.div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                        </motion.div>
                    )}

                    <motion.div 
                        className="relative backdrop-blur-2xl bg-white/[0.02] rounded-xl sm:rounded-2xl border border-white/[0.05] shadow-2xl mx-4 sm:mx-0"
                        initial={{ scale: 0.98 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                        <AnimatePresence>
                            {showCommandPalette && (
                                <motion.div 
                                    ref={commandPaletteRef}
                                    className="absolute left-2 right-2 sm:left-4 sm:right-4 bottom-full mb-2 backdrop-blur-xl bg-black/90 rounded-lg z-50 shadow-lg border border-white/10 overflow-hidden max-h-[60vh] overflow-y-auto"
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 5 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    <div className="py-1 bg-black/95">
                                        {commandSuggestions.map((suggestion, index) => {
                                            const iconColors = [
                                                'text-blue-400',    // Refactor
                                                'text-red-400',     // Find Bugs
                                                'text-yellow-400',  // Optimize
                                                'text-green-400',   // Create PR
                                                'text-purple-400',  // Modernize
                                                'text-cyan-400'     // Document
                                            ];
                                            
                                            return (
                                                <motion.div
                                                    key={suggestion.prefix}
                                                    className={cn(
                                                        "flex items-center gap-2 px-3 py-2.5 text-xs transition-colors cursor-pointer",
                                                        activeSuggestion === index 
                                                            ? "bg-white/10 text-white border-l-2 border-white" 
                                                            : "text-white/70 hover:bg-white/5"
                                                    )}
                                                    onClick={() => selectCommandSuggestion(index)}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: index * 0.03 }}
                                                >
                                                    <div className={`w-5 h-5 flex items-center justify-center ${iconColors[index]}`}>
                                                        {suggestion.icon}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-medium">{suggestion.label}</div>
                                                        <div className="text-white/40 text-[10px] truncate">{suggestion.description}</div>
                                                    </div>
                                                    <div className="text-white/30 text-xs font-mono bg-white/5 px-2 py-0.5 rounded">
                                                        {suggestion.prefix}
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="p-3 sm:p-4">
                            <textarea
                                ref={textareaRef}
                                value={value}
                                onChange={(e) => {
                                    setValue(e.target.value);
                                    adjustHeight();
                                }}
                                onKeyDown={handleKeyDown}
                                onFocus={() => setInputFocused(true)}
                                onBlur={() => setInputFocused(false)}
                                placeholder="Describe your code refactoring needs... "
                                className={cn(
                                    "w-full px-3 sm:px-4 py-2 sm:py-3",
                                    "resize-none",
                                    "bg-transparent",
                                    "border-none",
                                    "text-white/90 text-sm",
                                    "focus:outline-none",
                                    "placeholder:text-white/30",
                                    "min-h-[60px]"
                                )}
                                style={{ overflow: "hidden" }}
                            />
                        </div>

                        <AnimatePresence>
                            {attachments.length > 0 && (
                                <motion.div 
                                    className="px-3 sm:px-4 pb-3 flex gap-2 flex-wrap"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                >
                                    {attachments.map((file, index) => (
                                        <motion.div
                                            key={index}
                                            className="flex items-center gap-2 text-xs bg-white/5 py-1.5 px-3 rounded-lg text-white/70 border border-white/10"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                        >
                                            <FileCode className="w-3 h-3 text-white/60" />
                                            <span className="truncate max-w-[150px]">{file}</span>
                                            <button 
                                                onClick={() => removeAttachment(index)}
                                                className="text-white/40 hover:text-white transition-colors"
                                            >
                                                <XIcon className="w-3 h-3" />
                                            </button>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="p-3 sm:p-4 border-t border-white/[0.05] flex items-center justify-between gap-2 sm:gap-4">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <motion.button
                                    type="button"
                                    onClick={handleAttachFile}
                                    whileTap={{ scale: 0.94 }}
                                    className="p-2 text-white/40 hover:text-white/90 rounded-lg transition-colors relative group"
                                >
                                    <Paperclip className="w-4 h-4" />
                                    <motion.span
                                        className="absolute inset-0 bg-white/[0.05] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                        layoutId="button-highlight"
                                    />
                                </motion.button>
                                <motion.button
                                    type="button"
                                    data-command-button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowCommandPalette(prev => !prev);
                                    }}
                                    whileTap={{ scale: 0.94 }}
                                    className={cn(
                                        "p-2 text-white/40 hover:text-white/90 rounded-lg transition-colors relative group",
                                        showCommandPalette && "bg-white/10 text-white/90"
                                    )}
                                >
                                    <Command className="w-4 h-4" />
                                    <motion.span
                                        className="absolute inset-0 bg-white/[0.05] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                        layoutId="button-highlight"
                                    />
                                </motion.button>
                            </div>
                            
                            <motion.button
                                type="button"
                                onClick={handleSendMessage}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={isTyping || !value.trim()}
                                className={cn(
                                    "px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all",
                                    "flex items-center gap-2",
                                    value.trim()
                                        ? "bg-white text-black shadow-lg"
                                        : "bg-white/[0.05] text-white/40"
                                )}
                            >
                                {isTyping ? (
                                    <LoaderIcon className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Sparkles className="w-4 h-4" />
                                )}
                                <span className="hidden sm:inline">Analyze</span>
                            </motion.button>
                        </div>
                    </motion.div>

                    <div className="flex flex-wrap items-center justify-center gap-2 px-4">
                        {commandSuggestions.slice(0, 4).map((suggestion, index) => {
                            return (
                                <motion.button
                                    key={suggestion.prefix}
                                    onClick={() => selectCommandSuggestion(index)}
                                    className="flex items-center gap-2 px-3 py-2 bg-white/[0.02] hover:bg-white/10 rounded-lg text-xs sm:text-sm text-white/60 hover:text-white/90 transition-all relative group border border-white/5 hover:border-white/20"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div className="text-white/70">
                                        {suggestion.icon}
                                    </div>
                                    <span className="hidden sm:inline">{suggestion.label}</span>
                                    <span className="sm:hidden">{suggestion.label.split(' ')[0]}</span>
                                </motion.button>
                            );
                        })}
                    </div>
                </motion.div>
            </div>

            <AnimatePresence>
                {isTyping && (
                    <motion.div 
                        className="fixed bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 backdrop-blur-2xl bg-black/60 rounded-full px-4 py-2 shadow-lg border border-white/10"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-7 h-7 sm:w-8 sm:h-7 rounded-full bg-white/10 flex items-center justify-center">
                                <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                            </div>
                            <div className="flex items-center gap-2 text-xs sm:text-sm text-white/90">
                                <span className="font-medium">AI Analyzing</span>
                                <TypingDots />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {inputFocused && (
                <motion.div 
                    className="fixed w-[30rem] h-[30rem] sm:w-[50rem] sm:h-[50rem] rounded-full pointer-events-none z-0 opacity-[0.02] bg-white blur-[96px]"
                    animate={{
                        x: mousePosition.x - 400,
                        y: mousePosition.y - 400,
                    }}
                    transition={{
                        type: "spring",
                        damping: 25,
                        stiffness: 150,
                        mass: 0.5,
                    }}
                />
            )}
        </div>
    );
}

function FileViewer({ file }) {
    const [isExpanded, setIsExpanded] = useState(false);
    
    return (
        <div className="bg-black/40 border border-white/10 rounded-lg overflow-hidden">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <FileCode className="w-4 h-4 text-white/70" />
                    <span className="text-sm text-white font-medium">{file.filename}</span>
                    <span className="text-xs text-white/40">
                        {file.language || 'text'}
                    </span>
                </div>
                <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <svg className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </motion.div>
            </button>
            
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="border-t border-white/10">
                            <pre className="p-4 text-xs text-white/80 overflow-x-auto bg-black/20 max-h-96 overflow-y-auto">
                                <code>{file.refactoredCode || file.content}</code>
                            </pre>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function TypingDots() {
    return (
        <div className="flex items-center ml-1">
            {[1, 2, 3].map((dot) => (
                <motion.div
                    key={dot}
                    className="w-1.5 h-1.5 bg-white/70 rounded-full mx-0.5"
                    initial={{ opacity: 0.3 }}
                    animate={{ 
                        opacity: [0.3, 0.9, 0.3],
                        scale: [0.85, 1.1, 0.85]
                    }}
                    transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        delay: dot * 0.15,
                        ease: "easeInOut",
                    }}
                    style={{
                        boxShadow: "0 0 4px rgba(255, 255, 255, 0.3)"
                    }}
                />
            ))}
        </div>
    );
}
