import { motion } from 'framer-motion';
import { Brain, Menu, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AuthModal } from '@/components/auth/AuthModal';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, signOut } = useAuth();

  const handleSignOut = () => {
    signOut();
    setIsOpen(false);
  };

  const scrollToDashboard = () => {
    document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="glass-card px-6 py-3 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <span className="font-bold text-lg text-foreground">
                Hate<span className="text-primary">Intel</span>
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <NavLink href="#features">Features</NavLink>
              <NavLink href="#dashboard">Dashboard</NavLink>
              <NavLink href="#analytics">Analytics</NavLink>
              <NavLink href="#docs">Docs</NavLink>
            </div>

            {/* CTA */}
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50">
                    <User className="w-4 h-4 text-primary" />
                    <span className="text-sm text-foreground">{user.name}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleSignOut}
                    className="text-muted-foreground hover:text-foreground gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-muted-foreground hover:text-foreground"
                    onClick={() => setShowAuthModal(true)}
                  >
                    Sign In
                  </Button>
                  <Button size="sm" onClick={scrollToDashboard}>
                    Get Started
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu */}
            <button
              className="md:hidden p-2 text-muted-foreground hover:text-foreground"
              onClick={() => setIsOpen(!isOpen)}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Menu Dropdown */}
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden glass-card mt-2 p-4"
            >
              <div className="flex flex-col gap-4">
                <NavLink href="#features" mobile>Features</NavLink>
                <NavLink href="#dashboard" mobile>Dashboard</NavLink>
                <NavLink href="#analytics" mobile>Analytics</NavLink>
                <NavLink href="#docs" mobile>Docs</NavLink>
                <hr className="border-border" />
                {user ? (
                  <>
                    <div className="flex items-center gap-2 text-foreground">
                      <User className="w-4 h-4 text-primary" />
                      <span className="text-sm">{user.name}</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleSignOut} className="justify-start gap-2">
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="justify-start"
                      onClick={() => {
                        setShowAuthModal(true);
                        setIsOpen(false);
                      }}
                    >
                      Sign In
                    </Button>
                    <Button size="sm" onClick={scrollToDashboard}>
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </motion.nav>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}

function NavLink({ 
  href, 
  children, 
  mobile = false 
}: { 
  href: string; 
  children: React.ReactNode;
  mobile?: boolean;
}) {
  return (
    <a
      href={href}
      className={`text-muted-foreground hover:text-foreground transition-colors ${
        mobile ? 'text-base' : 'text-sm'
      }`}
    >
      {children}
    </a>
  );
}
