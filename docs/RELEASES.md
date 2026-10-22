# Publicación y versiones

Esta guía prepara el proceso de publicación; **no crea etiquetas ni afirma que un proyecto esté listo para una versión**. Cada release debe corresponder a código que se haya revisado y probado.

## Antes de publicar

1. Revisa el README, los requisitos, la licencia y las instrucciones de actualización.
2. Comprueba el workflow de CI del commit que se publicará.
3. Ejecuta las pruebas reales del proyecto y registra el resultado.
4. Revisa cambios incompatibles, dependencias, variables de entorno y migraciones.
5. Comprueba que no se incluyan tokens, sesiones, archivos `.env` ni credenciales.
6. Actualiza la documentación y las notas de cambios.

## Etiquetas semánticas

Cuando un proyecto tenga una versión estable y un historial suficiente, puede utilizarse el formato `MAJOR.MINOR.PATCH`:

- **MAJOR**: cambios incompatibles que requieren ajustes de los usuarios.
- **MINOR**: funciones nuevas compatibles con el uso anterior.
- **PATCH**: correcciones compatibles.

Mientras un proyecto sea experimental, puede permanecer en `0.x.y`; el número debe reflejar el estado real del paquete. No copies versiones de otro repositorio.

## Notas de publicación

Cada release debería indicar:

- Funciones nuevas.
- Correcciones y problemas conocidos.
- Cambios incompatibles o de configuración.
- Requisitos mínimos y plataformas probadas.
- Pasos de actualización y reversión cuando sean necesarios.
- Enlace al commit publicado.

La configuración `.github/release.yml` organiza automáticamente los cambios por categorías, pero las notas deben revisarse antes de publicarse.

## Actualizaciones

Para una actualización normal, sigue el README del proyecto y conserva copias de seguridad de configuraciones o datos locales. No reemplaces archivos de sesión ni bases de datos por archivos de ejemplo. Si una actualización requiere migración, publica pasos específicos para ese proyecto.

## Estado

No se crean tags ni releases automáticamente con esta guía. Una publicación debe realizarse después de revisar el estado del proyecto concreto y confirmar que sus pruebas disponibles pasan.
