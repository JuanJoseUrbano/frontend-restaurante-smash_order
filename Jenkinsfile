pipeline {
    agent any

    environment {
        REGISTRY = 'ghcr.io'
        IMAGE_NAME = 'your-github-username-or-org/frontend-restaurante-smash_order'
        CREDENTIAL_ID = 'ghcr-credentials'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        // 👇 Nueva etapa para compilar el frontend
        stage('Install & Build') {
            steps {
                script {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Build & Tag Image') {
            steps {
                script {
                    def shortCommit = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                    def fullImageName = "${env.REGISTRY}/${env.IMAGE_NAME}"
                    
                    def dockerImage = docker.build("${fullImageName}:${shortCommit}", '.')
                    dockerImage.tag("${fullImageName}:latest")
                }
            }
        }

        stage('Push Image') {
            steps {
                script {
                    def shortCommit = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                    def fullImageName = "${env.REGISTRY}/${env.IMAGE_NAME}"
                    
                    docker.withRegistry("https://${env.REGISTRY}", env.CREDENTIAL_ID) {
                        docker.image("${fullImageName}:${shortCommit}").push()
                        docker.image("${fullImageName}:latest").push()
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                def shortCommit = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                def fullImageName = "${env.REGISTRY}/${env.IMAGE_NAME}"
                sh "docker rmi ${fullImageName}:${shortCommit} || true"
                sh "docker rmi ${fullImageName}:latest || true"
            }
        }
    }
}
