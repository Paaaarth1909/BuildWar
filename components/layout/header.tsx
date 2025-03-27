"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe, Menu, User } from "lucide-react"

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "hi", name: "हिन्दी" },
]

export function Header() {
  const [user, setUser] = useState<any>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState("en")
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }

    getUser()

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [supabase.auth])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  const changeLanguage = (code: string) => {
    setCurrentLanguage(code)
    // In a real app, you would implement language switching logic here
  }

  return (
    <header className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            Traffic Violation Reporter
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className={`hover:text-primary-foreground/80 ${pathname === "/" ? "font-bold" : ""}`}>
              Home
            </Link>
            <Link
              href="/report"
              className={`hover:text-primary-foreground/80 ${pathname === "/report" ? "font-bold" : ""}`}
            >
              Report Violation
            </Link>
            <Link
              href="/dashboard"
              className={`hover:text-primary-foreground/80 ${pathname === "/dashboard" ? "font-bold" : ""}`}
            >
              My Reports
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Globe className="h-5 w-5" />
                  <span className="sr-only">Change language</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={currentLanguage === lang.code ? "bg-muted" : ""}
                  >
                    {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                    <span className="sr-only">User menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem disabled>{user.email}</DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>Sign out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button variant="secondary" size="sm">
                  Sign In
                </Button>
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden pt-4 pb-2 space-y-2">
            <Link href="/" className="block py-2 hover:text-primary-foreground/80" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            <Link
              href="/report"
              className="block py-2 hover:text-primary-foreground/80"
              onClick={() => setIsMenuOpen(false)}
            >
              Report Violation
            </Link>
            <Link
              href="/dashboard"
              className="block py-2 hover:text-primary-foreground/80"
              onClick={() => setIsMenuOpen(false)}
            >
              My Reports
            </Link>
            <div className="py-2">
              <p className="text-sm font-medium mb-1">Language</p>
              <div className="flex space-x-2">
                {languages.map((lang) => (
                  <Button
                    key={lang.code}
                    variant={currentLanguage === lang.code ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => changeLanguage(lang.code)}
                  >
                    {lang.name}
                  </Button>
                ))}
              </div>
            </div>
            {user ? (
              <div className="py-2">
                <p className="text-sm text-primary-foreground/80 mb-1">{user.email}</p>
                <Button variant="secondary" size="sm" onClick={handleSignOut}>
                  Sign out
                </Button>
              </div>
            ) : (
              <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                <Button variant="secondary" size="sm">
                  Sign In
                </Button>
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}

