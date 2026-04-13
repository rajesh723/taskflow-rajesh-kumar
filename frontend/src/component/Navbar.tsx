import { Button } from "@/components/ui/button";
import logo from "@/assets/images.png";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();


  const userNam = localStorage.getItem("user")
  const username = userNam ? JSON.parse(userNam).username : null;
;


  console.log("fsdf",username)

  const handleLogout = () => {
    // 1. Remove tokens
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    navigate("/login");
  };



  return (
    <div className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">

        {/* Logo */}
        <h1 
          className="flex items-center gap-2 text-xl font-semibold tracking-tight cursor-pointer hover:opacity-80"
          onClick={() => navigate("/")}
        >
          <img 
            src={logo} 
            alt="TaskFlow Logo" 
            className="h-8 w-8 object-contain"
          />
          TaskFlow
        </h1>

        {/* Right side */}
        <div className="flex items-center gap-4">

          {/* User */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {username || "Guest"}
            </span>
          </div>

          {/* Logout */}
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>

      </div>
    </div>
  );
};

export default Navbar;