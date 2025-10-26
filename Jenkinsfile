pipeline {
    agent any

    environment {
        REGISTRY = 'ghcr.io'
        IMAGE_NAME = 'victorandres123/frontend-restaurante-smash_order'
        CREDENTIAL_ID = 'ghcr-credentials'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install & Build') {
            agent {
                docker {
                    image 'node:22-alpine'
                    args '-v $PWD:/app -w /app'
                }
            }
            steps {
                script {
                    sh 'npm ci'
                    sh 'npm run build'
                }
            }
        }

        stage('Build & Tag Image') {
            when {
                expression {
                    // Puedes cambiar BRANCH_NAME por GIT_BRANCH si tu Jenkins lo usa así
                    return env.BRANCH_NAME == 'main' || env.BRANCH_NAME == 'develop' || env.BRANCH_NAME == 'quality'
                }
            }
            steps {
                script {
                    def shortCommit = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                    def fullImageName = "${env.REGISTRY}/${env.IMAGE_NAME}"
                    docker.build("${fullImageName}:${shortCommit}", '.')
                    sh "docker tag ${fullImageName}:${shortCommit} ${fullImageName}:latest"
                }
            }
        }

        stage('Push Image') {
            when {
                expression {
                    return env.BRANCH_NAME == 'main' || env.BRANCH_NAME == 'develop' || env.BRANCH_NAME == 'quality'
                }
            }
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