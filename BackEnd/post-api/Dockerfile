FROM node:21.7.3-slim

ENV TZ=America/Bogota

# Instala tzdata para manejar zona horaria
RUN apt-get update && \
    apt-get install -y tzdata && \
    ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && \
    echo $TZ > /etc/timezone && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Establece el directorio de trabajo
WORKDIR /app

# Copia y instala dependencias
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8876

CMD ["npm", "run", "dev"]