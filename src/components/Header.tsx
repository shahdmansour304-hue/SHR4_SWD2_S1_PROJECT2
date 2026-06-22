import { Link, NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { useFavorites } from "@/hooks/useFavorites";
import { useAccount } from "@/hooks/useAccount";
import { useTheme } from "@/hooks/useTheme";
import logo from "@/assets/logo.png";

const navItems = [
  { label: "Shop", to: "/shop" },
  { label: "Smartphones", to: "/shop?category=smartphones" },
  { label: "Laptops", to: "/shop?category=laptops" },
  { label: "Beauty", to: "/shop?category=beauty" },
];

const Header = () => {
  const { pathname } = useLocation();
  const { count } = useCart();
  const { count: favCount } = useFavorites();
  const { isSignedIn, account } = useAccount();
  const { theme, toggle: toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-primary">
          <img src={logo} alt="LuxeTech logo" width={32} height={32} className="h-8 w-8 object-contain" />
          <span>LuxeTech</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "text-sm font-medium text-muted-foreground transition-colors hover:text-primary",
                  isActive && pathname === item.to && "text-primary"
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <button
            onClick={toggleTheme}
            className="grid h-10 w-10 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
            aria-label="Toggle theme"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            <span className="material-icon text-[22px]">
              {theme === "dark" ? "light_mode" : "dark_mode"}
            </span>
          </button>
          <Link
            to="/favorites"
            className="relative grid h-10 w-10 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
            aria-label="Favorites"
          >
            <span className="material-icon text-[22px]">favorite</span>
            {favCount > 0 && (
              <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                {favCount}
              </span>
            )}
          </Link>
          <Link
            to="/cart"
            className="relative grid h-10 w-10 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
            aria-label="Cart"
          >
            <span className="material-icon text-[22px]">shopping_cart</span>
            {count > 0 && (
              <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                {count}
              </span>
            )}
          </Link>
          <Link
            to="/account"
            className="relative grid h-10 w-10 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
            aria-label="Account"
            title={isSignedIn ? account!.name : "Sign in"}
          >
            {isSignedIn ? (
              <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                {account!.name.charAt(0).toUpperCase()}
              </span>
            ) : (
              <span className="material-icon text-[22px]">person</span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
