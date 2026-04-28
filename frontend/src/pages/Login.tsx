import { motion } from "framer-motion"
import { Cpu, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

export const Login = () => {
  return (
    <div className = "min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      <div className = "absolute top-1/4 left-1/4 w-96 h-96 bg-brand-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      <div className = "absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      
      <motion.div 
        initial = {{ opacity: 0, scale: 0.95 }}
        animate = {{ opacity: 1, scale: 1 }}
        className = "glass-panel p-10 rounded-3xl w-full max-w-md relative z-10"
      >
        <div className = "flex items-center justify-center gap-2 mb-10">
          <Cpu className = "w-8 h-8 text-brand-500" />
          <span className = "text-2xl font-bold tracking-tight">Task<span className = "text-brand-500">Flow</span></span>
        </div>

        <div className = "space-y-5">
          <div>
            <label className = "block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Access Token</label>
            <input 
              type = "email" 
              placeholder = "admin@cluster.local" 
              className = "w-full bg-surface border border-border rounded-xl p-4 text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
            />
          </div>
          <div>
            <div className = "flex justify-between mb-2">
              <label className = "block text-xs font-bold text-gray-400 uppercase tracking-wider">Passkey</label>
              <span className = "text-xs text-brand-400 hover:text-brand-300 cursor-pointer font-medium">Recover</span>
            </div>
            <input 
              type = "password" 
              placeholder = "????????" 
              className = "w-full bg-surface border border-border rounded-xl p-4 text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
            />
          </div>
          
          <Link to = "/dashboard" className = "w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 mt-8 transition-all active:scale-95">
            Authenticate <ArrowRight className = "w-4 h-4" />
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
