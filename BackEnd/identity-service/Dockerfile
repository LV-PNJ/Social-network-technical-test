# syntax=docker/dockerfile:1
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /workspace
COPY mvnw pom.xml ./
COPY .mvn .mvn
RUN chmod +x mvnw
COPY src src
RUN ./mvnw -q -DskipTests package

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
RUN apk add --no-cache curl \
  && addgroup -S app && adduser -S app -G app \
  && mkdir -p /app/logs \
  && chown -R app:app /app
COPY --from=build /workspace/target/identity-service-*.jar /app/app.jar
USER app
EXPOSE 8081
ENV LOG_PATH=/app/logs
ENV SPRING_OUTPUT_ANSI_ENABLED=ALWAYS
HEALTHCHECK --interval=10s --timeout=5s --retries=12 --start-period=40s \
  CMD curl -fsS http://localhost:8081/actuator/health | grep -q UP || exit 1
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
