# MCP Retro GUI Desktop

Sistema de escritorio retro-futurista / militar / corporativo con estética de los años 1990-2000.

## 🚀 Características

- **Desktop funcional** con sistema de ventanas arrastrable
- **Estética retro-futurista** con efectos CRT, scanlines y colores estilo terminal militar
- **Sistema vacío** listo para agregar contenido en fases posteriores
- **100% compatible con Vercel** - Sin workers, sin bases de datos, sin persistencia

## 📦 Stack Tecnológico

- **Next.js 15** (App Router)
- **React 18**
- **TypeScript**
- **CSS puro** (sin dependencias innecesarias)

## 🏗️ Arquitectura

```
/workspace
  ├── src/
  │   ├── app/
  │   │   ├── api/
  │   │   │   └── system/
  │   │   │       └── route.ts          # API Route para leer system.json
  │   │   ├── globals.css               # Estilos retro-futuristas
  │   │   ├── layout.tsx
  │   │   └── page.tsx
  │   ├── components/
  │   │   ├── Desktop.tsx               # Contenedor principal
  │   │   ├── Window.tsx                # Ventanas arrastables
  │   │   ├── TaskBar.tsx               # Barra de tareas
  │   │   └── DesktopIcon.tsx           # Iconos del desktop
  │   ├── system/
  │   │   └── system.json               # Configuración del sistema (vacía)
  │   └── types/
  │       └── system.ts                 # Tipos TypeScript
  ├── package.json
  ├── tsconfig.json
  └── next.config.js
```

## 🔧 Instalación y Desarrollo

```bash
# Instalar dependencias
npm install

# Desarrollo local
npm run dev

# Build para producción
npm run build

# Iniciar en producción
npm start
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🌐 Deploy en Vercel

```bash
# Instalar Vercel CLI (opcional)
npm i -g vercel

# Deploy
vercel
```

O conecta el repositorio directamente desde [vercel.com](https://vercel.com).

## 📋 Estado del Proyecto

### ✅ PASO 1 - Completado

- [x] Desktop funcional
- [x] Sistema de ventanas arrastrable
- [x] TaskBar con reloj
- [x] Iconos de escritorio
- [x] Estética retro-futurista completa
- [x] API Route `/api/system`
- [x] `system.json` con estructura base vacía

### 🔜 Próximos Pasos

- [ ] Agregar contenido a `system.json`
- [ ] Implementar aplicaciones funcionales
- [ ] Sistema de archivos
- [ ] Terminal con comandos
- [ ] Puzzles y secrets

## 🎨 Paleta de Colores

- **Fondo principal**: `#000408` (Negro profundo)
- **Fondo secundario**: `#0a1628` (Azul oscuro)
- **Paneles**: `#162338` (Azul grisáceo)
- **Bordes**: `#2a4563` (Azul metálico)
- **Texto primario**: `#00ff41` (Verde terminal)
- **Texto secundario**: `#0af0d2` (Cyan brillante)
- **Highlight**: `#3a8fff` (Azul eléctrico)

## 📄 Licencia

Proyecto educativo/demostrativo.
