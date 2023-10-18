pipeline {
    agent any
    environment {
        DOCKER_IMAGE = "alimagroun/gestion-de-factures-spring:latest"
    }
    stages {
        stage("Cleanup Workspace") {
            steps {
                cleanWs()
            }
        }

        stage("Checkout from SCM") {
            steps {
                git branch: 'master', credentialsId: 'github', url: 'https://github.com/alimagroun/gestion-des-factures'
            }
        }

        stage("Build Application") {
            steps {
                bat "mvn -f spring-boot/pom.xml clean package"
            }
        }

        stage("Test Application") {
            steps {
                bat "mvn -f spring-boot/pom.xml test"
            }
        }

        stage("Build Spring Boot Docker Image") {
            steps {
                dir("spring-boot") {
                    bat 'docker build -t alimagroun/gestion-de-factures-spring:latest .'
                }
            }
        }

        stage('Push image') {
            steps {
                script {
                    withDockerRegistry([url: "https://registry.hub.docker.com", credentialsId: "docker", url: ""]) {
                        bat "docker push ${DOCKER_IMAGE}"
                    }
                }
            }
        }
    }
}