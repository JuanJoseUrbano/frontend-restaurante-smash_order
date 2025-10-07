pipeline {
    agent any

    environment {
        // IMPORTANTE: Cambia 'your-github-username-or-org' por tu nombre de usuario u organización de GitHub.
        // IMAGE_NAME debe contener solo el nombre de repositorio en formato 'usuario-o-org/repo',
        // sin el prefijo del registry (p. ej. 'ghcr.io'). El pipeline añadirá el registry automáticamente.
        REGISTRY = 'ghcr.io'
        IMAGE_NAME = 'your-github-username-or-org/frontend-restaurante-smash_order'
        // Este es el ID de las credenciales que debes configurar en Jenkins para acceder al registro de contenedores.
        CREDENTIAL_ID = 'ghcr-credentials'
    }

    stages {
        stage('Checkout') {
            steps {
                // Clona el repositorio
                checkout scm
            }
        }

        stage('Build & Tag Image') {
            steps {
                script {
                    // Usa el hash corto del commit como etiqueta, igual que en la acción de GitHub
                    def shortCommit = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                    // Normaliza IMAGE_NAME por si alguien incluyó accidentalmente el prefijo del registry
                    def normalizedImageName = env.IMAGE_NAME.replaceAll('^ghcr.io/', '')
                    def fullImageName = "${env.REGISTRY}/${normalizedImageName}"
                    
                    // Construye la imagen Docker desde el Dockerfile
                    def dockerImage = docker.build("${fullImageName}:${shortCommit}", '.')
                    
                    // Etiqueta la imagen también como 'latest'
                    dockerImage.tag("${fullImageName}:latest")
                }
            }
        }

        stage('Push Image') {
            steps {
                script {
                    def shortCommit = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                    def normalizedImageName = env.IMAGE_NAME.replaceAll('^ghcr.io/', '')
                    def fullImageName = "${env.REGISTRY}/${normalizedImageName}"
                    
                    // Usa las credenciales configuradas en Jenkins para autenticarse con el registro
                    docker.withRegistry("https://${env.REGISTRY}", env.CREDENTIAL_ID) {
                        // Sube la imagen con la etiqueta del commit
                        docker.image("${fullImageName}:${shortCommit}").push()
                        
                        // Sube la etiqueta 'latest'
                        docker.image("${fullImageName}:latest").push()
                    }
                }
            }
        }
    }
    post {
        always {
            // Opcional: limpia la imagen de Docker del agente de Jenkins para ahorrar espacio
            script {
                def shortCommit = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                def fullImageName = "${env.REGISTRY}/${env.IMAGE_NAME}"
                sh "docker rmi ${fullImageName}:${shortCommit} || true"
                sh "docker rmi ${fullImageName}:latest || true"
            }
        }
    }
}