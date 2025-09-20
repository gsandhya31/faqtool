import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useApp } from "@/context/AppContext";
import { 
  Home, 
  FileText, 
  Upload, 
  Rocket, 
  BarChart3, 
  Settings,
  Clock,
  Users
} from "lucide-react";

const navigationItems = [
  { path: "/", label: "Dashboard", icon: Home, roles: ['admin', 'user'] },
  { path: "/faqs", label: "FAQ List", icon: FileText, roles: ['admin', 'user'] },
  { path: "/bulk-upload", label: "Bulk Upload", icon: Upload, roles: ['admin', 'user'] },
  { path: "/publish-queue", label: "Publish Queue", icon: Rocket, roles: ['admin', 'user'] },
  { path: "/analytics", label: "Analytics", icon: BarChart3, roles: ['admin', 'user'] },
  { path: "/versions", label: "Versions & Audit", icon: Clock, roles: ['admin', 'user'] },
  { path: "/admin", label: "Admin Console", icon: Users, roles: ['admin'] },
];

export const Sidebar = () => {
  const { currentRole } = useApp();

  const filteredItems = navigationItems.filter(item => 
    item.roles.includes(currentRole)
  );

  return (
    <div className="w-64 bg-card border-r border-border h-full">
      <nav className="p-4 space-y-2">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )
              }
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};