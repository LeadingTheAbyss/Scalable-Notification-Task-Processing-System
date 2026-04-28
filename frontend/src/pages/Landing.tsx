import { motion } from "framer-motion"
import { ArrowRight, Activity, Zap, Shield, Cpu } from "lucide-react"
import { Link } from "react-router-dom"

export const Landing = () => {
  return (
    <div className = "min-h-screen relative overflow-hidden">
      <div className = "absolute top-0 -left-4 w-72 h-72 bg-brand-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      <div className = "absolute top-0 -right-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      <div className = "absolute -bottom-8 left-20 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />

      <nav className = "fixed top-0 w-full z-50 glass-panel border-b-0 rounded-none bg-background/50">
        <div className = "max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className = "flex items-center gap-2">
            <Cpu className = "w-8 h-8 text-brand-500" />
            <span className = "text-xl font-bold tracking-tight text-white">Task<span className = "text-brand-500">Flow</span></span>
          </div>
          <div className = "flex gap-6 items-center">
            <Link to = "/login" className = "text-sm font-medium text-gray-300 hover:text-white transition-colors">Sign In</Link>
            <Link to = "/login" className = "px-5 py-2.5 rounded-full bg-white text-black text-sm font-bold hover:scale-105 transition-transform duration-300">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className = "pt-40 px-6 max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial = {{ opacity: 0, y: 30 }}
          animate = {{ opacity: 1, y: 0 }}
          transition = {{ duration: 0.8, ease: "easeOut" }}
          className = "text-center max-w-4xl mx-auto"
        >
          <div className = "inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-8 border-brand-500/30">
            <span className = "w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
            <span className = "text-xs font-semibold text-brand-400 tracking-wider uppercase">System v2.0 Live</span>
          </div>
          <h1 className = "text-6xl md:text-8xl font-extrabold tracking-tighter mb-8 leading-tight">
            Process Tasks at <br />
            <span className = "text-gradient">Hyperscale.</span>
          </h1>
          <p className = "text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            The enterprise-grade distributed processing engine. Handle millions of background jobs, webhooks, and notifications with zero friction.
          </p>
          <div className = "flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to = "/dashboard" className = "w-full sm:w-auto px-8 py-4 rounded-full bg-brand-600 hover:bg-brand-500 text-white font-bold flex items-center justify-center gap-2 shadow-[0_0_40px_rgba(37,99,235,0.4)] transition-all hover:scale-105">
              Deploy Infrastructure <ArrowRight className = "w-4 h-4" />
            </Link>
            <button className = "w-full sm:w-auto px-8 py-4 rounded-full glass-panel font-bold hover:bg-white/5 transition-all">
              View Architecture
            </button>
          </div>
        </motion.div>

        <motion.div 
          initial = {{ opacity: 0, y: 40 }}
          animate = {{ opacity: 1, y: 0 }}
          transition = {{ duration: 1, delay: 0.2 }}
          className = "mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 pb-32"
        >
          {[
            { icon: Activity, title: "Real-time Telemetry", desc: "Sub-millisecond tracking across your entire distributed cluster." },
            { icon: Zap, title: "Zero-Latency Queue", desc: "Memory-first architecture ensures instant task dispatch and execution." },
            { icon: Shield, title: "Fault Tolerant", desc: "Automated dead-letter queues and intelligent retry mechanisms." }
          ].map((feature, i) => (
            <div key = {i} className = "glass-panel p-8 rounded-3xl hover:border-brand-500/50 transition-colors group">
              <div className = "w-14 h-14 rounded-2xl bg-brand-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className = "w-7 h-7 text-brand-400" />
              </div>
              <h3 className = "text-xl font-bold mb-3 text-white">{feature.title}</h3>
              <p className = "text-gray-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </main>
    </div>
  )
}
