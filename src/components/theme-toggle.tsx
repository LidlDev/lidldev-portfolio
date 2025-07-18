import { Moon, Sun, Monitor } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [isExpanded, setIsExpanded] = useState(false)

  const themes = [
    { value: "light", icon: Sun, label: "Light" },
    { value: "dark", icon: Moon, label: "Dark" },
    { value: "system", icon: Monitor, label: "System" },
  ]

  const currentTheme = themes.find(t => t.value === theme) || themes[2]

  const handleThemeSelect = (newTheme: string) => {
    setTheme(newTheme as "light" | "dark" | "system")
    setIsExpanded(false)
  }

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div className="relative">
      {/* Main toggle button */}
      <Button
        variant="outline"
        size="icon"
        className={`relative transition-all duration-300 ${
          isExpanded ? 'rounded-t-md rounded-b-none border-b-0' : 'rounded-md'
        }`}
        onClick={toggleExpanded}
      >
        <currentTheme.icon className="h-[1.2rem] w-[1.2rem] transition-all" />
        <span className="sr-only">Toggle theme</span>
      </Button>

      {/* Expanded options */}
      <div className={`absolute top-full left-0 flex flex-col transition-all duration-300 ${
        isExpanded ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
      }`}>
        {themes.map((themeOption, index) => {
          const Icon = themeOption.icon
          const isActive = themeOption.value === theme
          const isLast = index === themes.length - 1

          return (
            <Button
              key={themeOption.value}
              variant={isActive ? "default" : "outline"}
              size="icon"
              className={`transition-all duration-200 border-t-0 ${
                isLast ? 'rounded-b-md rounded-t-none' : 'rounded-none'
              } ${isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
              onClick={() => handleThemeSelect(themeOption.value)}
            >
              <Icon className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">{themeOption.label}</span>
            </Button>
          )
        })}
      </div>

      {/* Backdrop to close when clicking outside */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-[-1]"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </div>
  )
}
