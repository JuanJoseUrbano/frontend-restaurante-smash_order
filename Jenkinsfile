pipeline {
    agent any
    
    environment {
        DOCKER_REGISTRY = 'ghcr.io'
        DOCKER_IMAGE = 'juanjoseurbano/frontend-restaurante-smash_order'
        DOCKER_CREDENTIALS = 'ghcr-credentials'  // Debe coincidir con el ID en Jenkins
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo '📥 Descargando código fuente...'
                checkout scm
                sh '''
                    echo "📂 Workspace: ${WORKSPACE}"
                    echo "📄 Archivos disponibles:"
                    ls -la
                '''
            }
        }
        
        stage('Build & Tag Docker Image') {
            steps {
                script {
                    def imageTag = "${DOCKER_REGISTRY}/${DOCKER_IMAGE}:${env.BRANCH_NAME}-${env.BUILD_NUMBER}"
                    def latestTag = "${DOCKER_REGISTRY}/${DOCKER_IMAGE}:${env.BRANCH_NAME}-latest"
                    
                    echo "🐳 Construyendo imagen Docker: ${imageTag}"
                    sh """
                        docker build -t ${imageTag} .
                        docker tag ${imageTag} ${latestTag}
                    """
                    
                    env.IMAGE_TAG = imageTag
                    env.LATEST_TAG = latestTag
                }
            }
        }
        
        stage('Push to GitHub Container Registry') {
            steps {
                script {
                    echo "📤 Subiendo imagen a GHCR..."
                    
                    // Método 1: Usando withRegistry (recomendado)
                    docker.withRegistry("https://${DOCKER_REGISTRY}", DOCKER_CREDENTIALS) {
                        sh """
                            docker push ${env.IMAGE_TAG}
                            docker push ${env.LATEST_TAG}
                        """
                    }
                    
                    echo "✅ Imagen subida: ${env.IMAGE_TAG}"
                    echo "✅ Tag latest: ${env.LATEST_TAG}"
                }
            }
        }
        
        stage('Cleanup Local Images') {
            steps {
                script {
                    echo "🧹 Limpiando imágenes locales..."
                    sh """
                        docker rmi ${env.IMAGE_TAG} || true
                        docker rmi ${env.LATEST_TAG} || true
                    """
                }
            }
        }
    }
    
    post {
        success {
            echo '✅ Pipeline ejecutado exitosamente!'
            echo "🎉 Imagen disponible en: ${DOCKER_REGISTRY}/${DOCKER_IMAGE}"
        }
        failure {
            echo '❌ Pipeline falló. Revisa los logs.'
        }
        always {
            echo '🧹 Limpiando workspace...'
            cleanWs()
        }
    }
}