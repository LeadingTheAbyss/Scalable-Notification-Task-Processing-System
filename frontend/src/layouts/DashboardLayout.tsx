import { Outlet, Link, useLocation } from "react-router-dom"
import { LayoutDashboard, CheckSquare, Bell, Settings, LogOut, Cpu } from "lucide-react"
import { motion } from "framer-motion"

export const DashboardLayout = () => {
  const location = useLocation()
  const path = location.pathname

  const navItems = [
    { icon: LayoutDashboard, label: "Overview", path: "/dashboard" },
    { icon: CheckSquare, label: "Tasks", path: "/dashboard/tasks" },
    { icon: Bell, label: "Notifications", path: "/dashboard/notifications" },
    { icon: Settings, label: "Settings", path: "/dashboard/settings" },
  ]

  return (
    <div className = "min-h-screen bg-background flex">
      <aside className = "w-72 glass-panel border-y-0 border-l-0 rounded-none flex flex-col z-20">
        <div className = "h-24 flex items-center px-8 border-b border-border">
          <Cpu className = "w-6 h-6 text-brand-500 mr-3" />
          <span className = "text-xl font-bold tracking-tight">Task<span className = "text-brand-500">Flow</span></span>
        </div>
        
        <div className = "p-6 flex-1 flex flex-col gap-2">
          <div className = "text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Cluster Control</div>
          {navItems.map((item) => {
            const isActive = path === item.path
            return (
              <Link 
                key = {item.path} 
                to = {item.path}
                className = {`flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative ${isActive ? "text-white" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
              >
                {isActive && (
                  <motion.div 
                    layoutId = "activeNav" 
                    className = "absolute inset-0 bg-brand-500/10 border border-brand-500/20 rounded-xl"
                  />
                )}
                <item.icon className = {`w-5 h-5 relative z-10 ${isActive ? "text-brand-400" : ""}`} />
                <span className = "font-medium relative z-10">{item.label}</span>
              </Link>
            )
          })}
        </div>

        <div className = "p-6 border-t border-border">
          <button className = "flex items-center gap-3 text-gray-400 hover:text-white transition-colors w-full px-4 py-2">
            <LogOut className = "w-5 h-5" />
            <span className = "font-medium">Disconnect</span>
          </button>
        </div>
      </aside>

      <main className = "flex-1 relative h-screen overflow-y-auto">
        <header className = "h-24 glass-panel border-x-0 border-t-0 rounded-none flex items-center justify-between px-10 sticky top-0 z-10 bg-background/80">
          <h2 className = "text-2xl font-bold text-white capitalize">
            {path.split("/").pop() || "Overview"}
          </h2>
          <div className = "flex items-center gap-4">
            <div className = "px-4 py-1.5 rounded-full glass-panel flex items-center gap-2 border-green-500/30">
              <div className = "w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className = "text-xs font-bold text-green-400 uppercase tracking-wider">Nodes Active</span>
            </div>
            <div className = "w-10 h-10 rounded-full bg-gradient-to-tr from-brand-600 to-purple-600 border-2 border-background" />
          </div>
        </header>
        <div className = "p-10">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
