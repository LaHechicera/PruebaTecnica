# Frontend (Vue 3 + Vuetify 3) - MVP

Este frontend está hecho para cubrir **lo mínimo viable**:
- Login con JWT (POST `/auth/login`)
- Guardar token en `localStorage`
- Tabla con records (GET `/records` con Bearer token)
- Formulario para crear records (POST `/records`)

> Nota: El backend incluido actualmente no expone endpoint de actualización (PUT/PATCH), por eso el botón **Editar**
> solo precarga el formulario y al guardar realiza **POST** (crea un nuevo record).

## Requisitos
- Node 18+ recomendado

## Configuración
1. Copiar `.env.example` a `.env`
2. Ajustar la URL del backend si corresponde:
   - `VITE_API_BASE_URL=http://localhost:3000`

## Ejecutar
```bash
cd frontend
npm install
npm run dev
```

## Credenciales
- Email: `admin@test.com`
- Password: `123456`
