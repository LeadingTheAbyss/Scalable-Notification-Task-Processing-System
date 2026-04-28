import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Terminal, Zap, ShieldAlert, Plus } from "lucide-react"

export const Tasks = () => {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  const loadTasks = async () => {
    try {
      const res = await fetch("/tasks")
      if (res.ok) {
        const data = await res.json()
        setTasks(data.reverse())
      }
    } catch (e) {
    }
  }

  useEffect(() => {
    loadTasks()
    const interval = setInterval(loadTasks, 2000)
    return () => clearInterval(interval)
  }, [])

  const createTask = async () => {
    if (!title) return
    const res = await fetch("/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description })
    })
    
    if (res.status === 429) {
      alert("Rate limit exceeded. System throttling active.")
      return
    }
    
    setTitle("")
    setDescription("")
    loadTasks()
  }

  const getStatusBadge = (status) => {
    const styles = {
      completed: "text-green-400 bg-green-400/10 border-green-400/20",
      failed: "text-red-400 bg-red-400/10 border-red-400/20",
      processing: "text-brand-400 bg-brand-400/10 border-brand-400/20 animate-pulse",
      pending: "text-slate-400 bg-slate-400/10 border-slate-400/20"
    }
    const currentStyle = styles[status] || styles.pending
    return (
      <span className = {`px-3 py-1 rounded-md border text-[10px] font-black tracking-widest uppercase ${currentStyle}`}>
        {status}
      </span>
    )
  }

  return (
    <motion.div initial = {{ opacity: 0, y: 20 }} animate = {{ opacity: 1, y: 0 }} className = "space-y-8 max-w-7xl mx-auto">
      <div className = "grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className = "lg:col-span-4">
          <div className = "glass-panel p-8 rounded-3xl sticky top-32">
            <div className = "flex items-center gap-3 mb-6">
              <div className = "p-2 rounded-xl bg-brand-500/20 text-brand-400">
                <Zap className = "w-5 h-5" />
              </div>
              <h2 className = "text-xl font-bold text-white">Deploy Task</h2>
            </div>
            
            <div className = "space-y-5">
              <div>
                <label className = "text-xs font-bold text-gray-500 mb-2 block uppercase tracking-wider">Payload Title</label>
                <input 
                  value = {title}
                  onChange = {(e) => setTitle(e.target.value)}
                  type = "text" 
                  className = "w-full bg-surface border border-border rounded-xl p-4 text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                  placeholder = "e.g., Process Image Data"
                />
              </div>
              <div>
                <label className = "text-xs font-bold text-gray-500 mb-2 block uppercase tracking-wider">Parameters</label>
                <textarea 
                  value = {description}
                  onChange = {(e) => setDescription(e.target.value)}
                  className = "w-full bg-surface border border-border rounded-xl p-4 text-white h-32 focus:ring-2 focus:ring-brand-500 outline-none transition-all resize-none"
                  placeholder = "{...}"
                />
              </div>
              <button onClick = {createTask} className = "w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all active:scale-95 flex items-center justify-center gap-2">
                <Plus className = "w-5 h-5" /> Execute
              </button>
            </div>
          </div>
        </div>

        <div className = "lg:col-span-8">
          <div className = "glass-panel rounded-3xl overflow-hidden flex flex-col min-h-[600px]">
            <div className = "p-8 border-b border-border flex justify-between items-center bg-white/[0.02]">
              <div className = "flex items-center gap-3">
                <Terminal className = "w-5 h-5 text-gray-400" />
                <h2 className = "text-xl font-bold text-white">Execution Stream</h2>
              </div>
              <div className = "text-xs font-mono text-gray-500 bg-background px-3 py-1 rounded-md border border-border">
                Polling interval: 2000ms
              </div>
            </div>
            
            <div className = "flex-1 p-8 space-y-3 overflow-y-auto">
              {tasks.length === 0 ? (
                <div className = "h-full flex flex-col items-center justify-center text-gray-500">
                  <ShieldAlert className = "w-12 h-12 mb-4 opacity-50" />
                  <p className = "font-medium">No tasks in current queue</p>
                </div>
              ) : (
                tasks.map((t, idx) => (
                  <motion.div 
                    initial = {{ opacity: 0, x: -20 }}
                    animate = {{ opacity: 1, x: 0 }}
                    transition = {{ delay: idx * 0.05 }}
                    key = {t.id} 
                    className = "flex justify-between items-center p-5 bg-white/[0.02] rounded-2xl border border-border hover:border-brand-500/30 hover:bg-white/[0.04] transition-all group"
                  >
                    <div>
                      <div className = "flex items-center gap-3 mb-1">
                        <span className = "text-xs font-mono text-brand-400">#{t.id}</span>
                        <h3 className = "font-bold text-slate-200">{t.title}</h3>
                      </div>
                      <p className = "text-sm text-slate-500 truncate max-w-md">{t.description || "No parameters provided"}</p>
                    </div>
                    <div>
                      {getStatusBadge(t.status)}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  )
}
