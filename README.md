# Инструкция по запуску

Чтобы этот архитектурный "шедевр" запустился в корневой папке создайте папку DiskStorage.

```
npm install
npm run dev 
npm run build
```
ESLint пока не работает позже докомичу. Валидаторов пока тоже нету так, что кривые запросы пока не отправляйте))).


## Router

### File routes


+ Query dest: относительный путь куда загружать файл(ы). names: указывать желаемые имена загружаемых фалов без расширений. В form-data флаг file перед загружаемым файлом
  POST http://localhost:5000/api/file/create?dest=/a&names=1,2
+ Query dest: относительный путь откуда загружать файл включая имя и расширение файла. GET http://localhost:5000/api/file/download?dest=/FILE1.png
+ Query dest: относительный путь откуда получайть инфу о файле включая имя и расширение файла. GET http://localhost:5000/api/file/getView?dest=/FILE1.png
+ Query dest: относительный путь к файлу включая имя и расширение файла, который будем менять, и в body PUT http://localhost:5000/api/file/update/changeProp?dest=/sad/bot.png
```javascript
 {
     "extname":".png",
     "path":"/somePath",
     "name": "someName"
 } 
 ```
 + Query dest: относительный путь к файлу, который хотим перезаписать. names: имя файла без расширения. PUT http://localhost:5000/api/file/update/rewrite?dest=/&names=ASD
 + DELETE http://localhost:5000/api/file/update/rewrite?dest=/&names=ASD
 ### Folder routes
 + POST http://localhost:5000/api/folder/create?dest=/b/asd
 + GET http://localhost:5000/api/folder/create?dest=/b/asd был ещё query extended но он потерял свой смысл т.к я и так возвращаю всю инфу. Query ***sort*** указываем по какому полю хотим отсортировать (ctime extname name )
 + GET http://localhost:5000/api/folder/download?dest=b/
 + PUT http://localhost:5000/api/folder/update?dest=a&newName=b   Путь к папке и новое её имя
 




