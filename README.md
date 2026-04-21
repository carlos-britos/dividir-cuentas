# Dividir Cuentas

Calculadora para dividir gastos compartidos entre amigos. Permite registrar quién pagó, cuánto pagó, agregar participantes adicionales y calcular automáticamente las transferencias óptimas entre todos.

**[Abrir la app](https://carlos-britos.github.io/dividir-cuentas/)**

## Funcionalidades

- **Pagadores**: Agregar múltiples personas con nombre y monto pagado
- **Participantes**: Incluir personas que comparten el gasto pero no pagaron
- **Cálculo automático**: Total y monto por persona en tiempo real
- **Transferencias optimizadas**: Minimiza la cantidad de transferencias necesarias entre participantes
- **Visualizaciones interactivas**: Diagrama Sankey y diagrama Chord para ver el flujo de pagos
- **Compartir**: Exportar el resumen de gastos o copiarlo al portapapeles
- **Persistencia**: Los datos se guardan automáticamente en el navegador
- **Guía de uso**: Hints en la primera visita para orientar al usuario

## Tech stack

- React 18 + Vite
- SCSS
- lucide-react (iconos)
- GitHub Pages (deploy)

## Desarrollo

```bash
git pull origin main
npm install
npm run dev
```

## Deploy

```bash
npm run deploy
```
