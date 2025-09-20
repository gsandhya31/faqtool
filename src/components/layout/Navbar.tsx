import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/context/AppContext";
import { UserRole } from "@/types";
import { Settings, User, Shield } from "lucide-react";

export const Navbar = () => {
  const { currentUser, currentRole, setCurrentRole } = useApp();

  const toggleRole = () => {
    setCurrentRole(currentRole === 'admin' ? 'user' : 'admin');
  };

  return (
    <nav className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">FAQ</span>
          </div>
          <h1 className="text-xl font-semibold text-foreground">Channel FAQ Tool</h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="text-sm font-medium text-foreground">{currentUser.name}</div>
          <div className="text-xs text-muted-foreground">{currentUser.email}</div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={toggleRole}
          className="flex items-center gap-2"
        >
          {currentRole === 'admin' ? <Shield className="w-4 h-4" /> : <User className="w-4 h-4" />}
          <span className="text-xs">Switch to {currentRole === 'admin' ? 'User' : 'Admin'}</span>
        </Button>

        <Badge variant={currentRole === 'admin' ? 'destructive' : 'secondary'}>
          {currentRole.toUpperCase()}
        </Badge>
      </div>
    </nav>
  );
};