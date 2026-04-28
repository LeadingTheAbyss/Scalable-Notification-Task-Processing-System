import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Activity, CheckCircle2, AlertCircle, Clock } from "lucide-react"

export const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, successRate: 100, pending: 0, failed: 0 })
  const [chartData, setChartData] = useState([])

  const loadData = async () => {
    try {
      const res = await fetch("/tasks")
      if (res.ok) {
        const tasks = await res.json()
        const total = tasks.length
        const completed = tasks.filter(t => t.status === "completed").length
        const failed = tasks.filter(t => t.status === "failed").length
        const pending = tasks.filter(t => t.status === "pending" || t.status === "processing").length

        let rate = 100
        if (completed + failed > 0) {
          rate = Math.round((completed / (completed + failed)) * 100)
        }

        setStats({ total: total, successRate: rate, pending: pending, failed: failed })

        const grouped = { "00:00": 0, "04:00": 0, "08:00": 0, "12:00": 0, "16:00": 0, "20:00": 0, "24:00": 0 }
        
        tasks.forEach(t => {
          const hour = new Date(t.created_at).getHours()
          if (hour < 4) grouped["00:00"] = grouped["00:00"] + 1
          else if (hour < 8) grouped["04:00"] = grouped["04:00"] + 1
          else if (hour < 12) grouped["08:00"] = grouped["08:00"] + 1
          else if (hour < 16) grouped["12:00"] = grouped["12:00"] + 1
          else if (hour < 20) grouped["16:00"] = grouped["16:00"] + 1
          else if (hour < 24) grouped["20:00"] = grouped["20:00"] + 1
        })

        const cData = Object.keys(grouped).map(k => ({ time: k, tasks: grouped[k] }))
        setChartData(cData)
      }
    } catch (e) {
    }
  }

  useEffect(() => {
    loadData()
    const interval = setInterval(loadData, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div 
      initial = {{ opacity: 0, y: 20 }}
      animate = {{ opacity: 1, y: 0 }}
      className = "max-w-7xl mx-auto space-y-8"
    >
      <div className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Processed", value: stats.total, icon: Activity, color: "text-brand-400", bg: "bg-brand-400/10" },
          { label: "Success Rate", value: `${stats.successRate}%`, icon: CheckCircle2, color: "text-green-400", bg: "bg-green-400/10" },
          { label: "In Queue", value: stats.pending, icon: Clock, color: "text-yellow-400", bg: "bg-yellow-400/10" },
          { label: "Dead Letters", value: stats.failed, icon: AlertCircle, color: "text-red-400", bg: "bg-red-400/10" },
        ].map((stat, i) => (
          <div key = {i} className = "glass-panel p-6 rounded-3xl">
            <div className = "flex justify-between items-start mb-4">
              <div className = {`p-3 rounded-2xl ${stat.bg}`}>
                <stat.icon className = {`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            <h3 className = "text-3xl font-bold text-white mb-1">{stat.value}</h3>
            <p className = "text-sm text-gray-400 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className = "grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className = "lg:col-span-2 glass-panel p-8 rounded-3xl">
          <div className = "flex justify-between items-center mb-8">
            <h3 className = "text-xl font-bold text-white">Throughput Analytics</h3>
            <select className = "bg-surface border border-border text-sm rounded-lg px-3 py-1.5 outline-none focus:border-brand-500">
              <option>Today</option>
            </select>
          </div>
          <div className = "h-72 w-full">
            <ResponsiveContainer width = "100%" height = "100%">
              <AreaChart data = {chartData}>
                <defs>
                  <linearGradient id = "colorTasks" x1 = "0" y1 = "0" x2 = "0" y2 = "1">
                    <stop offset = "5%" stopColor = "#3b82f6" stopOpacity = {0.3}/>
                    <stop offset = "95%" stopColor = "#3b82f6" stopOpacity = {0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey = "time" stroke = "#4b5563" fontSize = {12} tickLine = {false} axisLine = {false} />
                <YAxis stroke = "#4b5563" fontSize = {12} tickLine = {false} axisLine = {false} />
                <Tooltip 
                  contentStyle = {{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle = {{ color: '#fff' }}
                />
                <Area type = "monotone" dataKey = "tasks" stroke = "#3b82f6" strokeWidth = {3} fillOpacity = {1} fill = "url(#colorTasks)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className = "glass-panel p-8 rounded-3xl flex flex-col">
          <h3 className = "text-xl font-bold text-white mb-6">Active Workers (Simulated)</h3>
          <div className = "flex-1 space-y-4">
            {[
              { id: "wk-eu-1", status: "idle", load: "12%" },
              { id: "wk-us-east", status: "processing", load: "89%" },
              { id: "wk-ap-south", status: "processing", load: "64%" },
            ].map((worker) => (
              <div key = {worker.id} className = "p-4 rounded-2xl bg-white/5 border border-border flex items-center justify-between">
                <div>
                  <p className = "font-bold text-sm text-white mb-1">{worker.id}</p>
                  <p className = "text-xs text-gray-400 capitalize">{worker.status}</p>
                </div>
                <div className = "text-right">
                  <p className = "font-mono text-sm text-brand-400">{worker.load}</p>
                  <p className = "text-xs text-gray-500">CPU Load</p>
                </div>
              </div>
            ))}
          </div>
          <button className = "mt-6 w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-border text-sm font-bold transition-colors">
            Provision Node
          </button>
        </div>
      </div>
    </motion.div>
  )
}
