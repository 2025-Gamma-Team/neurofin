# NeuroFin Frontend

## Descripción
Frontend de la aplicación NeuroFin, una plataforma de análisis financiero y gestión de inversiones.

## Tecnologías
- React
- TypeScript
- Tailwind CSS
- Vite

## Requisitos Previos
- Node.js (versión 20 o superior)
- npm

## Instalación

1. Clonar el repositorio:
```bash
git clone [URL_DEL_REPOSITORIO]
cd frontend
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
```
Editar el archivo `.env` con las configuraciones necesarias.

## Desarrollo

Para iniciar el servidor de desarrollo:
```bash
npm run dev
```

## Construcción

Para crear una versión de producción:
```bash
npm run build
```

## Estructura del Proyecto
```
frontend/
├── src/
│   ├── components/    # Componentes reutilizables
│   ├── pages/         # Páginas de la aplicación
│   ├── services/      # Servicios y llamadas a API
│   ├── styles/        # Estilos globales
│   ├── types/         # Definiciones de TypeScript
│   └── utils/         # Funciones de utilidad
├── public/            # Archivos estáticos
└── package.json       # Dependencias y scripts
```

## Contribución
1. Crear una rama para la nueva funcionalidad
2. Hacer commit de los cambios
3. Crear un Pull Request

## Licencia
[MIT](LICENSE) 