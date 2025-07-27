import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Enhanced custom color palette with all new colors
				navy: 'hsl(var(--navy))',
				blue: 'hsl(var(--blue))',
				mint: 'hsl(var(--mint))',
				sage: 'hsl(var(--sage))',
				ocean: 'hsl(var(--ocean))',
				seafoam: 'hsl(var(--seafoam))',
				pearl: 'hsl(var(--pearl))',
				coral: 'hsl(var(--coral))',
				lavender: 'hsl(var(--lavender))',
				cream: 'hsl(var(--cream))',
				teal: 'hsl(var(--teal))',
				amber: 'hsl(var(--amber))',
				emerald: 'hsl(var(--emerald))',
				rose: 'hsl(var(--rose))',
				violet: 'hsl(var(--violet))',
				indigo: 'hsl(var(--indigo))',
				success: 'hsl(var(--success))',
				warning: 'hsl(var(--warning))',
				info: 'hsl(var(--info))',
				error: 'hsl(var(--error))',
				surface: {
					1: 'hsl(var(--surface-1))',
					2: 'hsl(var(--surface-2))',
					3: 'hsl(var(--surface-3))',
					4: 'hsl(var(--surface-4))',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				'2xl': '1.5rem',
				'3xl': '2rem',
				'4xl': '2.5rem',
			},
			fontFamily: {
				sans: ['Inter Variable', 'Inter', 'SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
				mono: ['JetBrains Mono Variable', 'JetBrains Mono', 'Fira Code', 'SF Mono', 'Monaco', 'Consolas', 'monospace'],
				display: ['Inter Variable', 'Inter', 'SF Pro Display', 'system-ui', 'sans-serif'],
				body: ['Inter Variable', 'Inter', 'system-ui', 'sans-serif'],
			},
			fontSize: {
				'2xs': ['0.625rem', { lineHeight: '0.75rem' }],
				'3xl': ['1.875rem', { lineHeight: '2.25rem' }],
				'4xl': ['2.25rem', { lineHeight: '2.5rem' }],
				'5xl': ['3rem', { lineHeight: '1.1' }],
				'6xl': ['3.75rem', { lineHeight: '1.05' }],
				'7xl': ['4.5rem', { lineHeight: '1' }],
				'8xl': ['6rem', { lineHeight: '1' }],
				'9xl': ['8rem', { lineHeight: '1' }],
			},
			spacing: {
				'18': '4.5rem',
				'88': '22rem',
				'112': '28rem',
				'128': '32rem',
				'144': '36rem',
			},
			maxWidth: {
				'8xl': '88rem',
				'9xl': '96rem',
			},
			boxShadow: {
				'glow': '0 0 30px rgba(0, 0, 0, 0.1)',
				'glow-lg': '0 0 60px rgba(0, 0, 0, 0.15)',
				'glow-primary': '0 0 40px hsl(var(--primary) / 0.6)',
				'glow-success': '0 0 40px hsl(var(--success) / 0.6)',
				'inner-lg': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
				'glass': '0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
				'glass-lg': '0 12px 40px rgba(0, 0, 0, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
			},
			backdropBlur: {
				'xs': '2px',
				'3xl': '64px',
			},
			animation: {
				'fade-in': 'fadeIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
				'slide-in-left': 'slideInFromLeft 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
				'slide-in-right': 'slideInFromRight 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
				'slide-in-bottom': 'slideInFromBottom 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
				'zoom-in': 'zoomIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
				'float': 'float 8s ease-in-out infinite',
				'bounce-gentle': 'bounceGentle 2.5s ease-in-out infinite',
				'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
				'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'shimmer': 'shimmer 2s ease-in-out infinite',
				'skeleton-pulse': 'skeletonPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'gradient-shift': 'gradientShift 15s ease infinite',
				'scale-in': 'scaleIn 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
				'rotate-in': 'rotateIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
				'slide-up': 'slideUp 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
				'fade-up': 'fadeUp 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
				'elastic': 'elastic 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				fadeIn: {
					from: { opacity: '0', transform: 'translateY(20px)' },
					to: { opacity: '1', transform: 'translateY(0)' }
				},
				slideInFromLeft: {
					from: { opacity: '0', transform: 'translateX(-40px)' },
					to: { opacity: '1', transform: 'translateX(0)' }
				},
				slideInFromRight: {
					from: { opacity: '0', transform: 'translateX(40px)' },
					to: { opacity: '1', transform: 'translateX(0)' }
				},
				slideInFromBottom: {
					from: { opacity: '0', transform: 'translateY(40px)' },
					to: { opacity: '1', transform: 'translateY(0)' }
				},
				zoomIn: {
					from: { opacity: '0', transform: 'scale(0.8)' },
					to: { opacity: '1', transform: 'scale(1)' }
				},
				float: {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-20px)' }
				},
				bounceGentle: {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-8px)' }
				},
				heartbeat: {
					'0%, 100%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(1.1)' }
				},
				shimmer: {
					'0%': { backgroundPosition: '-200% 0' },
					'100%': { backgroundPosition: '200% 0' }
				},
				skeletonPulse: {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.4' }
				},
				gradientShift: {
					'0%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' },
					'100%': { backgroundPosition: '0% 50%' }
				},
				scaleIn: {
					from: { opacity: '0', transform: 'scale(0.9)' },
					to: { opacity: '1', transform: 'scale(1)' }
				},
				rotateIn: {
					from: { opacity: '0', transform: 'rotate(-10deg) scale(0.9)' },
					to: { opacity: '1', transform: 'rotate(0deg) scale(1)' }
				},
				slideUp: {
					from: { transform: 'translateY(20px)', opacity: '0' },
					to: { transform: 'translateY(0)', opacity: '1' }
				},
				fadeUp: {
					from: { opacity: '0', transform: 'translateY(30px)' },
					to: { opacity: '1', transform: 'translateY(0)' }
				},
				elastic: {
					from: { opacity: '0', transform: 'scale(0.3)' },
					'50%': { transform: 'scale(1.05)' },
					'70%': { transform: 'scale(0.9)' },
					to: { opacity: '1', transform: 'scale(1)' }
				}
			},
			transitionTimingFunction: {
				'ease-smooth': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
				'ease-bounce': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
				'ease-elegant': 'cubic-bezier(0.4, 0, 0.2, 1)',
			},
			scale: {
				'102': '1.02',
				'103': '1.03',
				'108': '1.08',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
