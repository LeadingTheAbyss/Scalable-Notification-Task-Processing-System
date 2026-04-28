import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Landing } from "./pages/Landing"
import { DashboardLayout } from "./layouts/DashboardLayout"
import { Dashboard } from "./pages/Dashboard"
import { Tasks } from "./pages/Tasks"
import { Login } from "./pages/Login"

export const App = () => {
  return (
    <Router>
      <Routes>
        <Route path = "/" element = {<Landing />} />
        <Route path = "/login" element = {<Login />} />
        <Route path = "/dashboard" element = {<DashboardLayout />}>
          <Route index element = {<Dashboard />} />
          <Route path = "tasks" element = {<Tasks />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
