pipeline {
    agent any
    
    environment {
        DOCKER_REGISTRY = 'ghcr.io'
        DOCKER_IMAGE = 'juanjoseurbano/frontend-restaurante-smash_order'
        DOCKER_CREDENTIALS = 'ghcr-credentials'
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo '📥 Descargando código fuente...'
                checkout scm
                sh '''
                    echo "📂 Workspace actual: ${WORKSPACE}"
                    echo "📄 Contenido del workspace tras checkout:"
                    ls -la ${WORKSPACE}
                '''
            }
        }
        
        stage('Install & Build') {
            steps {
                sh """
                    echo "🚀 Trabajando en el workspace raíz"
                    echo "📦 Archivos disponibles:"
                    ls -la
                    
                    echo "🧹 Limpiando directorios problemáticos..."
                    rm -rf frontend-restaurante-smash_order frontend-restaurante-smash_order@tmp || true
                    
                    echo "📄 Verificando package.json:"
                    if [ -f package.json ]; then
                        echo "✅ package.json encontrado"
                        cat package.json | head -n 10
                    else
                        echo "❌ package.json NO encontrado"
                        exit 1
                    fi
                    
                    echo "🐳 Ejecutando build dentro del contenedor Node..."
                    docker run --rm -v \${WORKSPACE}:/app -w /app node:22-alpine sh -c '
                        echo "📦 Archivos en /app:"
                        ls -la /app
                        
                        echo "📋 Verificando package.json en contenedor:"
                        cat /app/package.json | head -n 10
                        
                        if [ -f package-lock.json ]; then
                            echo "📦 Ejecutando npm ci..."
                            npm ci
                        else
                            echo "📦 Ejecutando npm install..."
                            npm install
                        fi
                        
                        echo "🏗️ Ejecutando build..."
                        npm run build
                        
                        echo "✅ Build completado. Verificando dist:"
                        ls -la dist/ || ls -la build/ || echo "Directorio de salida no encontrado"
                    '
                """
            }
        }
        
        stage('Build & Tag Image') {
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
        
        stage('Push Image') {
            steps {
                script {
                    echo "📤 Subiendo imagen a GitHub Container Registry..."
                    docker.withRegistry("https://${DOCKER_REGISTRY}", DOCKER_CREDENTIALS) {
                        sh """
                            docker push ${env.IMAGE_TAG}
                            docker push ${env.LATEST_TAG}
                        """
                    }
                    echo "✅ Imagen subida exitosamente: ${env.IMAGE_TAG}"
                }
            }
        }
    }
    
    post {
        success {
            echo '✅ Pipeline ejecutado exitosamente!'
        }
        failure {
            echo '❌ Error en el build.'
        }
        always {
            echo '🧹 Limpiando workspace...'
            cleanWs()
        }
    }
}