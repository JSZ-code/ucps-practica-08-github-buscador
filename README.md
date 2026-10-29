# UCPS / UNSA · Práctica 8: Buscador de GitHub

Aplicación React + Vite que consume `GET https://api.github.com/users/{username}`. Proyecto de la asignatura **Desarrollo de Aplicaciones Empresariales**.

## 1. Requisitos

- Windows 10/11 y PowerShell, o Linux/macOS.
- Node.js >= 20.19.0 y npm.
- Git instalado para subir el trabajo.

## 2. Instalación

```powershell
cd 'C:\Users\level\Desktop\Github JSZ-code\PRACTICA_08_GITHUB_BUSCADOR'
node -v
npm -v
npm install
npm test
npm run dev
```

Abrir la URL local que indique Vite (normalmente `http://localhost:5173/`).

## 3. Arquitectura

```text
src/
├── App.jsx                         Punto de entrada visual
├── main.jsx                        Montaje de React
├── styles.css                      Estilos y diseño adaptable
├── components/
│   ├── BuscadorGitHub.jsx           Formulario, useState, fetch, estados
│   └── TarjetaUsuario.jsx           Presentación por props
└── services/
    └── githubApi.mjs                Servicio HTTP verificable

tests/githubApi.test.mjs              Pruebas unitarias sin red
.github/workflows/deploy.yml          Build/test/despliegue en Pages
```

## 4. Pruebas manuales (hacer capturas reales)

| Código | Acción | Resultado esperado |
|---|---|---|
| UAT-01 | Buscar `octocat` | Tarjeta con avatar, alias y enlace al perfil |
| UAT-02 | Buscar `    ` | Advertencia; pestaña Network sin llamada a `api.github.com` |
| UAT-03 | Buscar usuario inventado con identificador único | Mensaje rojo 404; desaparece la tarjeta anterior |
| UAT-04 | Limitar velocidad con DevTools > Network > Slow 3G y buscar | Texto `Buscando en GitHub...` durante la consulta |
| UAT-05 | Buscar un usuario sin bio | `Sin biografía` |
| UAT-06 | Abrir enlace al perfil | Nueva pestaña en GitHub; no se abandona app |
| UAT-07 | Visualización en móvil (DevTools) | Controles apilados sin desbordamiento |

`npm test` ejecuta diez pruebas unitarias del adaptador de API. **Ninguna de ellas sustituye las pruebas manuales reales del navegador.**

## 5. Git, commits y publicación

Crear un **repositorio público vacío** en la cuenta GitHub conectada `JSZ-code`, con el nombre `ucps-practica-08-github-buscador` (sin README precreado). Verificar que aún no existe antes de crearlo.

```powershell
git init -b main
git add package.json index.html vite.config.js .gitignore src/main.jsx src/App.jsx src/styles.css
git commit -m 'chore: inicializar proyecto React con Vite'
git add src/components src/services tests
git commit -m 'feat: buscador de perfiles y pruebas de API'
git add README.md .github docs 01_VERIFICAR_ENTORNO.ps1
# Si se generó package-lock.json al ejecutar npm install, agrégalo también:
# git add package-lock.json
git commit -m 'docs: guía de uso y despliegue automático'
# El usuario GitHub conectado es JSZ-code:
git remote add origin https://github.com/JSZ-code/ucps-practica-08-github-buscador.git
git push -u origin main
```

**GitHub Pages:** repositorio > `Settings` > `Pages` > `Build and deployment` > `Source` = **GitHub Actions**. Revisar la ejecución en `Actions` y esperar estado **Success**. La URL será similar a `https://JSZ-code.github.io/ucps-practica-08-github-buscador/`, pero solo es válida cuando el despliegue real haya terminado y sido verificado.

## 6. Evidencias solicitadas

Crear capturas auténticas y guardarlas dentro de `evidencias/`:

- `01_app_perfil_octocat.png`: URL visible y búsqueda exitosa.
- `02_error_404.png`: perfil inexistente, mensaje rojo.
- `03_input_vacio_network.png`: sin petición HTTP ante entrada vacía.
- `04_github_repo.png`: repositorio público, URL y commits.
- `05_github_actions_success.png`: workflow verde.
- `06_url_publica.png`: aplicación abierta por URL GitHub Pages.

Luego incorporar las imágenes al informe Word. No marcar una prueba `PASS` sin su ejecución y evidencia.

## 7. Notas de arquitectura y seguridad

- No necesitas Flask, Aiven, ni base de datos para este trabajo; se consume la API pública de GitHub directamente desde React.
- `fetch` no lanza excepción por HTTP 404. El servicio comprueba `response.ok` y genera errores manejables.
- Sin credenciales ni tokens en el repositorio o frontend.
- GitHub aplica límites de consultas a usuarios no autenticados (403/429); la app muestra un mensaje.
- `node_modules` y `dist` están ignorados con `.gitignore`.
