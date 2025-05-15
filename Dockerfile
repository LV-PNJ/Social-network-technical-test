# Usa la imagen oficial de PostgreSQL
FROM postgres:16

# Establece las variables de entorno para el usuario y la contraseña
ENV POSTGRES_USER=admin
ENV POSTGRES_PASSWORD=admin123
ENV POSTGRES_DB=devx

# Copia scripts de inicialización si los necesitas (opcional)
# COPY ./init.sql /docker-entrypoint-initdb.d/

# Exponer el puerto por defecto de PostgreSQL
EXPOSE 5432
