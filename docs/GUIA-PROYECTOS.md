# Guía central de proyectos — AmilcarGit

Esta guía reúne los repositorios públicos principales, sus usos conocidos y los enlaces para instalar, revisar el código o solicitar ayuda. Las funciones y requisitos pueden cambiar: consulta siempre el README y el `package.json` del repositorio antes de instalar.

## Índice

- [Bots de WhatsApp](#bots-de-whatsapp)
- [Bots de Telegram](#bots-de-telegram)
- [Inteligencia artificial](#inteligencia-artificial)
- [Herramientas web y Android](#herramientas-web-y-android)
- [Proyecto web anónimo](#proyecto-web-anónimo)
- [Instalación general](#instalación-general)
- [Preguntas frecuentes](#preguntas-frecuentes)
- [Soporte y colaboración](#soporte-y-colaboración)

## Bots de WhatsApp

| Proyecto | Para qué sirve | Instalación y documentación |
|---|---|---|
| [YuiBot-MD](https://github.com/AmilcarGit/YuiBot-MD) | Bot Multi-Device modular con Node.js y Baileys | Sigue los requisitos y comandos de su [README](https://github.com/AmilcarGit/YuiBot-MD#readme). |
| [S7-Bot-OFC](https://github.com/AmilcarGit/S7-Bot-OFC) | Bot con vinculación mediante código de 8 dígitos | Consulta la guía de [instalación en Termux](https://github.com/AmilcarGit/S7-Bot-OFC#-instalación-en-termux). |
| [BaseBot](https://github.com/AmilcarGit/BaseBot) | Base de bot usada también para probar la integración de AMILCAR-AI | Revisa su [README](https://github.com/AmilcarGit/BaseBot#readme). |
| [TheEly-MD](https://github.com/AmilcarGit/TheEly-MD) | Bot de WhatsApp modular | Consulta su [README](https://github.com/AmilcarGit/TheEly-MD#readme). |

## Bots de Telegram

| Proyecto | Para qué sirve | Instalación y documentación |
|---|---|---|
| [FamilyBot-MD1](https://github.com/AmilcarGit/FamilyBot-MD1) | Bot de Telegram | Sigue su [README](https://github.com/AmilcarGit/FamilyBot-MD1#readme). |

## Inteligencia artificial

| Proyecto | Para qué sirve | Documentación |
|---|---|---|
| [AMILCAR-AI](https://github.com/AmilcarGit/AMILCAR-AI) | Proyecto experimental con SDK para Node.js y motor local; algunas funciones y modos tienen requisitos propios | [README y guía de instalación](https://github.com/AmilcarGit/AMILCAR-AI#readme) |

AMILCAR-AI es experimental. No presupongas que todos los modos tienen las mismas capacidades ni que se necesita o no un servicio externo para cualquier función: revisa la documentación del modo que quieras utilizar.

## Herramientas web y Android

| Proyecto | Para qué sirve | Documentación |
|---|---|---|
| [AmilcarTools](https://github.com/AmilcarGit/AmilcarTools) | Herramientas web para texto, código, datos, imágenes y utilidades | [README](https://github.com/AmilcarGit/AmilcarTools#readme) · [Abrir aplicación](https://amilcartools.vercel.app) |
| [YuiBoost](https://github.com/AmilcarGit/YuiBoost) | Scripts y utilidades para Termux y Android | [README](https://github.com/AmilcarGit/YuiBoost#readme) |

## Proyecto web anónimo

| Proyecto | Para qué sirve | Documentación |
|---|---|---|
| [YuiAnon](https://github.com/AmilcarGit/yuianon) | Hilos de mensajes compartibles con respuestas anónimas | [README](https://github.com/AmilcarGit/yuianon#readme) |

## Instalación general

### En Android con Termux

1. Instala Termux desde una fuente de confianza.
2. Abre Termux y actualiza sus paquetes:
   ```bash
   pkg update && pkg upgrade
   ```
3. Instala Git y Node.js si el proyecto los requiere:
   ```bash
   pkg install git nodejs-lts
   ```
4. Clona únicamente el repositorio que necesitas, entra en su carpeta y sigue el README de ese proyecto.
5. Revisa la versión de Node.js requerida en su `package.json`. No todos los proyectos comparten las mismas dependencias.

### En una computadora

1. Instala una versión de Node.js compatible con el proyecto y Git.
2. Clona el repositorio y entra en su carpeta.
3. Instala dependencias según el gestor y el archivo de bloqueo incluidos en el repositorio.
4. Sigue el comando de inicio indicado en su README y configura únicamente las variables que el proyecto documenta.

No copies sesiones, tokens ni archivos de configuración privados a repositorios públicos.

## Preguntas frecuentes

### ¿Puedo instalar todos los proyectos con un único comando?

No. Cada repositorio tiene dependencias y requisitos distintos. Instala solamente el proyecto que necesitas.

### ¿Por qué un bot puede dejar de conectarse?

Comprueba la compatibilidad de Node.js, el estado de WhatsApp o Telegram, la versión de la biblioteca de conexión y los mensajes de error. No publiques credenciales ni archivos de sesión al pedir ayuda.

### ¿Dónde reporto un error?

Abre un Issue en el repositorio correspondiente y añade pasos para reproducirlo, sistema operativo, versión de Node.js y un registro de error sin secretos.

### ¿Cómo sé si un proyecto está listo para producción?

Revisa sus pruebas, workflows, dependencias, licencia, documentación, configuración de seguridad y actividad reciente. Una etiqueta o una insignia no sustituye esas comprobaciones.

## Soporte y colaboración

- [Todos los repositorios](https://github.com/AmilcarGit?tab=repositories)
- [Issues de AMILCAR-AI](https://github.com/AmilcarGit/AMILCAR-AI/issues)
- [Issues de AmilcarTools](https://github.com/AmilcarGit/AmilcarTools/issues)
- [Issues de YuiBot-MD](https://github.com/AmilcarGit/YuiBot-MD/issues)
- [Issues de S7-Bot-OFC](https://github.com/AmilcarGit/S7-Bot-OFC/issues)

Antes de crear un Issue, busca si el problema ya fue reportado y nunca adjuntes contraseñas, tokens, códigos de vinculación o archivos de sesión.
