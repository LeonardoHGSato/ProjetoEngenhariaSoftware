# Imagem do backend (Spring Boot / Java 25).
# Build multi-stage: compila o .jar com o Maven Wrapper e roda numa imagem JRE enxuta.

# ----- build -----
FROM eclipse-temurin:25-jdk AS build
WORKDIR /app

# Copia primeiro o wrapper e o pom para aproveitar o cache de dependencias.
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN chmod +x mvnw && ./mvnw -B dependency:go-offline

COPY src/ src/
RUN ./mvnw -B clean package -DskipTests

# ----- runtime -----
FROM eclipse-temurin:25-jre
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
