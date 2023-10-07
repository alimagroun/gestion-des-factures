# Use a base image with Java (JRE) and Alpine Linux that supports Java 17
FROM openjdk:17-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the JAR file (already built) into the container
COPY target/gestion-des-factures-0.0.1-SNAPSHOT.jar ./app.jar

# Expose the port your Spring Boot application listens on (default is 8080)
EXPOSE 8080

# Command to run your Spring Boot application
CMD ["java", "-jar", "app.jar"]
