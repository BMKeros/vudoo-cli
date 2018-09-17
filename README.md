# vudoo-cli
CLI for VueJS + Odoo

------------------------------------------------------------------
------------------------------------------------------------------
------------------------------------------------------------------
```
 ,ggg,         ,gg
dP""Y8a       ,8P                   8I
Yb, `88       d8'                   8I
 `"  88       88                    8I
     88       88                    8I
     I8       8Igg      gg    ,gggg,8I    ,ggggg,    ,ggggg,
     `8,     ,8'I8      8I   dP"  "Y8I   dP"  "Y8gggdP"  "Y8ggg
      Y8,   ,8P I8,    ,8I  i8'    ,8I  i8'    ,8I i8'    ,8I
       Yb,_,dP ,d8b,  ,d8b,,d8,   ,d8b,,d8,   ,d8',d8,   ,d8'
        "Y8P"  8P'"Y88P"`Y8P"Y8888P"`Y8P"Y8888P"  P"Y8888P"
 ```

------------------------------------------------------------------
------------------------------------------------------------------
------------------------------------------------------------------





Luego de Clonar el repositorio debes acceder a la ruta vudoo-cli. Una vez ahí haces yarn -i o npm install. Yo te recomiendo yarn. Es el que usamos.

Instaladas las dependencias, accedes a vudoo-cli/bin

Acá viene la magia!
Vudoo usa 3 parámetros de los cuales 2 deben ser obligatorios.

init Inicia una aplicación Vudoo.
-d Le asignas una ubicación de directorio donde descargara los complementos de la aplicación!
-t Le indica el tipo de template que descargara en este caso
Empecemos. Si todo esta Bien instalado, podrías escribir vudoo-cli y te saldría la ayuda automática.

Luego hagamos Esto! ... ...

_vudoo-cli init new_module -t odoo10-semantic -d /home/user/folder_

New_module es el nombre que le das al modulo.
Luego de -t el template que escoges es primero la versión de odoo que usaras desde la version 8 hasta la versión 11 sumado a eso Tienes el framework, actualmente hay dos Semantic-Ui y Vuetify
-d este es opcional. Es para mantener organizado tu directorio.

Puedes ver lo que te digo en el repositorio de https://github.com/BMKeros/vudoo-templates Aca estan las ramas correspondientes a odoo y al frameword.

Una vez corrido el comando general, debes acceder a new_module/static/src/js/vue y hacer yarn -i Luego de instalar todas las dependencias, corre yarn build.
Con esto ya el modulo esta listo para usarse.

Corre con odoo tu modulo y Listo. Deberia correr.
