pipeline {
    agent any
    
    stages {
        stage("Clone the project") {
            steps {
                script {
                    checkout([$class: 'GitSCM', branches: [[name: 'master']], userRemoteConfigs: [[url: 'https://github.com/alimagroun/gestion-des-factures.git']]])
                }
            }
        }

        stage("Compilation") {
            steps {
                sh "./mvnw clean install -DskipTests"
            }
        }

        stage("Tests and Deployment") {
            stages {
                stage("Running unit tests") {
                    steps {
                        sh "./mvnw test -Punit"
                    }
                }

                stage("Deployment") {
                    steps {
                        sh 'nohup ./mvnw spring-boot:run -Dserver.port=8001 &'
                    }
                }
            }
        }
    }
}
