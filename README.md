

## **Desplegando tu Aplicación de Node.js en AWS Lightsail como un Jefe**

# *Introducción:*

¡Hola, amig@s de la nube y exploradores del código! Si estás leyendo esto, es porque como yo, decidiste aventurarte en el fascinante mundo de AWS (Amazon Web Services). ¿La misión? Desplegar nuestra primera aplicación de Node.js como unos auténticos jefes en el juego del desarrollo web.

Mis andanzas en la nube comenzaron con una simple pregunta: "¿Cómo demonios hago para llevar mi brillante creación digital a Internet?" AWS, ese extenso territorio de servicios en la nube, ofrecía una solución perfecta: AWS Lightsail. Escuché sus cantos de sirena sobre simplicidad y empecé a soñar con desplegar mi app en cuestión de minutos. Pero, como dicen por ahí, a veces los cuentos de hadas tecnológicos se entrelazan con desafíos inesperados.

<img src="https://drive.google.com/uc?id=18VqQm4k1l-TZkG0i3nKu4wyvbbRbMkTR" alt="incredulidad aws lightsail" width="350" />

*Un servidor AWS Lightsail, una taza de café, y yo, con una expresión que mezcla entusiasmo e incredulidad.*

Espera, ¿dónde está ese mágico botón de "Desplegar Ahora y Olvidarte"? Echaba de menos la magia que herramientas como Heroku o Render brindaban, esas que detectan mis cambios en el repositorio y hacen despliegues automáticos. Pero, como en la vida, cuando no encuentras la solución perfecta, ¡créala tú mismo!

Así que decidí tomar las riendas y huir de lo convencional. ¿La herramienta que me salvaría? ¡GitHub Actions! Un heraldo moderno que traería la automatización que ansiaba. Dicho de otra manera, estaba a punto de hacer que mi servidor AWS bailara al ritmo de mi repositorio en GitHub. A veces, en lugar de esperar al príncipe azul, ¡es mejor ser tu propio héroe informático!

<img src="https://drive.google.com/uc?id=1Setb0AXu6uTswdMkAqd-ZJJQt9psr--s" alt="Github Action marcando el ritmo" width="350" />

*Github Action marcando el ritmo.*

Si usted es de esos como yo que le gusta ir directamente al código, descifrar y aplicar rápidamente, e aquí el link en GitHub con el **repo**: https://github.com/juparog/deploy-in-aws-lightsail

---

## **La Solución Propuesta: Un Baile Sincronizado de Desarrollo y Despliegue**

Ahora que comprendemos los desafíos que enfrenté en el despliegue de AWS Lightsail, veamos cómo logré una solución elegante mediante un proceso coreografiado. Visualicemos esto con un diagrama:

<img src="https://drive.google.com/uc?id=1s9IMpX9lmGC9FkY4gCzNCprjox8iSkmN" alt="Diagrama de Flujo del Despliegue" width="500" />

*Diagrama de Flujo del Despliegue.*

**Paso 1: Desarrollo Creativo y Pull Requests**

Iniciamos en el ámbito de desarrollo, donde creamos en ramas de características. Cuando estamos listos, abrimos un Pull Request (PR) a `master`.

**Paso 2: Activación de GitHub Actions**

Cerramos el PR y GitHub Actions toma la batuta.

**Paso 3: Compilación, Empaquetado y Transferencia**

GitHub Actions compila y empaqueta en un archivo ZIP. Vía SSH, transferimos esto a AWS Lightsail.

**Paso 4: Despliegue en Lightsail con PM2**

Descomprimimos el paquete y usamos PM2 para ejecutar la aplicación.


¡Por supuesto! Agregar una sección donde presentas el código y explicación detallada de cada paso es una excelente manera de brindar instrucciones claras a tus lectores. Aquí tienes un ejemplo de cómo podrías estructurar esa sección:

---

## **Paso a Paso: Cómo Desplegar tu Aplicación en AWS Lightsail usando GitHub Actions**

### **Paso 1: Configuración Inicial y Preparación del Repositorio**

Antes de comenzar, asegúrate de tener una cuenta en AWS y un repositorio en GitHub con tu aplicación de Node.js. A continuación, pasaremos por los pasos necesarios para crear una aplicación de prueba y configurar tu repositorio:

1. Crear un HelloWorld rápido para simular la aplicación real y maravillosa que se desplegara:

   ```bash
   # ejecute los siguientes comando en la terminal
   mkdir helloworld
   cd helloworld
   npm init --yes
   npm install --save-dev typescript@4 @types/node@16 @types/express@4
   npm install express dotenv
   tsc --init --target es6 --outDir dist
   touch index.ts
   ```

   Debería ver esta estructura de archivos:
   ```text
   └───node_modules
       └─── ...
   └───index.ts
   └───package.json
   └───tsconfig.json
   ```

   Agregue el siguiente código a su archivo `index.ts`:
   ```ts
   import express from 'express';
   import dotenv from 'dotenv';
   
   dotenv.config();
   
   const app = express();
   const port = +(process.env.PORT ?? 3000);
   const host = process.env.HOST ?? 'localhost';
   
   app.get('/', (req, res) => {
     res.send('Express + TypeScript Server');
   });
   
   app.listen(port, host, () => {
     console.log(`[server]: Server is running at http://${host}:${port}`);
   });
   ```

2. Crea un repo en GitHub y una rama para tus características: En tu repositorio, crea una nueva rama basada en `master` para cada nueva función que desarrolles. Esto facilitará la gestión de las actualizaciones. (omitiré el detalle de esta parte ya que es algo que asumo que sabes sino es posible que ponga un link aquí en el futuro de como hacerlo)

3. Configure los scripts en su archivo package.json:

   ```json
   {
     "name": "deploy-in-aws-lightsail",
     "version": "1.0.0",
     "description": "",
     "main": "index.js",
     "scripts": {
       "build": "tsc", // Compila la aplicación
       "postbuild": "cp package.json dist", // Copia algunos archivos luego de compilar
       "test": "echo \"Error: no test specified\" && exit 1" // Agregue sus tes o simplemente    ignore esto
     },
     "keywords": [],
     "author": "",
     "license": "ISC",
     "devDependencies": {
       "@types/express": "^4.17.17",
       "@types/node": "^16.18.40",
       "typescript": "^4.9.5"
     },
     "dependencies": {
       "dotenv": "^16.3.1",
       "express": "^4.18.2"
     }
   }
   ```

4. Cree un archivo `ecosystem.config.js` el cual servirá para indicarle a pm2 como lanzar la aplicación, sino sabe que es pm2 en pocas palabras en una herramienta que orquesta la ejecución de aplicaciones nodejs en un servidor, esta hecho según sus creadores para producción, link: [Información sobre pm2](https://pm2.keymetrics.io/). Siéntase libre de usar la herramienta que mas le guste o se ajuste a su caso.

   ```bash
   # ejecute los siguientes comando en la terminal
   touch ecosystem.config.js
   ```

   Agregue el siguiente contenido a su archivo `ecosystem.config.js`:
   ```js
   module.exports = {
     apps: [
       {
         name: 'helloworld',
         script: 'index.js',
         instances: 1,
         exec_mode: 'fork',
         watch: false,
         env: {
           HOST:'#{HOST}#',
           PORT:'#{PORT}#'
         }
       }
     ]
   };
   ```
   He dejado algunos tokens '#{...}#' los cuales serán remplazados durante la ejecución del flujo por variables de entono que configuraremos en el repositorio de GitHub, esto permite dar un poco mas de dinamismo en el desligue de la aplicación.

### **Paso 2: Definición del Flujo de Trabajo**

1. Crea un archivo `.github/workflows/deploy.yml`: Este archivo contendrá la definición de tu flujo de trabajo de GitHub Actions. Aquí es donde especificarás los pasos que se ejecutarán cuando se cierre un PR.

   ```bash
   # ejecute los siguientes comando en la terminal
   mkdir .github
   mkdir workflows
   touch .github/workflows/deploy.yml
   ```
   Estos comandos solo crearan directorios y archivos, si usted es de los que 'pocón pocón, con comandos de terminal', puede hacer a traves de el explorador de windows o vscode (espero este usando vscode)

   En el archivo `deploy.yml`, define el flujo de trabajo y los pasos que se ejecutarán:
   
   ```yaml
   name: 🚀 Build and Deploy

   # Activar el flujo solo cuando se cierre un pull request
   # Ajuste según sus necesidades
   on:
     pull_request:
       types:
         - closed
   
   env:
     APP_DEPLOY_PATH: /home/ec2-user/app # Ruta en donde se desplegara la aplicación en su    instancia de Lightsail (esta se creara mas adelante)
   
   jobs:
     build:
       runs-on: ubuntu-latest
   
       steps:
       - name: 🛒 Checkout Repository # Clonar los recursos del repo en el agente donde se    ejecuta el pipeline
         uses: actions/checkout@v2
   
       - name: 📦 Set up Node.js # Instalar nodejs version 18
         uses: actions/setup-node@v2
         with:
           node-version: 18
   
       - name: 📥 Install Dependencies # Instalar las dependencias de la aplicación
         run: npm install
   
       # Podría agregar aquí algunas tareas que ejecuten pruebas y análisis de código estático
   
       - name: 🏗️ Build Application # Compilar la aplicación
         run: npm run build
   
       - name: 🚧 Replace Tokens # remplazar lostokens #{...}# del archivo ecosisten popr valores    reales
         uses: cschleiden/replace-tokens@v1
         with:
           files: '["ecosystem.config.js"]'
         env:
           HOST: ${{ vars.HOST }}
           PORT: ${{ vars.PORT }}
   
       - name: 📦 Package App # Empaquetar el compilado en un zip
         run: zip -r app.zip dist
   
       - name: 🚚 Transfer App to Lightsail # transferir el archivo empaquetado a nuestra       instancia de Lightsail
         uses: appleboy/scp-action@v0.1.4
         with:
           host: ${{ secrets.SSH_IP }}
           username: ${{ secrets.SSH_USER }}
           key: ${{ secrets.SSH_PRIVATE_KEY }}
           source: "./app.zip"
           target: ${{ env.APP_DEPLOY_PATH }}/
   
       - name: 📂 Unzip App # Conectarse a la instancia de Lightsail y descomprimir la aplicación
         uses: appleboy/ssh-action@v1.0.0
         with:
           host: ${{ secrets.SSH_IP }}
           username: ${{ secrets.SSH_USER }}
           key: ${{ secrets.SSH_PRIVATE_KEY }}
           script: |
             unzip -o ${{ env.APP_DEPLOY_PATH }}/app.zip -d /${{ env.APP_DEPLOY_PATH }}/
             ls -l
   
       - name: 🚀 Deploy App # Desplegar la aplicación, bello bello
         uses: appleboy/ssh-action@v1.0.0
         with:
           host: ${{ secrets.SSH_IP }}
           username: ${{ secrets.SSH_USER }}
           key: ${{ secrets.SSH_PRIVATE_KEY }}
           script: |
             cd ${{ env.APP_DEPLOY_PATH }}/dist
             pm2 stop ./ecosystem.config.js
             npm install
             pm2 start ./ecosystem.config.js
   ```
   
   Aquí hemos configurado el flujo de trabajo para que se active cuando se cierra un PR o se haga un push a la rama `master`.

**Paso 4: Compilación, Empaquetado y Transferencia**

La compilación, empaquetado y despliegue están inmersos en el paso anterior dentro del pipeline de despliegue y serán fáciles de identificar por los comentarios.

**Paso 4: Despliegue en Lightsail con PM2**

1. Crea su instancia en Aws Lightsail:

   <img src="https://drive.google.com/uc?id=1gjKQ-Rya2wY8356-8o_UPNrC9jCHeJXW" alt="Parámetros para crear la instancia" width="350" />
   
   *Seleccione una region, plataforma Linux y solo sistema operativo con imagen Amazon Linux para montar la instancia.*

   <img src="https://drive.google.com/uc?id=1YmNLnl1QO6x-I4FowrUhJOWfNQGFdQc0" alt="Crear ssh key para la instancia lightsail" width="350" />
   
   *Crear una ssh key para conectarse a la instancia de Lightsail.*

   Al momento de crear su key ssh no olvide descargar el archivo que la contiene para luego poder utilizarla desde el flujo.

   <img src="https://drive.google.com/uc?id=1ETG1b0OTKKuyrUtG8pkYsWdBLQnZTRbs" alt="Crear la instancia" width="350" />
   
   *Pulse el botón crear instancia y espere..., hasta que el estado sea `Running`*

   <img src="https://drive.google.com/uc?id=15wTqrXvuAfCBFheZvUVBu-EzlSpq9Apq" alt="Instancia en ejecución" width="350" />

   *Instancia en ejecución.*

2. Abra el puerto 8080 de su nueva instancia, por ese puerto sera donde iniciemos nuestra aplicación.

   Diríjase a la sección `Networking` de su instancia y agregue el puerto en `IPv4 Firewall`:

   <img src="https://drive.google.com/uc?id=1s9g58p4BLn3P9oO_rqV-Szr_1rv1qVRX" alt="Abrir puerto en la instancia lightsail" width="350" />

   *Abrir puerto en instancia de Lightsail.*

3. Instale node, npm y pm2 en la instancia de Lightsail mediante la terminal web ssh que ofrece el servicio:
   
   <img src="https://drive.google.com/uc?id=1OjVZLuz9bmhzBbHhsHOzoa30WTfVV_NU" alt="Abrir puerto en la instancia lightsail" width="350" />

   *Abrir la terminal web de la instancia Lightsail.*

   ```bash
   # ejecute los siguientes comandos en la terminal web de su instancia ssh
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
   . ~/.nvm/nvm.sh
   nvm install 18
   npm install -g pm2
   mkdir ~/app
   ```

   <img src="https://drive.google.com/uc?id=11cxdzWBeREMQ7lWkf8hZ4uzlQgZftFok" alt="Abrir la terminal web de la instancia Lightsail" width="350" />

   *Abrir la terminal web de la instancia Lightsail.*

4. Los tokens `${{ vars.xxxx }}` y `${{ secrets.xxxx }}` del archivo `.github/workflows/deploy.yml`  se configuran en la sección de `Settings`en tu repo de GitHub:

   Agrega los secretos primero, son esas variables las cuales no quieres que sean visible su valor:

   * SSH_IP: Ip publica de su instancia Lightsail.
   * SSH_USER: Usuario para la conexión ssh, por defecto es `ec2-user`.
   * SSH_PRIVATE_KEY: Contenido del archivo `.pem` que descargo al momento de crear la key par cuando estaba creando la instancia.

   Los dos primeros valores los puede validar entrando en la instancia

   <img src="https://drive.google.com/uc?id=1V_dQ1R6h4GVDLdDfz1Hifo4kf7YjTDpD" alt="Usuario e Ip publica de su instancia Lightsail" width="350" />

   *Usuario e Ip publica de su instancia Lightsail*

   Agrégalos estos valores en la ruta *Settings -> Secrets and variables -> Actions -> Secrets* de tu repo GitHub:

   <img src="https://drive.google.com/uc?id=11hSH9oA0TDsESqXhrH8PkljS3x98tuaG" alt="Agregar secretos en Github repo" width="350" />

   *Agregar secretos en Github repo.*

   Agrega ahora las variables en la sección *Variables* de la misma ruta de secretos:


   * HOST: host para el servidor express: 0.0.0.0
   * PORT: puerto para el servidor express: 8080
   
   <img src="https://drive.google.com/uc?id=173DYdIN0UpOiuhJJiYUXSWWw6o0YAsba" alt="Agregar variables en Github repo" width="350" />

   *Agregar variables en Github repo.*

5. Configure los archivos locales con su repositorio remoto en github.
   
   Envié un `README.md` a la rama master para inicializar el repo:
   ```bash
   # ejecute los siguientes comandos en la terminal donde están sus archivos
   echo "# deploy-in-aws-lightsail" >> README.md
   git init
   git add README.md
   git commit -m "first commit"
   git remote add origin <agregue aquí la ruta de su repositorio>
   git push origin master
   ```
   
   Cree una nueva branch `feature/deploy` donde irán el resto de archivos que desplegaran su aplicación:
   ```bash
   # ejecute los siguientes comandos en la terminal donde están sus archivos
   echo "node_modules/" >> .gitignore
   echo "dist/" >> .gitignore
   git checkout -b feature/deploy
   git add .
   git commit -m "first commit"
   git push origin feature/deploy
   ```

6. Cree un pull request e integremos coon la rama master para activar la acción que desplegara la aplicación.
   
8. Valida en la sección de  `Actions` de su repo en github la activación de las acciones

   <img src="https://drive.google.com/uc?id=11D8NaqZqasqXgc6bqiSIS2zr-bcaR-5m" alt="Ejecución del flujo" width="350" />

   *Visualización de la ejecución del flujo en github.*

9. Validar la ejecución correcta de la aplicación a traves del navegador http://<su-ip-de-instancia>:8080
   
   <img src="https://drive.google.com/uc?id=1UR0cIrixLQETUupJ09FqaeHMuzDQ2qd6" alt="Ejecución del flujo" width="350" />

   *Obtener el servicio expuesto con el navegador.*

## **Conclusión**

En este emocionante viaje, hemos explorado cómo desplegar una aplicación de Node.js en AWS Lightsail como verdaderos jefes del desarrollo web. Hemos superado los desafíos, creado soluciones innovadoras y orquestado un baile sincronizado entre GitHub y AWS.

Gracias a la automatización a través de GitHub Actions, ahora puedes desplegar tu aplicación con confianza y estilo. A medida que continúes explorando AWS y expandiendo tus habilidades en el mundo del desarrollo web, recuerda que ser tu propio héroe informático te llevará a lugares increíbles.

¡Te invito a seguir la música en GitHub y explorar más aventuras tecnológicas juntos! Sígueme en mi perfil de GitHub: [juparog](https://github.com/juparog).

¡Hasta la próxima aventura!

