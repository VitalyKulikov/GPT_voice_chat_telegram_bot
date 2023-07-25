# Используем официальный образ Node.js
FROM node:14

# Установка директории приложения в контейнере
WORKDIR /usr/src/app

# Копирование зависимостей package.json и package-lock.json
COPY package*.json ./

# Установка зависимостей
RUN npm install

# Копирование всех файлов приложения в рабочую директорию контейнера
COPY . .

# Запуск приложения
CMD [ "npm", "start" ]
